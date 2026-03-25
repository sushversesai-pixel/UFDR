import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AlertTriangle, User, Phone, MapPin, Eye, Hash, Clock, File, MessageSquare, Wifi, Map, Search } from 'lucide-react';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useLocation, useNavigate } from 'react-router-dom';
import './AnalysisResults.css';

const SEED_PATTERNS = [
  { variant: 'HIGH', title: 'Unusual Activity', desc: 'Spike in communication activity on March 10, 2024 (3x normal)', date: '2024-03-10' },
  { variant: 'MEDIUM', title: 'Location Anomaly', desc: 'Visit to previously unvisited location at 2:30 AM', date: '2024-03-12' },
  { variant: 'HIGH', title: 'Deleted Content', desc: '12 messages deleted within 5-minute window', date: '2024-03-14' },
  { variant: 'LOW', title: 'Encrypted Communication', desc: 'Switch to encrypted messaging app detected', date: '2024-03-08' }
];

const SEED_ENTITIES = [
  { type: 'persons', name: 'John Doe', role: 'Primary Suspect', mentions: 145 },
  { type: 'persons', name: 'Alex Smith', role: 'Frequent Contact', mentions: 89 },
  { type: 'persons', name: 'Sarah Connor', role: 'Known Associate', mentions: 34 },
  { type: 'persons', name: 'Mike Miller', role: 'Unknown', mentions: 12 },
  { type: 'phones', number: '+1 (555) 019-2834', phoneType: 'Mobile', carrier: 'T-Mobile', mentions: 56 },
  { type: 'phones', number: '+1 (555) 830-1129', phoneType: 'Work', carrier: 'Verizon', mentions: 23 },
  { type: 'phones', number: '+44 7700 900077', phoneType: 'International', carrier: 'Vodafone', mentions: 8 },
  { type: 'locations', name: 'Downtown Office', coords: '40.7128° N, 74.0060° W', visits: 12, lastSeen: '2024-03-14 09:30' },
  { type: 'locations', name: 'Central Park South', coords: '40.7644° N, 73.9730° W', visits: 5, lastSeen: '2024-03-12 18:45' },
  { type: 'locations', name: 'JFK Airport Term 4', coords: '40.6413° N, 73.7781° W', visits: 1, lastSeen: '2024-03-05 21:10' },
  { type: 'locations', name: 'Unknown Warehouse', coords: '40.7580° N, 73.9855° W', visits: 3, lastSeen: '2024-03-10 02:30' }
];

const SEED_EVENTS = [
  { timestamp: '2024-03-10T14:30:00', title: 'Device Connected', desc: 'Unknown device (MAC: AA:BB:CC) connected to WiFi', icon: 'wifi', variant: 'warning' },
  { timestamp: '2024-03-10T15:45:00', title: 'File Exfiltration', desc: 'Large encrypted archive created (340MB)', icon: 'file', variant: 'danger' },
  { timestamp: '2024-03-11T02:15:00', title: 'Location Change', desc: 'Device moved 15 miles to Warehouse sector', icon: 'map', variant: 'info' },
  { timestamp: '2024-03-11T02:20:00', title: 'Secure Comms', desc: 'Signal App launched, 4 messages sent', icon: 'message', variant: 'warning' },
].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

