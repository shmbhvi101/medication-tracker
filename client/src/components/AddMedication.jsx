// client/src/components/AddMedication.jsx
import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

function AddMedication({ editingMed, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 1,
    times: ['09:00'],
    totalStock: ''
  });

  useEffect(() => {
    if (editingMed) {
      setFormData({
        name: editingMed.name,
        dosage: editingMed.dosage || '',
        frequency: editingMed.frequency,
        times: editingMed.times || ['09:00'],
        totalStock: editingMed.totalStock
      });
    }
  }, [editingMed]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'frequency' || name === 'totalStock' ? parseInt(value) || '' : value
    }));
  };

  const handleTimeChange = (index, value) => {
    const newTimes = [...formData.times];
    newTimes[index] = value;
    setFormData(prev => ({ ...prev, times: newTimes }));
  };

  const addTime = () => {
    setFormData(prev => ({
      ...prev,
      times: [...prev.times, '12:00'],
      frequency: prev.times.length + 1
    }));
  };

  const removeTime = (index) => {
    if (formData.times.length > 1) {
      const newTimes = formData.times.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        times: newTimes,
        frequency: newTimes.length
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.totalStock || formData.times.length === 0) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>{editingMed ? 'Edit Medication' : 'Add New Medication'}</h2>
          <button className="close-btn" onClick={onCancel}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Medication Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Aspirin"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dosage">Dosage (Optional)</label>
            <input
              id="dosage"
              type="text"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              placeholder="e.g., 500mg"
            />
          </div>

          <div className="form-group">
            <label htmlFor="totalStock">Total Stock *</label>
            <input
              id="totalStock"
              type="number"
              name="totalStock"
              value={formData.totalStock}
              onChange={handleChange}
              placeholder="Number of doses"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Reminder Times *</label>
            <div className="times-list">
              {formData.times.map((time, index) => (
                <div key={index} className="time-input-group">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                  />
                  {formData.times.length > 1 && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeTime(index)}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="add-time-btn"
              onClick={addTime}
            >
              <Plus size={18} /> Add Another Time
            </button>
          </div>

          <div className="form-info">
            <p>Frequency: <strong>{formData.times.length}x daily</strong></p>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {editingMed ? 'Update Medication' : 'Add Medication'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMedication;