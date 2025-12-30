// client/src/components/TodaySchedule.jsx
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

function TodaySchedule({ medications, onMarkDose }) {
  const [scheduleItems, setScheduleItems] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setCurrentTime(new Date());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    const items = [];

    medications.forEach(med => {
      med.times.forEach((time, idx) => {
        // Create a unique key combining time and index to handle multiple doses at same time
        const doseKey = `${time}-${idx}`;
        
        const doseRecord = med.dosesHistory.find(d => 
          new Date(d.date).toDateString() === today && d.time === time
        );

        items.push({
          medId: med._id,
          medName: med.name,
          dosage: med.dosage,
          time,
          doseKey,
          status: doseRecord ? doseRecord.status : 'pending',
          lowStock: med.currentStock <= med.lowStockThreshold,
          currentStock: med.currentStock,
          totalStock: med.totalStock
        });
      });
    });

    items.sort((a, b) => a.time.localeCompare(b.time));
    setScheduleItems(items);
  }, [medications]);

  const timeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const currentTimeInMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  const getDueStatus = (time) => {
    const itemTime = timeToMinutes(time);
    const diff = itemTime - currentTimeInMinutes;
    
    if (diff < 0 && diff > -60) return 'overdue';
    if (diff >= -15 && diff <= 60) return 'due-soon';
    return 'scheduled';
  };

  const formatTime = (time) => {
    const [h, m] = time.split(':');
    return new Date(2000, 0, 1, h, m).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const groupedByStatus = {
    overdue: scheduleItems.filter(item => item.status === 'pending' && getDueStatus(item.time) === 'overdue'),
    dueSoon: scheduleItems.filter(item => item.status === 'pending' && getDueStatus(item.time) === 'due-soon'),
    taken: scheduleItems.filter(item => item.status === 'taken'),
    skipped: scheduleItems.filter(item => item.status === 'skipped'),
    scheduled: scheduleItems.filter(item => item.status === 'pending' && getDueStatus(item.time) === 'scheduled')
  };

  const renderSection = (title, items, className, icon) => {
    if (items.length === 0) return null;

    return (
      <div key={className} className={`schedule-section ${className}`}>
        <div className="section-header">
          {icon}
          <h3>{title}</h3>
          <span className="count">{items.length}</span>
        </div>
        <div className="schedule-items">
          {items.map((item, idx) => (
            <div key={idx} className={`schedule-item ${item.status || 'pending'}`}>
              <div className="item-time">
                <Clock size={20} />
                <span className="time">{formatTime(item.time)}</span>
              </div>

              <div className="item-details">
                <h4>{item.medName}</h4>
                {item.dosage && <p>{item.dosage}</p>}
                {item.lowStock && (
                  <div className="low-stock-warning">
                    <AlertCircle size={14} />
                    Stock: {item.currentStock}
                  </div>
                )}
              </div>

              <div className="item-actions">
                {item.status === 'pending' && (
                  <>
                    <button
                      className="action-btn taken-btn"
                      onClick={() => onMarkDose(item.medId, 'taken', item.time)}
                      title="Mark as taken"
                    >
                      <CheckCircle size={20} />
                    </button>
                    <button
                      className="action-btn skipped-btn"
                      onClick={() => onMarkDose(item.medId, 'skipped', item.time)}
                      title="Mark as skipped"
                    >
                      <XCircle size={20} />
                    </button>
                  </>
                )}
                {item.status === 'taken' && (
                  <div className="status-badge taken">
                    <CheckCircle size={18} /> Taken
                  </div>
                )}
                {item.status === 'skipped' && (
                  <div className="status-badge skipped">
                    <XCircle size={18} /> Skipped
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <h2>Today's Schedule</h2>
        <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      {scheduleItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h2>No medications scheduled for today</h2>
          <p>Add medications to see your daily schedule</p>
        </div>
      ) : (
        <div className="schedule-sections">
          {renderSection('⚠️ Overdue', groupedByStatus.overdue, 'overdue')}
          {renderSection('🔔 Due Soon', groupedByStatus.dueSoon, 'due-soon')}
          {renderSection('✅ Taken', groupedByStatus.taken, 'completed')}
          {renderSection('⏭️ Skipped', groupedByStatus.skipped, 'completed')}
          {renderSection('📋 Scheduled', groupedByStatus.scheduled, 'pending')}
        </div>
      )}
    </div>
  );
}

export default TodaySchedule;