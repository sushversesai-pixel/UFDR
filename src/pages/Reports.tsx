import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Plus, File, Eye, Download, Loader } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import jsPDF from 'jspdf';
import './Reports.css';

const Reports = () => {
  const [exportFormat, setExportFormat] = useState<'PDF' | 'JSON'>('PDF');
  const [isGenerating, setIsGenerating] = useState(false);
  const [caseSelection, setCaseSelection] = useState('CASE-2024-0412');
  const [reportType, setReportType] = useState('investigation');

  const [previousReports, setPreviousReports] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        const seedData = [
          { name: 'Investigation Report - CASE-2024-0412', date: '2024-03-15 16:45', size: '2.4 MB', format: 'PDF', type: 'pdf', createdAt: Timestamp.fromMillis(Date.now() - 3600000) },
          { name: 'Communication Analysis - CASE-2024-0411', date: '2024-03-14 11:20', size: '1.8 MB', format: 'PDF', type: 'pdf', createdAt: Timestamp.fromMillis(Date.now() - 7200000) },
          { name: 'Entity Extraction Report - CASE-2024-0410', date: '2024-03-13 09:15', size: '856 KB', format: 'JSON', type: 'json', createdAt: Timestamp.fromMillis(Date.now() - 86400000) }
        ];
        for (const item of seedData) {
          await addDoc(collection(db, 'reports'), item);
        }
      } else {
        setPreviousReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGenerate = async () => {
    if (!caseSelection || !reportType) return;
    setIsGenerating(true);
    
    setTimeout(async () => {
      const newReport = {
        name: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report - ${caseSelection}`,
        date: new Date().toISOString().substring(0, 16).replace('T', ' '),
        size: exportFormat === 'PDF' ? '1.2 MB' : '450 KB',
        format: exportFormat,
        type: exportFormat.toLowerCase(),
        reportCategory: reportType,
        createdAt: Timestamp.now()
      };

      try {
        handleDownload(newReport.name, exportFormat.toLowerCase(), reportType);
      } catch (e) {
        console.error("Local download failed", e);
      } finally {
        setIsGenerating(false);
      }

      try {
        // Run telemetry sync silently in background without blocking the core UI download UX
        await addDoc(collection(db, 'reports'), newReport);
      } catch (err) {
        console.warn("Telemetry sync to Firestore failed. Database might not be provisioned yet.", err);
      }
    }, 1500);
  };

  const handleDownload = (filename: string, extension: string, category: string = 'investigation') => {
    if (extension === 'json') {
      const content = JSON.stringify({ filename, category, status: 'Extracted Case Entities', timestamp: new Date().toISOString() }, null, 2);
      const element = document.createElement("a");
      const file = new Blob([content], {type: 'application/json'});
      element.href = URL.createObjectURL(file);
      element.download = `${filename.replace(/\s+/g, '_').toLowerCase()}.json`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text("UFDR AI Analysis Report", 20, 30);
      
      doc.setFontSize(14);
      doc.setTextColor(100);
      doc.text(filename, 20, 45);
      
      doc.setFontSize(11);
      doc.setTextColor(50);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 55);
      doc.text(`Report Subject: ${category.toUpperCase()}`, 20, 62);
      
      doc.setDrawColor(200);
      doc.line(20, 70, 190, 70);
      
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("EXECUTIVE SUMMARY", 20, 85);
      doc.setFontSize(10);
      doc.text("This automated extraction represents cryptographic and behavioral metrics isolated", 20, 95);
      doc.text("from the target Universal Forensic Data stream.", 20, 100);

      doc.setFontSize(12);
      doc.text("DETAILED FINDINGS", 20, 115);
      
      doc.setFontSize(10);
      if (category === 'communication') {
        doc.text("• Detected 14,234 total SMS and encrypted messages.", 25, 125);
        doc.text("• Top Contact: +1 (555) 019-2834 (84 interactions).", 25, 135);
        doc.text("• Unusual Spike: 214 messages exchanged between 02:00 AM - 04:00 AM on March 12.", 25, 145);
        doc.text("• WhatsApp, Signal, and iMessage databases successfully decrypted.", 25, 155);
      } else if (category === 'entity') {
        doc.text("• Extracted 11 distinct Real-World Entities.", 25, 125);
        doc.text("• Persons of Interest: John Doe (Primary), Alex Smith, Sarah Connor.", 25, 135);
        doc.text("• Discovered 3 associated phone numbers across 2 carriers.", 25, 145);
        doc.text("• Mapped 4 frequent GPS locations, including 1 anomalous warehouse visit.", 25, 155);
      } else if (category === 'timeline') {
        doc.text("• March 10, 14:00 - Device connected to unknown WiFi network.", 25, 125);
        doc.text("• March 12, 02:30 - GPS location recorded outside normal commute pattern.", 25, 135);
        doc.text("• March 14, 09:15 - Burst deletion of 12 messages detected.", 25, 145);
        doc.text("• March 15, 08:00 - UFDR forensic extraction initiated by agency.", 25, 155);
      } else {
        doc.text("• Processed 1.2M forensic records successfully without corruption.", 25, 125);
        doc.text("• Detected 4 high-risk anomalous behavioral patterns.", 25, 135);
        doc.text("• Extracted 11 exact entities (Persons, Phones, Locations).", 25, 145);
        doc.text("• No encrypted volumes detected in primary partition.", 25, 155);
      }
      
      doc.save(`${filename.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    }
  };

  return (
    <div className="reports-page">
      <Card className="generate-report-card">
        <div className="generate-header">
          <Plus size={20} className="accent-icon" />
          <h3 style={{ margin: 0 }}>Generate New Report</h3>
        </div>

        <div className="form-group">
          <label>Select Case</label>
          <select 
            className="ui-select" 
            value={caseSelection}
            onChange={e => setCaseSelection(e.target.value)}
            disabled={isGenerating}
          >
            <option value="">Choose a case...</option>
            <option value="CASE-2024-0412">CASE-2024-0412</option>
            <option value="CASE-2024-0411">CASE-2024-0411</option>
            <option value="CASE-2024-0410">CASE-2024-0410</option>
          </select>
        </div>

        <div className="form-group">
          <label>Report Type</label>
          <select 
            className="ui-select"
            value={reportType}
            onChange={e => setReportType(e.target.value)}
            disabled={isGenerating}
          >
            <option value="">Choose report type...</option>
            <option value="investigation">Investigation</option>
            <option value="communication">Communication Analysis</option>
            <option value="entity">Entity Extraction</option>
            <option value="timeline">Timeline Analysis</option>
          </select>
        </div>

        <div className="form-group">
          <label>Export Format</label>
          <div className="format-toggle">
            <button 
              className={`toggle-btn ${exportFormat === 'PDF' ? 'active' : ''}`}
              onClick={() => setExportFormat('PDF')}
              disabled={isGenerating}
            >
              <File size={16} /> PDF
            </button>
            <button 
              className={`toggle-btn ${exportFormat === 'JSON' ? 'active' : ''}`}
              onClick={() => setExportFormat('JSON')}
              disabled={isGenerating}
            >
              <span className="code-icon">{'{}'}</span> JSON
            </button>
          </div>
        </div>

        <button 
          className="btn-primary generate-btn" 
          onClick={handleGenerate}
          disabled={isGenerating || !caseSelection || !reportType}
        >
          {isGenerating ? (
             <><Loader size={18} className="spin" style={{ animation: 'spin 2s linear infinite' }} /> Generating...</>
          ) : (
             <><File size={18} /> Generate Report</>
          )}
        </button>
      </Card>

      <div className="previous-reports-section">
        <h3 className="section-title">Previous Reports</h3>
        <div className="reports-list">
          {previousReports.map(report => (
            <Card key={report.id} className="report-list-item">
              <div className="report-item-icon">
                {report.type === 'pdf' ? (
                  <File size={24} className="accent-icon" />
                ) : (
                  <div className="code-icon-lg">{'{}'}</div>
                )}
              </div>
              <div className="report-item-info">
                <h4>{report.name}</h4>
                <div className="report-meta">
                  <span>📅 {report.date}</span>
                  <span className="dot">•</span>
                  <span>{report.size}</span>
                </div>
              </div>
              <div className="report-item-actions">
                <span className={`format-badge ${report.type === 'pdf' ? 'badge-pdf' : 'badge-json'}`}>
                  {report.format}
                </span>
                <button className="icon-btn" onClick={() => handleDownload(report.name, report.type, report.reportCategory || 'investigation')}>
                  <Eye size={18} />
                </button>
                <button className="icon-btn" onClick={() => handleDownload(report.name, report.type, report.reportCategory || 'investigation')}>
                  <Download size={18} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
