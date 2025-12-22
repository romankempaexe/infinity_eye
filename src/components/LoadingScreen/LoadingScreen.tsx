import React, { useState } from 'react';
import './LoadingScreen.css';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div id="loading-screen">
      <div className="loading-brand">
        <img src="/splash.png" alt="Infinity Deep Vision Logo" className="loading-splash" />
        <div className="loading-title">INFINITY DEEP VISION</div>
        <div className="loading-text">Loading application...</div>
      </div>
      <img src="/exe.png" alt="EXE logo" className="loading-exe-logo" aria-hidden="true" />
    </div>
  );
};

export default LoadingScreen;
