import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Clock from './components/Clock';
import Timer from './components/Timer';
import Stopwatch from './components/Stopwatch';
import Alarm from './components/Alarm';
import {
  Sun,
  Moon,
  Clock as ClockIcon,
  Timer as TimerIcon,
  Hourglass as StopwatchIcon,
  Bell
} from "lucide-react";

import './App.css';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('clock');
  const { isDark, toggleTheme } = useTheme();

  const containerStyle = {
    minHeight: '100vh',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    background: isDark 
      ? 'linear-gradient(135deg, #232526 0%, #414345 100%)'
      : 'linear-gradient(135deg,rgb(118, 120, 127) 0%,rgb(102, 95, 109) 100%)',
    transition: 'all 0.3s ease',
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '800px',
    marginBottom: '1rem'
  };

  const titleStyle = {
  fontSize: '2.5rem',
  fontWeight: '700',
  color:'white',
  backgroundImage: `linear-gradient(45deg, ${isDark ? '#ffffff' : '#ffffff'}, ${isDark ? '#4ecdc4' : '#f0f0f0'})`,
  backgroundSize: '100%',
  backgroundRepeat: 'no-repeat',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  margin: 0,
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
};


  const themeButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
    color: isDark ? '#ffffff' : '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    ':hover': {
      transform: 'scale(1.1)',
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.3)'
    }
  };

  const navStyle = {
    display: 'flex',
    gap: '0.5rem',
    padding: '0.5rem',
    borderRadius: '16px',
    backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(31, 38, 135, 0.37)',
    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.18)'}`,
    marginBottom: '2rem'
  };

  const tabButtonStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: isActive 
      ? (isDark ? '#4ecdc4' : '#667eea')
      : 'transparent',
    color: isActive 
      ? '#ffffff'
      : (isDark ? '#ffffff' : '#333333'),
    boxShadow: isActive ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
    transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
    opacity: isActive ? 1 : 0.7,
    ':hover': {
      opacity: 1,
      backgroundColor: isActive 
        ? (isDark ? '#4ecdc4' : '#667eea')
        : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)')
    }
  });

  const contentStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'clock': return <Clock />;
      case 'timer': return <Timer />;
      case 'stopwatch': return <Stopwatch />;
      case 'alarm': return <Alarm />;
      default: return <Clock />;
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>⏰ Clock App</h1>
        <button onClick={toggleTheme} style={themeButtonStyle}>
          {isDark ? <Sun /> : <Moon />}
        </button>
      </div>

      <div style={navStyle}>
        <button
          style={tabButtonStyle(activeTab === 'clock')}
          onClick={() => setActiveTab('clock')}
        >
          <ClockIcon size={20} /> Clock
        </button>
        <button
          style={tabButtonStyle(activeTab === 'timer')}
          onClick={() => setActiveTab('timer')}
        >
          <TimerIcon size={20} /> Timer
        </button>
        <button
          style={tabButtonStyle(activeTab === 'stopwatch')}
          onClick={() => setActiveTab('stopwatch')}
        >
          <StopwatchIcon size={20} /> Stopwatch
        </button>
        <button
          style={tabButtonStyle(activeTab === 'alarm')}
          onClick={() => setActiveTab('alarm')}
        >
          <Bell size={20} /> Alarm
        </button>
      </div>

      <div style={contentStyle}>
        {renderTabContent()}
      </div>
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;
