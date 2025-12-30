// client/src/components/DataExport.jsx
import { Download, Upload, Save, Share2 } from 'lucide-react';
import { useState, useRef } from 'react';

function DataExport({ medications, onImport }) {
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  const exportAsJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      medications: medications
    };

    const jsonString = JSON.stringify(data, null, 2);
    downloadFile(jsonString, `medication-backup-${new Date().toLocaleDateString()}.json`, 'application/json');
  };

  const exportAsCSV = () => {
    let csvContent = 'Medication,Dosage,Frequency,Times,Total Stock,Current Stock,Doses Taken,Doses Skipped\n';

    medications.forEach(med => {
      const takenCount = med.dosesHistory.filter(d => d.status === 'taken').length;
      const skippedCount = med.dosesHistory.filter(d => d.status === 'skipped').length;

      csvContent += `"${med.name}","${med.dosage || ''}","${med.frequency}x daily","${med.times.join(', ')}",${med.totalStock},${med.currentStock},${takenCount},${skippedCount}\n`;
    });

    downloadFile(csvContent, `medications-${new Date().toLocaleDateString()}.csv`, 'text/csv');
  };

  const exportAsHTML = () => {
    const now = new Date().toLocaleDateString();
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Medication List - ${now}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; background: #f8fafc; }
          h1 { color: #3b82f6; }
          table { border-collapse: collapse; width: 100%; margin: 20px 0; background: white; }
          th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
          th { background-color: #3b82f6; color: white; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .low-stock { color: #ef4444; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Medication List</h1>
        <p>Exported on: ${now}</p>
        <table>
          <tr>
            <th>Medication</th>
            <th>Dosage</th>
            <th>Frequency</th>
            <th>Times</th>
            <th>Stock</th>
            <th>Status</th>
          </tr>
    `;

    medications.forEach(med => {
      const stockStatus = med.currentStock <= med.lowStockThreshold ? 
        `<span class="low-stock">Low (${med.currentStock}/${med.totalStock})</span>` : 
        `${med.currentStock}/${med.totalStock}`;

      htmlContent += `
        <tr>
          <td>${med.name}</td>
          <td>${med.dosage || '-'}</td>
          <td>${med.frequency}x daily</td>
          <td>${med.times.join(', ')}</td>
          <td>${stockStatus}</td>
          <td>${med.currentStock > 0 ? 'Active' : 'Out of Stock'}</td>
        </tr>
      `;
    });

    htmlContent += `
        </table>
      </body>
      </html>
    `;

    downloadFile(htmlContent, `medications-${now}.html`, 'text/html');
  };

  const downloadFile = (content, filename, type) => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:${type};charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        if (file.name.endsWith('.json')) {
          const data = JSON.parse(content);
          onImport(data.medications);
          alert('✅ Medications imported successfully!');
        } else {
          alert('❌ Please import a valid JSON backup file');
        }
      } catch (error) {
        alert('❌ Error importing file: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  const copyToClipboard = () => {
    const data = {
      exportDate: new Date().toISOString(),
      medications: medications
    };
    const jsonString = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="export-wrapper">
      <div className="export-container">
        <h2 className="section-title"> 💾 Data & Backup</h2>

        {/* Export Section */}
        <div className="export-section">
          <div className="section-header">
            <h3>📤 Export Your Data</h3>
            <p>Backup your medications in multiple formats</p>
          </div>

          <div className="export-options">
            <button className="export-option json" onClick={exportAsJSON}>
              <Download size={28} />
              <div className="option-text">
                <h4>JSON Backup</h4>
                <p>Complete backup & restore</p>
              </div>
            </button>

            <button className="export-option csv" onClick={exportAsCSV}>
              <Download size={28} />
              <div className="option-text">
                <h4>Export to CSV</h4>
                <p>Open in Excel/Sheets</p>
              </div>
            </button>

            <button className="export-option html" onClick={exportAsHTML}>
              <Save size={28} />
              <div className="option-text">
                <h4>Print as HTML</h4>
                <p>Print-friendly format</p>
              </div>
            </button>

            <button className="export-option copy" onClick={copyToClipboard}>
              <Share2 size={28} />
              <div className="option-text">
                <h4>{copied ? '✅ Copied!' : 'Copy Data'}</h4>
                <p>Copy to clipboard</p>
              </div>
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="import-section">
          <div className="section-header">
            <h3>📥 Import Data</h3>
            <p>Restore medications from a backup file</p>
          </div>

          <div className="import-box">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              style={{ display: 'none' }}
            />
            <button
              className="import-button"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={48} />
              <h4>Click to Import JSON</h4>
              <p>Select previously exported backup</p>
            </button>
          </div>

          <div className="import-info">
            <p>💡 <strong>Tip:</strong> Only JSON files exported from MediTrack are supported</p>
          </div>
        </div>

        {/* Guidelines */}
        <div className="guidelines-section">
          <div className="section-header">
            <h3>📋 Backup Guidelines</h3>
          </div>

          <div className="guidelines-grid">
            <div className="guideline-card">
              <div className="guideline-number">1</div>
              <h4>Regular Backups</h4>
              <p>Export your data weekly</p>
            </div>
            <div className="guideline-card">
              <div className="guideline-number">2</div>
              <h4>Cloud Storage</h4>
              <p>Store in Google Drive or OneDrive</p>
            </div>
            <div className="guideline-card">
              <div className="guideline-number">3</div>
              <h4>Multiple Copies</h4>
              <p>Keep backups in different locations</p>
            </div>
            <div className="guideline-card">
              <div className="guideline-number">4</div>
              <h4>Test Restore</h4>
              <p>Verify imports work properly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataExport;