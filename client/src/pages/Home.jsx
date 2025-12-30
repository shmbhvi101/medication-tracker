// client/src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Pill, Plus, Calendar, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react';
import MedicationList from '../components/MedicationList';
import AddMedication from '../components/AddMedication';
import TodaySchedule from '../components/TodaySchedule';

function Home({ 
  medications, 
  onAddMedication, 
  onUpdateMedication, 
  onDeleteMedication, 
  onMarkDose, 
  onRefillMedication,
  currentPage,
  setCurrentPage,
  editingMed,
  setEditingMed 
}) {
  const [stats, setStats] = useState({
    totalMedications: 0,
    lowStockCount: 0,
    todaysDoses: 0,
    completedDoses: 0
  });

  useEffect(() => {
    calculateStats();
  }, [medications]);

  const calculateStats = () => {
    const today = new Date().toDateString();
    let lowStockCount = 0;
    let todaysDoses = 0;
    let completedDoses = 0;

    medications.forEach(med => {
      // Low stock count - only if stock is low AND greater than 0
      if (med.currentStock > 0 && med.currentStock <= med.lowStockThreshold) {
        lowStockCount++;
      }

      // Today's doses - count all doses scheduled for today
      med.times.forEach(time => {
        const todaysDose = med.dosesHistory.find(d => 
          new Date(d.date).toDateString() === today && d.time === time
        );
        // Count all scheduled doses
        todaysDoses++;
        
        // Count completed doses today
        if (todaysDose && todaysDose.status === 'taken') {
          completedDoses++;
        }
      });
    });

    setStats({
      totalMedications: medications.length,
      lowStockCount,
      todaysDoses,
      completedDoses
    });
  };

  return (
    <div className="home-container">
      {/* Dashboard Stats - Only show on list view */}
      {currentPage === 'list' && medications.length > 0 && (
        <div className="dashboard-stats">
          <div className="stat-card total">
            <div className="stat-icon">
              <Pill size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Active Medications</p>
              <h3 className="stat-value">{stats.totalMedications}</h3>
            </div>
          </div>

          <div className="stat-card completed">
            <div className="stat-icon">
              <CheckCircle2 size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Completed Today</p>
              <h3 className="stat-value">{stats.completedDoses}/{stats.todaysDoses}</h3>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">
              <AlertCircle size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Low Stock</p>
              <h3 className="stat-value">{stats.lowStockCount}</h3>
            </div>
          </div>

          <div className="stat-card schedule">
            <div className="stat-icon">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Today's Schedule</p>
              <h3 className="stat-value">{stats.todaysDoses}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Content Sections */}
      {currentPage === 'list' && (
        <MedicationList
          medications={medications}
          onDelete={onDeleteMedication}
          onEdit={(med) => {
            setEditingMed(med);
            setCurrentPage('add');
          }}
          onRefill={onRefillMedication}
          onMarkDose={onMarkDose}
        />
      )}

      {currentPage === 'schedule' && (
        <TodaySchedule
          medications={medications}
          onMarkDose={onMarkDose}
        />
      )}

      {currentPage === 'add' && (
        <AddMedication
          editingMed={editingMed}
          onSubmit={editingMed ? 
            (med) => {
              onUpdateMedication(editingMed._id, med);
              setEditingMed(null);
            } :
            (med) => {
              onAddMedication(med);
              setEditingMed(null);
            }
          }
          onCancel={() => {
            setCurrentPage('list');
            setEditingMed(null);
          }}
        />
      )}
    </div>
  );
}

export default Home;