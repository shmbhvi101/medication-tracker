// client/src/components/MedicationList.jsx
import { Trash2, Edit, AlertCircle, Droplet } from 'lucide-react';

function MedicationList({ medications, onDelete, onEdit, onRefill, onMarkDose }) {
  const getLowStockColor = (current, threshold) => {
    if (current <= threshold) return '#ef4444';
    if (current <= threshold * 2) return '#f97316';
    return '#10b981';
  };

  const getTodayStatus = (med) => {
    const today = new Date().toDateString();
    const totalScheduled = med.times.length; // Total doses scheduled for today
    
    // Count unique doses for today (avoid duplicates)
    const uniqueDoses = {};
    med.dosesHistory.forEach(d => {
      if (new Date(d.date).toDateString() === today) {
        uniqueDoses[d.time] = d.status; // Last entry for each time wins
      }
    });
    
    const taken = Object.values(uniqueDoses).filter(s => s === 'taken').length;
    const skipped = Object.values(uniqueDoses).filter(s => s === 'skipped').length;
    const remaining = totalScheduled - taken - skipped;
    
    return {
      taken,
      skipped,
      remaining,
      total: totalScheduled
    };
  };

  if (medications.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">💊</div>
        <h2>No medications yet</h2>
        <p>Add your first medication to get started</p>
      </div>
    );
  }

  return (
    <div className="medications-grid">
      {medications.map(med => {
        const status = getTodayStatus(med);
        const isLowStock = med.currentStock <= med.lowStockThreshold;
        const stockColor = getLowStockColor(med.currentStock, med.lowStockThreshold);

        return (
          <div key={med._id} className="med-card">
            <div className="med-header">
              <div className="med-title">
                <h3>{med.name}</h3>
                {med.dosage && <p className="dosage">{med.dosage}</p>}
              </div>
              {isLowStock && (
                <div className="low-stock-badge">
                  <AlertCircle size={16} />
                  Low Stock
                </div>
              )}
            </div>

            <div className="med-details">
              <div className="detail-row">
                <span className="label">Frequency:</span>
                <span className="value">{med.frequency}x daily</span>
              </div>
              <div className="detail-row">
                <span className="label">Times:</span>
                <span className="value">{med.times.join(', ')}</span>
              </div>
            </div>

            <div className="stock-section">
              <div className="stock-info">
                <Droplet size={18} style={{ color: stockColor }} />
                <div className="stock-text">
                  <span className="stock-label">Stock</span>
                  <span className="stock-value" style={{ color: stockColor }}>
                    {med.currentStock} / {med.totalStock}
                  </span>
                </div>
              </div>
              <div className="stock-bar">
                <div 
                  className="stock-fill" 
                  style={{
                    width: `${(med.currentStock / med.totalStock) * 100}%`,
                    backgroundColor: stockColor
                  }}
                ></div>
              </div>
            </div>

            <div className="today-status">
              <div className="status-item taken">
                <span className="status-number">{status.taken}</span>
                <span className="status-label">Taken</span>
              </div>
              <div className="status-item skipped">
                <span className="status-number">{status.skipped}</span>
                <span className="status-label">Skipped</span>
              </div>
              <div className="status-item remaining">
                <span className="status-number">{status.total - status.taken - status.skipped}</span>
                <span className="status-label">Remaining</span>
              </div>
            </div>

            <div className="med-actions">
              {isLowStock && (
                <button 
                  className="action-btn refill"
                  onClick={() => {
                    const qty = prompt('Enter quantity to refill:', med.totalStock);
                    if (qty) onRefill(med._id, parseInt(qty));
                  }}
                >
                  Refill
                </button>
              )}
              <button 
                className="action-btn edit"
                onClick={() => onEdit(med)}
              >
                <Edit size={16} />
              </button>
              <button 
                className="action-btn delete"
                onClick={() => onDelete(med._id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MedicationList;