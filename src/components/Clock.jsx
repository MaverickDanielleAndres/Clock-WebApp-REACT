import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const { isDark } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRotation = (unit, max) => {
    return (unit / max) * 360;
  };

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourRotation = getRotation(hours + minutes / 60, 12);
  const minuteRotation = getRotation(minutes + seconds / 60, 60);
  const secondRotation = getRotation(seconds, 60);

  const clockStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    padding: '2rem',
    backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    borderRadius: '20px',
    backdropFilter: 'blur(10px)',
    boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(31, 38, 135, 0.37)',
    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.18)'}`,
    color: isDark ? '#ffffff' : '#333333',
    transition: 'all 0.3s ease'
  };

  const analogClockStyle = {
    position: 'relative',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: `conic-gradient(from 0deg, ${isDark ? '#4c1d95' : '#667eea'}, ${isDark ? '#7c2d12' : '#764ba2'}, ${isDark ? '#4c1d95' : '#667eea'})`,
    padding: '20px',
    boxShadow: isDark ? 'inset 0 0 20px rgba(0, 0, 0, 0.5)' : 'inset 0 0 20px rgba(0, 0, 0, 0.1)',
  };

  const clockFaceStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: isDark ? '#1f1f1f' : '#ffffff',
    boxShadow: isDark ? '0 0 20px rgba(0, 0, 0, 0.8)' : '0 0 20px rgba(0, 0, 0, 0.1)',
  };

  const handStyle = (rotation, length, width, color) => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width: `${width}px`,
    height: `${length}%`,
    backgroundColor: color,
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${rotation}deg)`,
    borderRadius: '2px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)'
  });

  const centerDotStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: isDark ? '#ff6b6b' : '#e74c3c',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)'
  };

  const digitalTimeStyle = {
  fontSize: '3.5rem',
  fontWeight: '300',
  fontFamily: 'monospace',
  backgroundImage: `linear-gradient(45deg, ${isDark ? '#ff6b6b' : '#667eea'}, ${isDark ? '#4ecdc4' : '#764ba2'})`,
  backgroundSize: '100%',
  backgroundRepeat: 'no-repeat',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  letterSpacing: '0.1em'
};


  const dateStyle = {
    fontSize: '1.2rem',
    fontWeight: '400',
    opacity: 0.8,
    marginTop: '0.5rem'
  };

  const numberStyle = (number) => ({
    position: 'absolute',
    fontSize: '14px',
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#333333',
    transform: 'translate(-50%, -50%)',
    ...getNumberPosition(number)
  });

  const getNumberPosition = (number) => {
    const angle = (number * 30 - 90) * (Math.PI / 180);
    const radius = 75;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return {
      left: `${x}%`,
      top: `${y}%`
    };
  };

  return (
    <div style={clockStyle}>
      <div style={analogClockStyle}>
        <div style={clockFaceStyle}>
          {/* Numbers */}
          {[...Array(12)].map((_, i) => (
            <div key={i + 1} style={numberStyle(i + 1)}>
              {i + 1}
            </div>
          ))}
          
          {/* Hour marks */}
          {[...Array(12)].map((_, i) => (
            <div
              key={`mark-${i}`}
              style={{
                position: 'absolute',
                width: '2px',
                height: '15px',
                backgroundColor: isDark ? '#666' : '#ccc',
                left: '50%',
                top: '-15px',
                transformOrigin: '50% 95px',
                transform: `translateX(-50%) rotate(${i * 30}deg)`
              }}
            />
          ))}

          {/* Hour hand */}
          <div style={handStyle(hourRotation, 25, 4, isDark ? '#ff6b6b' : '#e74c3c')} />
          
          {/* Minute hand */}
          <div style={handStyle(minuteRotation, 35, 3, isDark ? '#4ecdc4' : '#3498db')} />
          
          {/* Second hand */}
          <div style={handStyle(secondRotation, 40, 1, isDark ? '#f39c12' : '#f39c12')} />
          
          {/* Center dot */}
          <div style={centerDotStyle} />
        </div>
      </div>
      
      <div>
        <div style={digitalTimeStyle}>{formatTime(time)}</div>
        <div style={dateStyle}>{formatDate(time)}</div>
      </div>
    </div>
  );
};

export default Clock;