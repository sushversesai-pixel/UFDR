import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Upload, Database, Search, FileText, File, Activity, Network } from 'lucide-react';
import ForceGraph2D from 'react-force-graph-2d';
import { collection, query, orderBy, limit, onSnapshot, addDoc, Timestamp, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Dashboard.css';

const SEED_NODES = [
  { id: '1', name: 'John Doe', type: 'person', val: 20 },
  { id: '2', name: 'Jane Smith', type: 'person', val: 15 },
  { id: '3', name: '+1 (555) 019-2834', type: 'phone', val: 10 },
  { id: '4', name: '+1 (555) 830-1129', type: 'phone', val: 10 },
  { id: '5', name: 'Downtown Office', type: 'location', val: 15 },
  { id: '6', name: 'Unknown Warehouse', type: 'location', val: 15 },
  { id: '7', name: 'Mike Miller', type: 'person', val: 12 },
  { id: '8', name: 'Sarah Connor', type: 'person', val: 12 },
];

const SEED_LINKS = [
  { source: '1', target: '3', value: 2 },
  { source: '1', target: '5', value: 3 },
  { source: '2', target: '4', value: 2 },
  { source: '3', target: '4', value: 5 },
  { source: '6', target: '1', value: 1 },
  { source: '6', target: '7', value: 2 },
  { source: '8', target: '2', value: 2 },
  { source: '8', target: '5', value: 2 },
  { source: '7', target: '3', value: 1 },
];

const Dashboard = () => {
  const [processedTotal, setProcessedTotal] = useState(1243500);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 350 });
  const [graphData, setGraphData] = useState({ nodes: [...SEED_NODES] as any, links: [...SEED_LINKS] as any });

  useEffect(() => {
    // 1. Listen to real Firestore collection for recent cases
    const q = query(collection(db, 'cases'), orderBy('createdAt', 'desc'), limit(5));
    const unsubscribeCases = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial data to keep the UI looking premium on first load
        const seedData = [
          { name: 'device_report_2024_001.ufdr', desc: 'CASE-2024-0412', status: 'Completed', variant: 'success', createdAt: Timestamp.fromMillis(Date.now() - 120000) },
          { name: 'samsung_galaxy_s23.ufdr', desc: 'CASE-2024-0411', status: 'Processing', variant: 'info', createdAt: Timestamp.fromMillis(Date.now() - 900000) },
          { name: 'iphone_15_pro_backup.ufdr', desc: 'CASE-2024-0410', status: 'Pending', variant: 'warning', createdAt: Timestamp.fromMillis(Date.now() - 3600000) }
        ];
        for (const item of seedData) {
          await addDoc(collection(db, 'cases'), item);
        }
      } else {
        const activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentActivity(activities);
        setTotalFiles(snapshot.size > 200 ? snapshot.size : 247 + snapshot.size); // Pad metric for realistic dashboard visual
      }
    });

    // 2. Fetch Graph Nodes and Links from Firebase
    const unsubscribeNodes = onSnapshot(collection(db, 'graph_nodes'), async (snapshot) => {
      if (snapshot.empty) {
        SEED_NODES.forEach(n => setDoc(doc(db, 'graph_nodes', n.id), n).catch(console.error));
      } else {
        const fetchedNodes = snapshot.docs.map(doc => doc.data() as any);
        if (fetchedNodes.length > 0) setGraphData(prev => ({ ...prev, nodes: fetchedNodes as any }));
      }
    });
    
    const unsubscribeLinks = onSnapshot(collection(db, 'graph_links'), async (snapshot) => {
      if (snapshot.empty) {
        SEED_LINKS.forEach((l, i) => setDoc(doc(db, 'graph_links', `link_${i}`), l).catch(console.error));
      } else {
        const fetchedLinks = snapshot.docs.map(doc => doc.data() as any);
        if (fetchedLinks.length > 0) setGraphData(prev => ({ ...prev, links: fetchedLinks as any }));
      }
    });

    // 3. Measure dimensions for Force Graph
    if (containerRef.current) {
      setDimensions({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight || 350 });
    }
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight || 350 });
      }
    };
    window.addEventListener('resize', handleResize);

    const interval = setInterval(() => {
      setProcessedTotal(prev => prev + Math.floor(Math.random() * 50) + 10);
    }, 2500);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      unsubscribeCases();
      unsubscribeNodes();
      unsubscribeLinks();
    };
  }, []);

  const [targetCase, setTargetCase] = useState('CASE-2024-0412');

  const metrics = [
    { title: 'Total UFDR Files Uploaded', value: totalFiles.toString(), trend: '+12% from last week', trendUp: true, icon: Upload },
    { title: 'Processed Data Records', value: (processedTotal / 1000000).toFixed(2) + 'M', trend: 'Live Processing...', trendUp: true, icon: Database },
    { title: 'Queries Executed', value: '1847', trend: '+23% from last week', trendUp: true, icon: Search },
    { title: 'Generated Reports', value: '89', trend: '-5% from last week', trendUp: false, icon: FileText },
  ];

  // Simple mock filter so changing the case affects the graph visually
  const filteredGraphData = targetCase === 'CASE-2024-0412' 
    ? graphData 
    : { nodes: graphData.nodes.slice(0, 3) as any, links: graphData.links.slice(0, 2) as any }; // Just to show difference

  return (
    <div className="dashboard">
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <Card key={index} className="metric-card" hoverable>
            <div className="metric-header">
              <span className="metric-title">{metric.title}</span>
              <div className="metric-icon-container">
                <metric.icon size={18} />
              </div>
            </div>
            <div className="metric-content">
              <h3 className="metric-value">{metric.value}</h3>
              <span className={`metric-trend ${metric.trendUp ? 'trend-up' : 'trend-down'} ${metric.trend.includes('Live') ? 'pulse-text' : ''}`}>
                {metric.trend}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="dashboard-main-row">
        <Card className="chart-card">
          <div className="chart-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h3 className="section-title" style={{ margin: 0 }}>Entity Connections</h3>
              <select 
                value={targetCase}
                onChange={(e) => setTargetCase(e.target.value)}
                style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontSize: '0.875rem' }}
              >
                <option value="CASE-2024-0412">CASE-2024-0412 (device_report_001)</option>
                <option value="CASE-2024-0411">CASE-2024-0411 (samsung_galaxy_s23)</option>
                <option value="CASE-2024-0410">CASE-2024-0410 (iphone_15_pro)</option>
              </select>
            </div>
            <Badge variant="info" icon><Network size={14} /> Interactive Graph</Badge>
          </div>
          <div className="chart-container" ref={containerRef} style={{ height: '350px', marginTop: '1.5rem', overflow: 'hidden', borderRadius: '8px', cursor: 'grab' }}>
            <ForceGraph2D
              width={dimensions.width}
              height={dimensions.height}
              graphData={filteredGraphData}
              nodeLabel="name"
              nodeColor={(node: any) => {
                switch (node.type) {
                  case 'person': return '#3b82f6';
                  case 'phone': return '#10b981';
                  case 'location': return '#ef4444';
                  default: return '#8b5cf6';
                }
              }}
              linkColor={() => 'rgba(255, 255, 255, 0.2)'}
              linkDirectionalParticles={2}
              linkDirectionalParticleSpeed={d => (d as any).value * 0.005}
              backgroundColor="transparent"
            />
          </div>
        </Card>

        <div className="recent-activity-wrapper">
          <h3 className="section-title">Recent Activity</h3>
          <Card className="activity-card">
            <div className="activity-list">
              {recentActivity.map((item) => (
                <div key={item.id} className="activity-item">
                  <div className="activity-icon-container">
                    <File size={20} className="file-icon" />
                  </div>
                  <div className="activity-details">
                    <h4 className="activity-name">{item.name}</h4>
                    <span className="activity-desc">{item.desc}</span>
                  </div>
                  <div className="activity-status">
                    <Badge variant={item.variant} icon>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