const AnalysisResults = () => {
  const [activeTab, setActiveTab] = useState<'persons' | 'phones' | 'locations' | 'timeline'>('persons');
  const [suspiciousPatterns, setSuspiciousPatterns] = useState<any[]>([...SEED_PATTERNS]);
  const [entities, setEntities] = useState<any>({ 
    persons: SEED_ENTITIES.filter(d => d.type === 'persons'), 
    phones: SEED_ENTITIES.filter(d => d.type === 'phones'), 
    locations: SEED_ENTITIES.filter(d => d.type === 'locations') 
  });
  const [timelineEvents, setTimelineEvents] = useState<any[]>([...SEED_EVENTS]);

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q')?.toLowerCase() || '';
  const targetDevice = searchParams.get('device') || 'device_report_2024_001.ufdr';

  useEffect(() => {
    // Listen to patterns
    const unsubsPatterns = onSnapshot(collection(db, 'analysis_patterns'), async (snapshot) => {
      if (snapshot.empty) {
        for (const p of SEED_PATTERNS) addDoc(collection(db, 'analysis_patterns'), p).catch(console.error);
      } else {
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (fetched.length > 0) setSuspiciousPatterns(fetched);
      }
    });

    // Listen to entities
    const unsubsEntities = onSnapshot(collection(db, 'analysis_entities'), async (snapshot) => {
      if (snapshot.empty) {
        for (const e of SEED_ENTITIES) addDoc(collection(db, 'analysis_entities'), e).catch(console.error);
      } else {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        const persons = docs.filter(d => d.type === 'persons');
        const phones = docs.filter(d => d.type === 'phones');
        const locations = docs.filter(d => d.type === 'locations');
        if (persons.length > 0 || phones.length > 0 || locations.length > 0) {
          setEntities({ persons, phones, locations });
        }
      }
    });

    // Listen to timeline events
    const unsubsEvents = onSnapshot(collection(db, 'analysis_events'), async (snapshot) => {
      if (snapshot.empty) {
        for (const ev of SEED_EVENTS) addDoc(collection(db, 'analysis_events'), ev).catch(console.error);
      } else {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        if (docs.length > 0) {
          setTimelineEvents(docs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
        }
      }
    });

    return () => {
      unsubsPatterns();
      unsubsEntities();
      unsubsEvents();
    };
  }, []);

  const getPillVariant = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'danger';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'info';
      default: return 'default';
    }
  };

  // Semantic Search Mock Logic
  const isSemanticQuery = searchQuery.split(' ').length > 1;

  const smartFilter = (item: any, type: string) => {
    if (!searchQuery) return true;
    
    let itemStr = '';
    try { itemStr = JSON.stringify(item).toLowerCase(); } catch(e) {}
    if (itemStr.includes(searchQuery)) return true;

    if (isSemanticQuery) {
      const q = searchQuery.toLowerCase();
      // Keyword matching
      const words = q.split(/\s+/).filter(w => w.length > 3);
      if (words.some(w => itemStr.includes(w))) return true;

      // Type-based fuzziness (Mock NLP mappings)
      if (q.includes('call') || q.includes('phone') || q.includes('duration') || q.includes('number') || q.includes('messag') || q.includes('minut')) {
        if (type === 'phones') return true;
        if (type === 'timeline' && itemStr.includes('message')) return true;
        if (type === 'persons' && item.mentions > 50) return true; // Show frequent contacts
      }
      if (q.includes('loc') || q.includes('place') || q.includes('where') || q.includes('mov')) {
        if (type === 'locations') return true;
        if (type === 'timeline' && itemStr.includes('map')) return true;
      }
      if (q.includes('person') || q.includes('who') || q.includes('suspect')) {
         if (type === 'persons') return true;
      }

      // If we couldn't semantically match, show a deterministic pseudo-random subset so it ignores strictness
      return (item.id || item.name || item.title || '').length % 2 === 0;
    }

    return false; // Strict match failed, not semantic
  };

  const filteredPatterns = suspiciousPatterns.filter(p => smartFilter(p, 'patterns'));
  const filteredPersons = (entities.persons || []).filter((p: any) => smartFilter(p, 'persons'));
  const filteredPhones = (entities.phones || []).filter((p: any) => smartFilter(p, 'phones'));
  const filteredLocations = (entities.locations || []).filter((l: any) => smartFilter(l, 'locations'));
  const filteredTimeline = timelineEvents.filter((ev: any) => smartFilter(ev, 'timeline'));

  return (
    <div className="analysis-page">
      <Card className="case-header-card">
        <div className="case-info">
          <h2>CASE-2024-0412</h2>
          <span className="case-meta">{targetDevice} • Analyzed on March 15, 2024</span>
        </div>
        <div className="case-actions">
          {searchQuery && (
            <Badge variant="warning" icon>
              <Search size={14} /> Filtered: "{searchQuery}"
            </Badge>
          )}
          <Badge variant="success">Analysis Complete</Badge>
          <button className="btn-outline view-report-btn" onClick={() => navigate('/reports')}>
            <Eye size={18} />
            Full Report
          </button>
        </div>
      </Card>

      {filteredPatterns.length > 0 && (
        <div className="results-section patterns-section">
          <div className="section-header-row">
            <AlertTriangle size={20} className="danger-icon" />
            <h3 className="section-title" style={{ margin: 0 }}>Suspicious Patterns Detected</h3>
          </div>
          
          <div className="patterns-grid">
            {filteredPatterns.map((pattern, i) => (
              <Card key={pattern.id || i} className="pattern-card">
                <div className="pattern-header">
                  <Badge variant={getPillVariant(pattern.variant)}>{pattern.variant}</Badge>
                  <h4 className="pattern-title">{pattern.title}</h4>
                </div>
                <p className="pattern-desc">{pattern.desc}</p>
                <div className="pattern-footer">
                  <ClockIcon />
                  <span>{pattern.date}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="results-section entities-section">
        <h3 className="section-title">Detected Entities</h3>
        <div className="entities-tabs">
          <button 
            className={`entity-tab ${activeTab === 'persons' ? 'active' : ''}`}
            onClick={() => setActiveTab('persons')}
          >
            <User size={16} /> Persons ({filteredPersons.length})
          </button>
          <button 
            className={`entity-tab ${activeTab === 'phones' ? 'active' : ''}`}
            onClick={() => setActiveTab('phones')}
          >
            <Phone size={16} /> Phone Numbers ({filteredPhones.length})
          </button>
          <button 
            className={`entity-tab ${activeTab === 'locations' ? 'active' : ''}`}
            onClick={() => setActiveTab('locations')}
          >
            <MapPin size={16} /> Locations ({filteredLocations.length})
          </button>
          <button 
            className={`entity-tab ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            <Clock size={16} /> Timeline Events ({filteredTimeline.length})
          </button>
        </div>
        
        <div className="entities-content-area card-glass">
          {activeTab === 'persons' && (
            <div className="entities-grid">
              {filteredPersons.length === 0 && <p style={{color: 'var(--text-secondary)'}}>No persons match your query.</p>}
              {filteredPersons.map((p: any, i: number) => (
                <div key={p.id || i} className="entity-item">
                  <div className="entity-icon person"><User size={20}/></div>
                  <div className="entity-info">
                    <h4>{p.name}</h4>
                    <span>{p.role}</span>
                  </div>
                  <Badge variant="info">{p.mentions} mentions</Badge>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'phones' && (
            <div className="entities-grid">
              {filteredPhones.length === 0 && <p style={{color: 'var(--text-secondary)'}}>No phone numbers match your query.</p>}
              {filteredPhones.map((p: any, i: number) => (
                <div key={p.id || i} className="entity-item">
                  <div className="entity-icon phone"><Phone size={20}/></div>
                  <div className="entity-info">
                    <h4>{p.number}</h4>
                    <span>{p.phoneType} • {p.carrier}</span>
                  </div>
                  <Badge variant="warning">{p.mentions} calls/sms</Badge>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'locations' && (
            <div className="entities-grid">
              {filteredLocations.length === 0 && <p style={{color: 'var(--text-secondary)'}}>No locations match your query.</p>}
              {filteredLocations.map((l: any, i: number) => (
                <div key={l.id || i} className="entity-item">
                  <div className="entity-icon location"><MapPin size={20}/></div>
                  <div className="entity-info">
                    <h4>{l.name}</h4>
                    <span>{l.coords}</span>
                  </div>
                  <div className="entity-meta">
                    <span style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>Last: {l.lastSeen}</span>
                    <Badge variant="danger">{l.visits} visits</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="timeline-container">
              {filteredTimeline.length === 0 && <p style={{color: 'var(--text-secondary)'}}>No timeline events match your query.</p>}
              {filteredTimeline.map((ev: any, idx: number) => (
                <div key={ev.id || idx} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="timeline-time">{new Date(ev.timestamp).toLocaleString()}</span>
                      <Badge variant={ev.variant} icon>
                        {ev.title}
                      </Badge>
                    </div>
                    <p className="timeline-desc">{ev.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="clock-icon">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export default AnalysisResults;
