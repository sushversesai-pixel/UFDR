import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Sparkles, Search, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './QueryAnalyzer.css';

const QueryAnalyzer = () => {
  const [query, setQuery] = useState('');
  const [device, setDevice] = useState('device_report_2024_001.ufdr');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const suggestions = [
    'Find all communications between John and Alex in the last 7 days.',
    'Show call logs with duration over 5 minutes.'
  ];

  const handleAnalyze = () => {
    if (!query.trim()) return;
    setIsAnalyzing(true);
    // Simulate analyzing process
    setTimeout(() => {
      setIsAnalyzing(false);
      navigate(`/analysis?q=${encodeURIComponent(query)}&device=${encodeURIComponent(device)}`);
    }, 1500);
  };

  return (
    <div className="query-page">
      <Card className="query-card">
        <div className="query-header">
          <Sparkles className="sparkle-icon" size={20} />
          <h3 className="section-title" style={{ margin: 0 }}>Natural Language Query</h3>
        </div>

        <div className="query-input-container">
          <div className="query-device-selector" style={{ marginBottom: '1rem' }}>
            <label style={{ marginRight: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Target Device:</label>
            <select 
              value={device} 
              onChange={(e) => setDevice(e.target.value)}
              disabled={isAnalyzing}
              style={{ padding: '0.5rem', borderRadius: '6px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', minWidth: '250px' }}
            >
              <option value="device_report_2024_001.ufdr">device_report_2024_001.ufdr (CASE-2024-0412)</option>
              <option value="samsung_galaxy_s23.ufdr">samsung_galaxy_s23.ufdr (CASE-2024-0411)</option>
              <option value="iphone_15_pro_backup.ufdr">iphone_15_pro_backup.ufdr (CASE-2024-0410)</option>
              <option value="All Devices">All Devices in Workspace</option>
            </select>
          </div>

          <textarea
            className="query-textarea"
            placeholder="Type your query here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isAnalyzing}
          />

          <div className="query-footer">
            <div className="query-suggestions">
              {suggestions.map((suggestion, index) => (
                <button 
                  key={index} 
                  className="suggestion-chip"
                  onClick={() => setQuery(suggestion)}
                  disabled={isAnalyzing}
                >
                  <span className="truncate-text">{suggestion}</span>
                </button>
              ))}
            </div>

            <button 
              className="btn-primary analyze-btn" 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !query.trim()}
            >
              {isAnalyzing ? (
                <>
                  <Loader size={18} className="spin" style={{ animation: 'spin 2s linear infinite' }} />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Analyze
                </>
              )}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QueryAnalyzer;
