import React from 'react';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';
import { Clock, Loader, CheckCircle2, Database, File, Play, Pause, ChevronDown, ChevronUp, Brain, Cpu, Search, Activity } from 'lucide-react';
import './DataProcessing.css';

const DataProcessing = () => {
  const queueMetrics = [
    { title: 'In Queue', value: '3', icon: Clock, color: 'var(--warning-color)' },
    { title: 'Processing', value: '1', icon: Loader, color: 'var(--accent-color)', spin: true },
    { title: 'Completed Today', value: '12', icon: CheckCircle2, color: 'var(--success-color)' },
    { title: 'Total Records', value: '4.5M', icon: Database, color: 'var(--accent-color)' },
  ];

  const activeQueue = [
    {
      id: 1,
      name: 'samsung_galaxy_s23.ufdr',
      desc: 'CASE-2024-0411',
      status: 'Processing',
      variant: 'info' as const,
      progress: 67,
      taskName: 'Extracting messages...',
      taskValue: '245,678 records extracted',
      time: 'Started 15 min ago',
      actionIcon: Pause
    },
    {
      id: 2,
      name: 'iphone_15_pro_backup.ufdr',
      desc: 'CASE-2024-0410',
      status: 'Queued',
      variant: 'warning' as const,
      progress: 0,
      time: 'Waiting...',
      actionIcon: Play
    },
    {
      id: 3,
      name: 'pixel_8_extraction.ufdr',
      desc: 'CASE-2024-0409',
      status: 'Queued',
      variant: 'warning' as const,
      progress: 0,
      time: 'Waiting...',
      actionIcon: Play
    }
  ];

  const [expandedId, setExpandedId] = React.useState<number | null>(1);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="processing-page">
      <div className="metrics-grid">
        {queueMetrics.map((metric, index) => (
          <Card key={index} className="queue-metric-card">
            <div className="metric-header">
              <span className="metric-title">{metric.title}</span>
              <metric.icon 
                size={20} 
                color={metric.color} 
                className={metric.spin ? 'spin-animation' : ''} 
              />
            </div>
            <h3 className="metric-value">{metric.value}</h3>
          </Card>
        ))}
      </div>

      <div className="queue-section">
        <h3 className="section-title">Active Processing Queue</h3>
        <Card className="queue-container">
          {activeQueue.map((item, index) => (
            <div key={item.id} className={`queue-item ${index !== 0 ? 'queue-item-border' : ''}`}>
              <div className="queue-item-header">
                <div className="queue-item-info">
                  <div className="queue-icon-wrapper">
                    <File size={18} />
                  </div>
                  <div>
                    <h4 className="queue-name">{item.name}</h4>
                    <span className="queue-desc">{item.desc}</span>
                  </div>
                </div>
                <div className="queue-actions">
                  <Badge variant={item.variant} icon>{item.status}</Badge>
                  <button className="action-btn">
                    <item.actionIcon size={18} />
                  </button>
                </div>
              </div>

              {item.status === 'Processing' && (
                <div className="queue-progress-wrapper">
                  <ProgressBar 
                    progress={item.progress} 
                    label="AI Data Pipeline Active"
                    subLabel={`${item.progress}%`} 
                  />
                  
                  <div className="pipeline-toggle" onClick={() => toggleExpand(item.id)}>
                    <span>View Pipeline Details</span>
                    {expandedId === item.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>

                  {expandedId === item.id && (
                    <div className="pipeline-steps-container">
                      <div className="pipeline-step completed">
                        <div className="step-icon"><Database size={16} /></div>
                        <div className="step-content">
                          <h4>Data Separation (Structured vs Unstructured)</h4>
                          <p>Successfully extracted logs, timestamps, and messages from SQLite/XML.</p>
                        </div>
                        <Badge variant="success">Done</Badge>
                      </div>

                      <div className="pipeline-step active">
                        <div className="step-icon loader-icon"><Brain size={16} /></div>
                        <div className="step-content">
                          <h4>Named Entity Recognition (NER)</h4>
                          <p>Extracting Persons, Phone Numbers, and Locations from raw text...</p>
                        </div>
                        <Loader className="spin-animation status-loader" size={16} />
                      </div>

                      <div className="pipeline-step pending">
                        <div className="step-icon"><Search size={16} /></div>
                        <div className="step-content">
                          <h4>Semantic Search Vectorization</h4>
                          <p>Generating vector embeddings for natural language querying.</p>
                        </div>
                        <Badge variant="warning">Queued</Badge>
                      </div>

                      <div className="pipeline-step pending">
                        <div className="step-icon"><Activity size={16} /></div>
                        <div className="step-content">
                          <h4>Pattern & Anomaly Detection</h4>
                          <p>Analyzing relationships for suspicious communication spikes.</p>
                        </div>
                        <Badge variant="warning">Queued</Badge>
                      </div>
                    </div>
                  )}

                  <div className="queue-progress-footer">
                    <span>{item.time}</span>
                    <span>{item.taskValue}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default DataProcessing;
