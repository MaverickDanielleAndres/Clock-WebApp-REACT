import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Plus, Trash2, Bell, BellOff, Edit2, Save, X, Volume2 } from 'lucide-react';

const Alarm = () => {
  const [alarms, setAlarms] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newAlarm, setNewAlarm] = useState({
    time: '',
    label: '',
    days: [],
    snooze: 5,
    enabled: true,
    sound: 'default'
  });
  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  const { isDark } = useTheme();

  const daysOfWeek = [
    { key: 'sun', label: 'S' },
    { key: 'mon', label: 'M' },
    { key: 'tue', label: 'T' },
    { key: 'wed', label: 'W' },
    { key: 'thu', label: 'T' },
    { key: 'fri', label: 'F' },
    { key: 'sat', label: 'S' }
  ];

  const soundOptions = [
    { value: 'default', label: 'Default' },
    { value: 'gentle', label: 'Gentle' },
    { value: 'loud', label: 'Loud' },
    { value: 'nature', label: 'Nature' }
  ];

  useEffect(() => {
    // Load alarms from localStorage
    const savedAlarms = JSON.parse(localStorage.getItem('alarms') || '[]');
    setAlarms(savedAlarms);

    // Create audio context
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzemzfPXgjMGHm7A7+OZURE');

    // Check alarms every second
    intervalRef.current = setInterval(checkAlarms, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Save alarms to localStorage whenever alarms change
    localStorage.setItem('alarms', JSON.stringify(alarms));
  }, [alarms]);

  const checkAlarms = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const currentDay = daysOfWeek[now.getDay()].key;

    alarms.forEach(alarm => {
      if (alarm.enabled && alarm.time === currentTime) {
        if (alarm.days.length === 0 || alarm.days.includes(currentDay)) {
          triggerAlarm(alarm);
        }
      }
    });
  };

  const triggerAlarm = (alarm) => {
    // Play sound
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
    
    // Show notification
    if (Notification.permission === 'granted') {
      new Notification(`Alarm: ${alarm.label || 'Untitled'}`, {
        body: `Time: ${alarm.time}`,
        icon: '⏰'
      });
    }
    
    // Update page title
    document.title = `🔔 ${alarm.label || 'Alarm'} - ${alarm.time}`;
    
    // Show browser alert as fallback
    alert(`🔔 Alarm: ${alarm.label || 'Untitled'}\nTime: ${alarm.time}`);
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  const addAlarm = () => {
    if (newAlarm.time) {
      const alarm = {
        id: Date.now(),
        ...newAlarm,
        createdAt: new Date().toISOString()
      };
      setAlarms(prev => [...prev, alarm]);
      setNewAlarm({
        time: '',
        label: '',
        days: [],
        snooze: 5,
        enabled: true,
        sound: 'default'
      });
      setShowAddForm(false);
      requestNotificationPermission();
    }
  };

  const deleteAlarm = (id) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
  };

  const toggleAlarm = (id) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
    ));
  };

  const startEditing = (alarm) => {
    setEditingId(alarm.id);
    setNewAlarm({ ...alarm });
  };

  const saveEdit = () => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === editingId ? { ...newAlarm } : alarm
    ));
    setEditingId(null);
    setNewAlarm({
      time: '',
      label: '',
      days: [],
      snooze: 5,
      enabled: true,
      sound: 'default'
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewAlarm({
      time: '',
      label: '',
      days: [],
      snooze: 5,
      enabled: true,
      sound: 'default'
    });
  };

  const toggleDay = (day) => {
    setNewAlarm(prev => ({
      ...prev,
      days: prev.days.includes(day) 
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const formatDays = (days) => {
    if (days.length === 0) return 'Once';
    if (days.length === 7) return 'Every day';
    return days.map(day => daysOfWeek.find(d => d.key === day)?.label).join(', ');
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    padding: '2rem',
    backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    borderRadius: '20px',
    backdropFilter: 'blur(10px)',
    boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(31, 38, 135, 0.37)',
    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.18)'}`,
    color: isDark ? '#ffffff' : '#333333',
    minWidth: '500px',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflowY: 'auto',
    transition: 'all 0.3s ease'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  };

  const buttonStyle = (variant = 'primary', size = 'medium') => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: size === 'small' ? '0.5rem 1rem' : '0.75rem 1.5rem',
    borderRadius: '12px',
    border: 'none',
    fontSize: size === 'small' ? '0.9rem' : '1rem',
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
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  });

  const alarmItemStyle = (enabled) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderRadius: '12px',
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
    opacity: enabled ? 1 : 0.6,
    transition: 'all 0.3s ease'
  });

  const inputStyle = {
    padding: '0.75rem',
    borderRadius: '8px',
    border: `2px solid ${isDark ? '#4a5568' : '#e2e8f0'}`,
    backgroundColor: isDark ? '#2d3748' : '#ffffff',
    color: isDark ? '#ffffff' : '#333333',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    width: '100%'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1.5rem',
    borderRadius: '12px',
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
  };

  const dayButtonStyle = (selected) => ({
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: selected 
      ? (isDark ? '#4ecdc4' : '#667eea')
      : (isDark ? '#4a5568' : '#e2e8f0'),
    color: selected ? '#ffffff' : (isDark ? '#ffffff' : '#333333')
  });

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>Alarms</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={buttonStyle('primary', 'small')}
        >
          <Plus size={16} />
          Add Alarm
        </button>
      </div>

      {showAddForm && (
        <div style={formStyle}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Time
            </label>
            <input
              type="time"
              value={newAlarm.time}
              onChange={(e) => setNewAlarm(prev => ({ ...prev, time: e.target.value }))}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Label
            </label>
            <input
              type="text"
              placeholder="Wake up, Meeting, etc."
              value={newAlarm.label}
              onChange={(e) => setNewAlarm(prev => ({ ...prev, label: e.target.value }))}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Repeat Days
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              {daysOfWeek.map(day => (
                <button
                  key={day.key}
                  onClick={() => toggleDay(day.key)}
                  style={dayButtonStyle(newAlarm.days.includes(day.key))}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Snooze (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={newAlarm.snooze}
                onChange={(e) => setNewAlarm(prev => ({ ...prev, snooze: parseInt(e.target.value) || 5 }))}
                style={inputStyle}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Sound
              </label>
              <select
                value={newAlarm.sound}
                onChange={(e) => setNewAlarm(prev => ({ ...prev, sound: e.target.value }))}
                style={inputStyle}
              >
                {soundOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowAddForm(false)}
              style={buttonStyle('secondary', 'small')}
            >
              <X size={16} />
              Cancel
            </button>
            <button
              onClick={addAlarm}
              style={buttonStyle('success', 'small')}
              disabled={!newAlarm.time}
            >
              <Save size={16} />
              Save
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {alarms.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            opacity: 0.6,
            fontSize: '1.1rem'
          }}>
            No alarms set. Click "Add Alarm" to create one.
          </div>
        ) : (
          alarms.map(alarm => (
            <div key={alarm.id} style={alarmItemStyle(alarm.enabled)}>
              {editingId === alarm.id ? (
                <div style={{ ...formStyle, width: '100%', margin: 0 }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                      type="time"
                      value={newAlarm.time}
                      onChange={(e) => setNewAlarm(prev => ({ ...prev, time: e.target.value }))}
                      style={{ ...inputStyle, width: '150px' }}
                    />
                    <input
                      type="text"
                      placeholder="Label"
                      value={newAlarm.label}
                      onChange={(e) => setNewAlarm(prev => ({ ...prev, label: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    {daysOfWeek.map(day => (
                      <button
                        key={day.key}
                        onClick={() => toggleDay(day.key)}
                        style={dayButtonStyle(newAlarm.days.includes(day.key))}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button
                      onClick={cancelEdit}
                      style={buttonStyle('secondary', 'small')}
                    >
                      <X size={16} />
                      Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      style={buttonStyle('success', 'small')}
                    >
                      <Save size={16} />
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                      onClick={() => toggleAlarm(alarm.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: alarm.enabled ? (isDark ? '#4ecdc4' : '#667eea') : (isDark ? '#666' : '#999'),
                        cursor: 'pointer',
                        padding: '0.5rem'
                      }}
                    >
                      {alarm.enabled ? <Bell size={24} /> : <BellOff size={24} />}
                    </button>
                    
                    <div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                        {alarm.time}
                      </div>
                      <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                        {alarm.label || 'Untitled'} • {formatDays(alarm.days)}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => startEditing(alarm)}
                      style={buttonStyle('secondary', 'small')}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteAlarm(alarm.id)}
                      style={buttonStyle('danger', 'small')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {alarms.length > 0 && (
        <div style={{
          fontSize: '0.8rem',
          opacity: 0.6,
          textAlign: 'center',
          padding: '1rem',
          borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
        }}>
          <Volume2 size={16} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
          Make sure your device volume is on and notifications are enabled for the best alarm experience.
        </div>
      )}
    </div>
  );
};

export default Alarm;