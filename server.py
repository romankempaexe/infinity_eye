from flask import Flask, jsonify, request, send_from_directory, abort
from pathlib import Path
import ctypes
import json
import os
import sys
import threading
import time
import webbrowser

import requests

if getattr(sys, 'frozen', False):
    BASE_DIR = Path(sys._MEIPASS).resolve()  # type: ignore[attr-defined]
    DATA_BASE = Path(sys.executable).parent.resolve()
else:
    BASE_DIR = Path(__file__).parent.resolve()
    DATA_BASE = BASE_DIR

app = Flask(__name__)
DATA_FILE = DATA_BASE / 'stations.json'
FALLBACK_DATA_FILE = BASE_DIR / 'stations.json'
NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse'
NOMINATIM_HEADERS = {
    'User-Agent': 'InfinityEye/1.0 (infinity.eye@app.local)'
}


def read_stations():
    source = DATA_FILE if DATA_FILE.exists() else FALLBACK_DATA_FILE
    if not source.exists():
        return []

    try:
        with source.open('r', encoding='utf-8') as fd:
            return json.load(fd)
    except json.JSONDecodeError:
        return []


def write_stations(stations):
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    with DATA_FILE.open('w', encoding='utf-8') as fd:
        json.dump(stations, fd, ensure_ascii=False, indent=2)


@app.route('/')
def index():
    index_path = Path(__file__).parent / 'index.html'
    return index_path.read_text(encoding='utf-8'), 200, {'Content-Type': 'text/html; charset=utf-8'}


@app.route('/stations.json', methods=['GET', 'PUT'])
def stations_json():
    if request.method == 'PUT':
        payload = request.get_json(force=True)
        if not isinstance(payload, list):
            return jsonify({'error': 'Stations must be an array.'}), 400

        write_stations(payload)
        return jsonify(payload)

    return jsonify(read_stations())


@app.route('/<path:filename>')
def static_file(filename):
    target_path = (BASE_DIR / filename).resolve()
    if BASE_DIR not in target_path.parents and target_path != BASE_DIR:
        abort(404)
    if not target_path.is_file():
        abort(404)
    relative_path = target_path.relative_to(BASE_DIR)
    return send_from_directory(str(BASE_DIR), str(relative_path))


def lookup_address(lat: float, lng: float) -> str | None:
    params = {
        'format': 'jsonv2',
        'lat': lat,
        'lon': lng,
        'zoom': 18,
        'addressdetails': 1,
        'accept-language': 'sk',
        'email': 'infinity.eye@app.local'
    }
    response = requests.get(NOMINATIM_URL, params=params, headers=NOMINATIM_HEADERS, timeout=10)
    response.raise_for_status()
    data = response.json()
    return data.get('display_name')


@app.route('/api/reverse-geocode')
def api_reverse_geocode():
    lat = request.args.get('lat', type=float)
    lng = request.args.get('lng', type=float)
    if lat is None or lng is None:
        return jsonify({'error': 'lat and lng query params are required'}), 400
    try:
        address = lookup_address(lat, lng)
    except requests.RequestException as exc:
        return jsonify({'error': 'Reverse geocoding failed', 'details': str(exc)}), 502

    return jsonify({'address': address})


if __name__ == '__main__':
    HOST = '127.0.0.1'
    PORT = 5000

    def minimize_console_window():
        if os.name != 'nt':
            return
        try:
            hwnd = ctypes.windll.kernel32.GetConsoleWindow()
            if hwnd:
                ctypes.windll.user32.ShowWindow(hwnd, 6)  # SW_MINIMIZE
        except Exception:
            pass

    def open_browser_later():
        time.sleep(1.5)
        webbrowser.open(f'http://{HOST}:{PORT}/', new=2)

    minimize_console_window()
    threading.Thread(target=open_browser_later, daemon=True).start()
    app.run(host=HOST, port=PORT, debug=False, use_reloader=False)
