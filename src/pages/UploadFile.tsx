import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Upload, File, FileText, CheckCircle, Database } from 'lucide-react';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import './UploadFile.css';

interface UploadItem {
  id: string;
  name: string;
  desc: string;
  size: string;
  date: string;
  status: 'Processing' | 'Pending' | 'Processed';
  variant: 'success' | 'warning' | 'info';
  progress?: number;
}

const UploadFile = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadItem[]>([
    { id: '1', name: 'device_report_2024_001.ufdr', desc: 'CASE-2024-0412', size: '245 MB', date: '2024-03-15 14:32', status: 'Processed', variant: 'success' },
    { id: '2', name: 'samsung_galaxy_s23.ufdr', desc: 'CASE-2024-0411', size: '189 MB', date: '2024-03-15 12:15', status: 'Processing', variant: 'info', progress: 65 },
    { id: '3', name: 'iphone_15_pro_backup.ufdr', desc: 'CASE-2024-0410', size: '512 MB', date: '2024-03-14 09:45', status: 'Pending', variant: 'warning' },
  ]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const simulateUpload = (file: File) => {
    const newId = Date.now().toString();
    const newUpload: UploadItem = {
      id: newId,
      name: file.name,
      desc: 'CASE-NEW-INCOMING',
      size: (file.size ? (file.size / (1024 * 1024)).toFixed(2) : Math.floor(Math.random() * 500) + 10) + ' MB',
      date: 'Just now',
      status: 'Processing',
      variant: 'info',
      progress: 0
    };

    setUploads(prev => [newUpload, ...prev]);

    const storageRef = ref(storage, `case_files/${newId}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploads(prev => prev.map(u => 
          u.id === newId 
            ? { ...u, progress } 
            : u
        ));
      }, 
      (error) => {
        console.error("Upload to Firebase failed", error);
        setUploads(prev => prev.map(u => 
          u.id === newId 
            ? { ...u, status: 'Pending', variant: 'warning' } 
            : u
        ));
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          setUploads(prev => prev.map(u => 
            u.id === newId 
              ? { ...u, progress: 100, status: 'Processed', variant: 'success' } 
              : u
          ));
        });
      }
    );
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(file => simulateUpload(file));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach(file => simulateUpload(file));
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <label
          className={`drop-zone ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-icon-wrapper">
            <Upload size={32} />
          </div>
          <h3>Drop UFDR files here</h3>
          <p>Supports XML and SQLite formats</p>
          
          <div className="upload-divider">
            <span>or</span>
          </div>
          
          <span className="btn-primary browse-btn">
            Browse Files
          </span>
          <input 
            type="file" 
            className="file-input" 
            accept=".ufdr,.xml,.sqlite" 
            multiple 
            onChange={handleFileInput}
          />
        </label>
        
        <div className="format-info-grid">
          <Card className="format-card">
            <Database className="format-icon" size={24} />
            <div>
              <h4>UFDR Format</h4>
              <p>Primary Universal Forensic Data format</p>
            </div>
          </Card>
          <Card className="format-card">
            <FileText className="format-icon" size={24} />
            <div>
              <h4>XML Exports</h4>
              <p>Structured extracted report XML metadata</p>
            </div>
          </Card>
        </div>
      </div>

      <div className="recent-uploads-sidebar">
        <h3 className="section-title">Recent Uploads</h3>
        <div className="uploads-list">
          {uploads.map(upload => (
            <Card key={upload.id} className="upload-item-card">
              <div className="upload-item-header">
                <div className={`upload-item-icon ${upload.status.toLowerCase()}`}>
                  {upload.status === 'Processed' ? <CheckCircle size={20} className="success-icon" /> : <File size={20} className="file-icon" />}
                </div>
                <div className="upload-item-info">
                  <div className="upload-name-row">
                    <h4 className="truncate-text" title={upload.name}>{upload.name}</h4>
                    <Badge variant={upload.variant} icon>{upload.status}</Badge>
                  </div>
                  <span className="upload-desc">{upload.desc}</span>
                </div>
              </div>
              
              {upload.progress !== undefined && upload.progress < 100 && (
                <div className="upload-progress-container">
                  <div className="progress-labels">
                    <span>Uploading...</span>
                    <span>{upload.progress}%</span>
                  </div>
                  <ProgressBar progress={upload.progress} />
                </div>
              )}

              <div className="upload-meta">
                <span>{upload.size}</span>
                <span className="dot">•</span>
                <span>{upload.date}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
