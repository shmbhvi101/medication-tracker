// client/src/App.jsx
import { useState, useEffect } from 'react';
import { Pill, Plus, Calendar, BarChart3, Bell, Users, Download } from 'lucide-react';
import Home from './pages/Home';
import Analytics from './components/Analytics';
import Reminders from './components/Reminders';
import FamilyProfiles from './components/FamilyProfiles';
import DataExport from './components/DataExport';
import './App.css';

function App() {
  const [medications, setMedications] = useState([]);
  const [currentPage, setCurrentPage] = useState('list');
  const [editingMed, setEditingMed] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:5000/api/medications';

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setMedications(data);
    } catch (err) {
      console.error('Error fetching medications:', err);
    } finally {
      setLoading(false);
    }
  };

  const addMedication = async (med) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(med)
      });
      const newMed = await res.json();
      setMedications([newMed, ...medications]);
      setCurrentPage('list');
    } catch (err) {
      console.error('Error adding medication:', err);
    }
  };

  const updateMedication = async (id, med) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(med)
      });
      const updated = await res.json();
      setMedications(medications.map(m => m._id === id ? updated : m));
      setEditingMed(null);
      setCurrentPage('list');
    } catch (err) {
      console.error('Error updating medication:', err);
    }
  };

  const deleteMedication = async (id) => {
    if (confirm('Are you sure you want to delete this medication?')) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        setMedications(medications.filter(m => m._id !== id));
      } catch (err) {
        console.error('Error deleting medication:', err);
      }
    }
  };

  const markDose = async (id, status, time) => {
    try {
      const res = await fetch(`${API_URL}/${id}/dose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, time })
      });
      const updated = await res.json();
      setMedications(medications.map(m => m._id === id ? updated : m));
    } catch (err) {
      console.error('Error marking dose:', err);
    }
  };

  const refillMedication = async (id, quantity) => {
    try {
      const res = await fetch(`${API_URL}/${id}/refill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });
      const updated = await res.json();
      setMedications(medications.map(m => m._id === id ? updated : m));
    } catch (err) {
      console.error('Error refilling medication:', err);
    }
  };

  return (
    <div className="app-container">
      <div className="navbar">
        <div className="navbar-content">
          <div className="logo">
            <Pill className="logo-icon" />
            <h1>MediTrack</h1>
          </div>
          <div className="nav-buttons">
            <button
              className={`nav-btn ${currentPage === 'list' ? 'active' : ''}`}
              onClick={() => setCurrentPage('list')}
            >
              <Pill size={20} /> Medications
            </button>
            <button
              className={`nav-btn ${currentPage === 'schedule' ? 'active' : ''}`}
              onClick={() => setCurrentPage('schedule')}
            >
              <Calendar size={20} /> Today
            </button>
            <button
              className={`nav-btn ${currentPage === 'analytics' ? 'active' : ''}`}
              onClick={() => setCurrentPage('analytics')}
            >
              <BarChart3 size={20} /> Analytics
            </button>
            <button
              className={`nav-btn ${currentPage === 'reminders' ? 'active' : ''}`}
              onClick={() => setCurrentPage('reminders')}
            >
              <Bell size={20} /> Reminders
            </button>
            <button
              className={`nav-btn ${currentPage === 'family' ? 'active' : ''}`}
              onClick={() => setCurrentPage('family')}
            >
              <Users size={20} /> Family
            </button>
            <button
              className={`nav-btn ${currentPage === 'export' ? 'active' : ''}`}
              onClick={() => setCurrentPage('export')}
            >
              <Download size={20} /> Export
            </button>
            <button
              className={`nav-btn add-btn ${currentPage === 'add' ? 'active' : ''}`}
              onClick={() => {
                setEditingMed(null);
                setCurrentPage('add');
              }}
            >
              <Plus size={20} /> Add
            </button>
          </div>
        </div>
      </div>

      <div className="page-content">
        {loading && <div className="loading">Loading...</div>}

        {!loading && (
          <>
            {currentPage === 'analytics' && (
              <Analytics medications={medications} />
            )}

            {currentPage === 'reminders' && (
              <Reminders medications={medications} />
            )}

            {currentPage === 'family' && (
              <FamilyProfiles />
            )}

            {currentPage === 'export' && (
              <DataExport medications={medications} onImport={async (importedMeds) => {
                // Sync imported medications with backend
                for (const med of importedMeds) {
                  try {
                    await fetch(API_URL, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(med)
                    });
                  } catch (err) {
                    console.error('Error importing medication:', err);
                  }
                }
                fetchMedications();
              }} />
            )}

            {(currentPage === 'list' || currentPage === 'schedule' || currentPage === 'add') && (
              <Home
                medications={medications}
                onAddMedication={addMedication}
                onUpdateMedication={updateMedication}
                onDeleteMedication={deleteMedication}
                onMarkDose={markDose}
                onRefillMedication={refillMedication}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                editingMed={editingMed}
                setEditingMed={setEditingMed}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;