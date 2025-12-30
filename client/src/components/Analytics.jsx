// client/src/components/Analytics.jsx
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Flame, Target, Activity } from 'lucide-react';

function Analytics({ medications }) {
  const calculateAnalytics = () => {
    const last30Days = [];
    const today = new Date();
    
    // Create last 30 days data
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last30Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date.toDateString(),
        adherence: 0,
        total: 0
      });
    }

    // Count doses per day
    medications.forEach(med => {
      med.times.forEach(() => {
        last30Days.forEach(day => {
          day.total++;
        });
      });

      med.dosesHistory.forEach(dose => {
        if (dose.status === 'taken') {
          const doseDate = new Date(dose.date).toDateString();
          const dayData = last30Days.find(d => d.fullDate === doseDate);
          if (dayData) {
            dayData.adherence++;
          }
        }
      });
    });

    // Calculate adherence percentage
    let totalDoses = 0;
    let takenDoses = 0;
    medications.forEach(med => {
      med.dosesHistory.forEach(dose => {
        totalDoses++;
        if (dose.status === 'taken') {
          takenDoses++;
        }
      });
    });

    const overallAdherence = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;

    // Calculate streaks
    let currentStreak = 0;
    let maxStreak = 0;
    let streakDate = new Date();

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(streakDate);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toDateString();

      let dayTotal = 0;
      let dayTaken = 0;

      medications.forEach(med => {
        med.times.forEach(() => dayTotal++);
        med.dosesHistory.forEach(dose => {
          if (new Date(dose.date).toDateString() === dateStr && dose.status === 'taken') {
            dayTaken++;
          }
        });
      });

      if (dayTotal > 0 && dayTaken === dayTotal) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        break;
      }
    }

    // Medication performance
    const medPerformance = medications.map(med => {
      const totalScheduled = med.dosesHistory.length > 0 
        ? Math.floor(med.dosesHistory.length / med.times.length) * med.times.length
        : 0;
      const taken = med.dosesHistory.filter(d => d.status === 'taken').length;
      const adherence = totalScheduled > 0 ? Math.round((taken / totalScheduled) * 100) : 0;

      return {
        name: med.name.substring(0, 10),
        fullName: med.name,
        adherence,
        taken,
        total: totalScheduled
      };
    }).sort((a, b) => b.adherence - a.adherence);

    return {
      last30Days: last30Days.map(d => ({
        ...d,
        adherenceRate: d.total > 0 ? Math.round((d.adherence / d.total) * 100) : 0
      })),
      overallAdherence,
      currentStreak,
      maxStreak,
      medPerformance,
      totalDoses,
      takenDoses
    };
  };

  const analytics = calculateAnalytics();

  return (
    <div className="analytics-wrapper">
      <div className="analytics-container">
        <h2 className="section-title">📊 Your Medication Analytics</h2>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card overall">
            <div className="kpi-icon">
              <TrendingUp size={32} />
            </div>
            <div className="kpi-content">
              <p className="kpi-label">Overall Adherence</p>
              <h3 className="kpi-value">{analytics.overallAdherence}%</h3>
              <p className="kpi-detail">{analytics.takenDoses} of {analytics.totalDoses} doses</p>
            </div>
          </div>

          <div className="kpi-card streak">
            <div className="kpi-icon">
              <Flame size={32} />
            </div>
            <div className="kpi-content">
              <p className="kpi-label">Current Streak</p>
              <h3 className="kpi-value">{analytics.currentStreak} days</h3>
              <p className="kpi-detail">Best: {analytics.maxStreak} days</p>
            </div>
          </div>

          <div className="kpi-card goal">
            <div className="kpi-icon">
              <Target size={32} />
            </div>
            <div className="kpi-content">
              <p className="kpi-label">Goal Progress</p>
              <h3 className="kpi-value">95%</h3>
              <p className="kpi-detail">
                {analytics.overallAdherence >= 95 ? '✅ Achieved!' : `${95 - analytics.overallAdherence}% to go`}
              </p>
            </div>
          </div>

          <div className="kpi-card total">
            <div className="kpi-icon">
              <Activity size={32} />
            </div>
            <div className="kpi-content">
              <p className="kpi-label">Total Tracked</p>
              <h3 className="kpi-value">{medications.length}</h3>
              <p className="kpi-detail">Active medications</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-wrapper">
            <div className="chart-header">
              <h3>📈 30-Day Adherence Trend</h3>
              <p>Your medication adherence over the past month</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.last30Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '2px solid #3b82f6',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => `${value}%`}
                />
                <Line 
                  type="monotone" 
                  dataKey="adherenceRate" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={false}
                  name="Adherence %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-wrapper">
            <div className="chart-header">
              <h3>💊 Medication Performance</h3>
              <p>Adherence rate for each medication</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.medPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '2px solid #3b82f6',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => `${value}%`}
                />
                <Bar dataKey="adherence" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="table-section">
          <div className="table-header">
            <h3>📋 Detailed Breakdown</h3>
            <p>Performance metrics for all medications</p>
          </div>
          
          <div className="table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Medication</th>
                  <th>Adherence</th>
                  <th>Taken</th>
                  <th>Scheduled</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics.medPerformance.map((med, idx) => (
                  <tr key={idx} className={med.adherence >= 80 ? 'status-good' : med.adherence >= 50 ? 'status-fair' : 'status-poor'}>
                    <td className="med-name">{med.fullName}</td>
                    <td>
                      <div className="progress-container">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${med.adherence}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">{med.adherence}%</span>
                      </div>
                    </td>
                    <td className="numeric">{med.taken}</td>
                    <td className="numeric">{med.total}</td>
                    <td>
                      <span className={`status-badge status-${med.adherence >= 80 ? 'good' : med.adherence >= 50 ? 'fair' : 'poor'}`}>
                        {med.adherence >= 80 ? '✅ Good' : med.adherence >= 50 ? '⚠️ Fair' : '❌ Poor'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;