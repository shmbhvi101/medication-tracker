// client/src/components/Reminders.jsx
import { useState, useEffect } from 'react';
import { Bell, Volume2, Settings } from 'lucide-react';

function Reminders({ medications }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [upcomingDoses, setUpcomingDoses] = useState([]);
  const [notificationHistory, setNotificationHistory] = useState([]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    }
  };

  const playSound = () => {
    if (soundEnabled) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  };

  const sendNotification = (medName, time) => {
    if (!notificationsEnabled) return;

    playSound();

    const notification = new Notification('💊 Medication Reminder', {
      body: `Time to take ${medName}!`,
      icon: '💊',
      tag: `med-${medName}-${time}`,
      requireInteraction: true
    });

    addToHistory(medName, time);

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  };

  const addToHistory = (medName, time) => {
    const newNotification = {
      id: Date.now(),
      medName,
      time,
      timestamp: new Date().toLocaleTimeString()
    };
    setNotificationHistory(prev => [newNotification, ...prev.slice(0, 9)]);
  };

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                         now.getMinutes().toString().padStart(2, '0');
      const today = now.toDateString();

      const upcoming = [];

      medications.forEach(med => {
        med.times.forEach(time => {
          const [medHour, medMin] = time.split(':').map(Number);
          const [nowHour, nowMin] = currentTime.split(':').map(Number);
          
          const medTimeInMinutes = medHour * 60 + medMin;
          const nowInMinutes = nowHour * 60 + nowMin;
          const diffMinutes = medTimeInMinutes - nowInMinutes;

          const alreadyTaken = med.dosesHistory.some(d => 
            new Date(d.date).toDateString() === today && 
            d.time === time && 
            d.status === 'taken'
          );

          if (diffMinutes >= 0 && diffMinutes <= 15 && !alreadyTaken) {
            upcoming.push({
              medId: med._id,
              medName: med.name,
              time,
              minutesUntil: diffMinutes,
              dosage: med.dosage
            });

            if (diffMinutes === 0) {
              sendNotification(med.name, time);
            }
          }
        });
      });

      setUpcomingDoses(upcoming.sort((a, b) => a.minutesUntil - b.minutesUntil));
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60000);

    return () => clearInterval(interval);
  }, [medications, notificationsEnabled, soundEnabled]);

  return (
    <div className="reminders-wrapper">
      <div className="reminders-container">
        <h2 className="section-title">🔔 Smart Reminders</h2>

        {/* Settings Section */}
        <div className="settings-section">
          <div className="settings-header">
            <Settings size={24} />
            <h3>Reminder Settings</h3>
          </div>
          
          <div className="settings-grid">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Browser Notifications</h4>
                <p>Get alerts when it's time to take your medication</p>
              </div>
              <button
                className={`setting-toggle ${notificationsEnabled ? 'active' : ''}`}
                onClick={requestNotificationPermission}
              >
                {notificationsEnabled ? '✅ Enabled' : 'Enable'}
              </button>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Sound Alerts</h4>
                <p>Play a sound when reminder is triggered</p>
              </div>
              <button
                className={`setting-toggle ${soundEnabled ? 'active' : ''}`}
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                <Volume2 size={18} /> {soundEnabled ? 'On' : 'Off'}
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Doses */}
        <div className="upcoming-section">
          <div className="section-header">
            <h3>⏰ Upcoming (Next 15 Minutes)</h3>
            <span className="badge">{upcomingDoses.length}</span>
          </div>

          {upcomingDoses.length > 0 ? (
            <div className="upcoming-list">
              {upcomingDoses.map((dose, idx) => (
                <div key={idx} className={`upcoming-card ${dose.minutesUntil === 0 ? 'urgent' : 'soon'}`}>
                  <div className="dose-details">
                    <h4>{dose.medName}</h4>
                    {dose.dosage && <p className="dosage-text">{dose.dosage}</p>}
                  </div>
                  <div className="dose-time">
                    <span className="time-display">{dose.time}</span>
                    <span className={`time-status ${dose.minutesUntil === 0 ? 'now' : ''}`}>
                      {dose.minutesUntil === 0 ? '🔴 NOW!' : `⏱️ In ${dose.minutesUntil}m`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Bell size={48} />
              <p>No doses in the next 15 minutes</p>
            </div>
          )}
        </div>

        {/* History */}
        <div className="history-section">
          <div className="section-header">
            <h3>📋 Notification History</h3>
            <span className="badge">{notificationHistory.length}</span>
          </div>

          {notificationHistory.length > 0 ? (
            <div className="history-list">
              {notificationHistory.map(notif => (
                <div key={notif.id} className="history-item">
                  <div className="history-med-info">
                    <p className="history-med">{notif.medName}</p>
                    <p className="history-time">{notif.time}</p>
                  </div>
                  <p className="history-stamp">{notif.timestamp}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Bell size={48} />
              <p>No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reminders;