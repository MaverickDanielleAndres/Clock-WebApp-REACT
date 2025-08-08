import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Play, Pause, Square, RotateCcw, Flag } from 'lucide-react';

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (time) => {
    const totalSeconds = Math.floor(time / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((time % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const start = () => {
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const addLap = () => {
    if (time > 0) {
      const lapTime = time;
      const lapNumber = laps.length + 1;
      const previousLapTime = laps.length > 0 ? laps[laps.length - 1].time : 0;
      const splitTime = lapTime - previousLapTime;
      
      setLaps(prev => [...prev, {
        number: lapNumber,
        time: lapTime,
        split: splitTime,
        formatted: formatTime(lapTime),
        splitFormatted: formatTime(splitTime)
      }]);
    }
  };

  const containerStyle = {
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
    minWidth: '400px',
    maxWidth: '500px',
    transition: 'all 0.3s ease'
  };

  const displayStyle = {
    fontSize: '4rem',
    fontFamily: 'monospace',
    fontWeight: '300',
    backgroundImage: `linear-gradient(45deg, ${isDark ? '#ff6b6b' : '#667eea'}, ${isDark ? '#4ecdc4' : '#764ba2'})`,
backgroundSize: '100%',
backgroundRepeat: 'no-repeat',

    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textAlign: 'center',
    letterSpacing: '0.1em',
    margin: '1rem 0'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem'
  };

  const buttonStyle = (variant = 'primary') => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: variant === 'primary' 
      ? (isDark ? '#4ecdc4' : '#667eea')
      : variant === 'danger'
      ? (isDark ? '#ff6b6b' : '#e74c3c')
      : variant === 'success'
      ? (isDark ? '#51cf66' : '#38a169')
      : (isDark ? '#4a5568' : '#718096'),
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(0)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'
    }
  });

  const lapContainerStyle = {
    width: '100%',
    maxHeight: '300px',
    overflowY: 'auto',
    borderRadius: '12px',
    backgroundColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',
    padding: '1rem'
  };

  const lapItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
    fontSize: '1rem',
    fontFamily: 'monospace'
  };

  const lapHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    opacity: 0.8
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>Stopwatch</h2>
      
      <div style={displayStyle}>
        {formatTime(time)}
      </div>
      
      <div style={buttonContainerStyle}>
        {!isRunning ? (
          <button
            onClick={start}
            style={buttonStyle('primary')}
          >
            <Play size={20} />
            Start
          </button>
        ) : (
          <button
            onClick={pause}
            style={buttonStyle('secondary')}
          >
            <Pause size={20} />
            Pause
          </button>
        )}
        
        <button
          onClick={addLap}
          style={buttonStyle('success')}
          disabled={time === 0}
        >
          <Flag size={20} />
          Lap
        </button>
        
        <button
          onClick={reset}
          style={buttonStyle('danger')}
        >
          <RotateCcw size={20} />
          Reset
        </button>
      </div>
      
      {laps.length > 0 && (
        <div style={lapContainerStyle}>
          <div style={lapHeaderStyle}>
            <span>Lap</span>
            <span>Split Time</span>
            <span>Total Time</span>
          </div>
          {laps.slice().reverse().map((lap, index) => (
            <div key={lap.number} style={lapItemStyle}>
              <span style={{ fontWeight: 'bold' }}>#{lap.number}</span>
              <span style={{ color: isDark ? '#4ecdc4' : '#667eea' }}>
                {lap.splitFormatted}
              </span>
              <span>{lap.formatted}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Stopwatch;