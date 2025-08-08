import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';

const Timer = () => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    // Create audio for alarm
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzemzfPXgjMGHm7A7+OZURE');
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            playAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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
  }, [isRunning, timeLeft]);

  const playAlarm = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
    // Visual notification
    document.title = '⏰ Timer Finished!';
    setTimeout(() => {
      document.title = 'Clock App';
    }, 5000);
  };

  const handleInputChange = (field, value) => {
    const numValue = Math.max(0, Math.min(59, parseInt(value) || 0));
    if (field === 'hours') {
      setTime(prev => ({ ...prev, hours: Math.min(23, numValue) }));
    } else {
      setTime(prev => ({ ...prev, [field]: numValue }));
    }
  };

  const startTimer = () => {
    if (totalSeconds === 0) {
      const total = time.hours * 3600 + time.minutes * 60 + time.seconds;
      if (total > 0) {
        setTotalSeconds(total);
        setTimeLeft(total);
        setIsRunning(true);
      }
    } else {
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setTotalSeconds(0);
    setTime({ hours: 0, minutes: 0, seconds: 0 });
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

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
    minWidth: '350px',
    transition: 'all 0.3s ease'
  };

  const inputContainerStyle = {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    marginBottom: '1rem'
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const inputStyle = {
    width: '60px',
    padding: '0.5rem',
    borderRadius: '8px',
    border: `2px solid ${isDark ? '#4a5568' : '#e2e8f0'}`,
    backgroundColor: isDark ? '#2d3748' : '#ffffff',
    color: isDark ? '#ffffff' : '#333333',
    textAlign: 'center',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    outline: 'none',
    transition: 'all 0.3s ease'
  };

  const labelStyle = {
    fontSize: '0.8rem',
    fontWeight: '500',
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const displayStyle = {
    fontSize: '4rem',
    fontFamily: 'monospace',
    fontWeight: '300',
    background: `linear-gradient(45deg, ${isDark ? '#ff6b6b' : '#667eea'}, ${isDark ? '#4ecdc4' : '#764ba2'})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textAlign: 'center',
    letterSpacing: '0.1em'
  };

  const progressBarStyle = {
    width: '100%',
    height: '8px',
    backgroundColor: isDark ? '#4a5568' : '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
    margin: '1rem 0'
  };

  const progressFillStyle = {
    height: '100%',
    backgroundColor: isDark ? '#4ecdc4' : '#667eea',
    borderRadius: '4px',
    transition: 'width 1s linear',
    width: `${progress}%`
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
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
      : (isDark ? '#4a5568' : '#718096'),
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(0)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'
    }
  });

  return (
    <div style={containerStyle}>
      <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>Timer</h2>
      
      {!isRunning && timeLeft === 0 && (
        <div style={inputContainerStyle}>
          <div style={inputGroupStyle}>
            <input
              type="number"
              min="0"
              max="23"
              value={time.hours}
              onChange={(e) => handleInputChange('hours', e.target.value)}
              style={inputStyle}
            />
            <span style={labelStyle}>Hours</span>
          </div>
          <span style={{ fontSize: '2rem', opacity: 0.5 }}>:</span>
          <div style={inputGroupStyle}>
            <input
              type="number"
              min="0"
              max="59"
              value={time.minutes}
              onChange={(e) => handleInputChange('minutes', e.target.value)}
              style={inputStyle}
            />
            <span style={labelStyle}>Minutes</span>
          </div>
          <span style={{ fontSize: '2rem', opacity: 0.5 }}>:</span>
          <div style={inputGroupStyle}>
            <input
              type="number"
              min="0"
              max="59"
              value={time.seconds}
              onChange={(e) => handleInputChange('seconds', e.target.value)}
              style={inputStyle}
            />
            <span style={labelStyle}>Seconds</span>
          </div>
        </div>
      )}
      
      {timeLeft > 0 && (
        <>
          <div style={displayStyle}>
            {formatTime(timeLeft)}
          </div>
          <div style={progressBarStyle}>
            <div style={progressFillStyle}></div>
          </div>
        </>
      )}
      
      <div style={buttonContainerStyle}>
        {!isRunning ? (
          <button
            onClick={startTimer}
            style={buttonStyle('primary')}
            disabled={timeLeft === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0}
          >
            <Play size={20} />
            Start
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            style={buttonStyle('secondary')}
          >
            <Pause size={20} />
            Pause
          </button>
        )}
        
        <button
          onClick={resetTimer}
          style={buttonStyle('danger')}
        >
          <RotateCcw size={20} />
          Reset
        </button>
      </div>
      
      {timeLeft === 0 && totalSeconds > 0 && (
        <div style={{
          padding: '1rem',
          backgroundColor: isDark ? '#ff6b6b' : '#e74c3c',
          color: '#ffffff',
          borderRadius: '8px',
          fontWeight: 'bold',
          animation: 'pulse 1s infinite'
        }}>
          ⏰ Timer Finished!
        </div>
      )}
    </div>
  );
};

export default Timer;