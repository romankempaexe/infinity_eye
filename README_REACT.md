# Infinity Eye - React + TypeScript

Modern bike station monitoring application built with React, TypeScript, and Leaflet.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Map/            # Map-related components
│   ├── StationPanel/   # Station list panel
│   ├── Controls/       # Map controls
│   ├── Modal/          # Modal dialogs
│   └── LoadingScreen/  # Loading screen
├── hooks/              # Custom React hooks
├── services/           # API services
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── constants/          # App constants
└── App.tsx             # Main app component
```

## 🛠️ Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Leaflet** - Map integration
- **Zustand** - State management
- **Chart.js** - Data visualization
- **ESLint** - Code linting

## 📝 Features

- ✅ Interactive map with Leaflet
- ✅ Station management (add, edit, delete)
- ✅ Real-time occupancy tracking
- ✅ Heat map visualization
- ✅ Utilization charts and analytics
- ✅ Reverse geocoding
- ✅ Multiple map layers
- ✅ Responsive design
- ✅ TypeScript type safety

## 🔧 Development

The old vanilla JS version is backed up as `index.html.backup`.

The new React app uses:
- Vite for fast development and building
- TypeScript for type safety
- Modern React patterns (hooks, functional components)
- Zustand for simple and efficient state management

## 🚀 Deployment

1. Build the production bundle:
   ```bash
   npm run build
   ```

2. The `dist/` folder contains the optimized production build.

3. Deploy to your hosting platform of choice.

## 📦 Backend Server

The app expects a Python backend server (server.py) to be running on port 5000 for:
- Station data persistence (`/stations.json`)
- Reverse geocoding API (`/api/reverse-geocode`)

Make sure to start your Python server before running the React app.
