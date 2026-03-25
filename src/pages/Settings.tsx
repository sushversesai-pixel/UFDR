import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { User, Shield, Bell, HardDrive, Key, Save, Smartphone, Trash2, Plus, Copy } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'storage', label: 'Data & Storage', icon: HardDrive },
    { id: 'api', label: 'API', icon: Key },
  ];

  return (
    <div className="settings-page">
      <div className="settings-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <Card className="settings-content-card">
        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="settings-section fade-in">
            <div className="settings-header">
              <h3>Profile Information</h3>
              <p>Update your account details and preferences</p>
            </div>

            <div className="settings-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" className="ui-input" defaultValue="Investigator Name" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="ui-input" defaultValue="investigator@forensics.gov" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>
                  <input type="text" className="ui-input" defaultValue="Digital Forensics Unit" />
                </div>
                <div className="form-group">
                  <label>Badge Number</label>
                  <input type="text" className="ui-input" defaultValue="DFU-2024-0042" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half-width">
                  <label>Timezone</label>
                  <select className="ui-select w-full">
                    <option value="EST">Eastern Time (EST)</option>
                    <option value="CST">Central Time (CST)</option>
                    <option value="MST">Mountain Time (MST)</option>
                    <option value="PST">Pacific Time (PST)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>

              <div className="form-actions border-t pt-4">
                <button className="btn-primary">
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
          <div className="settings-section fade-in">
            <div className="settings-header">
              <h3>Security Settings</h3>
              <p>Manage passwords and account authentication</p>
            </div>

            <div className="settings-form">
              <div className="setting-block">
                <h4>Change Password</h4>
                <div className="form-row mt-3">
                  <div className="form-group">
                    <label>Current Password</label>
                    <input type="password" className="ui-input" placeholder="••••••••" />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input type="password" className="ui-input" placeholder="••••••••" />
                  </div>
                </div>
                <button className="btn-outline mt-3">Update Password</button>
              </div>

              <div className="divider" />

              <div className="setting-block row-between">
                <div>
                  <h4>Two-Factor Authentication (2FA)</h4>
                  <p className="text-sm color-secondary mt-1">Add an extra layer of security to your account.</p>
                </div>
                <div className="toggle-switch active">
                  <div className="toggle-slider"></div>
                </div>
              </div>

              <div className="divider" />

              <div className="setting-block">
                <h4>Active Sessions</h4>
                <p className="text-sm color-secondary mt-1 mb-3">Devices currently logged into your account.</p>
                
                <div className="session-item">
                  <div className="session-icon"><Smartphone size={20} /></div>
                  <div className="session-info">
                    <h5>MacBook Pro - Chrome</h5>
                    <span>New York, USA • Last active: Just now</span>
                  </div>
                  <Badge variant="success">Current</Badge>
                </div>
                
                <div className="session-item mt-2">
                  <div className="session-icon"><Smartphone size={20} /></div>
                  <div className="session-info">
                    <h5>iPhone 13 - Safari</h5>
                    <span>New York, USA • Last active: 2 hours ago</span>
                  </div>
                  <button className="btn-text danger">Revoke</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="settings-section fade-in">
            <div className="settings-header">
              <h3>Notification Preferences</h3>
              <p>Choose what alerts you want to receive</p>
            </div>

            <div className="settings-form mt-4">
              <div className="setting-block row-between mb-4">
                <div>
                  <h4>Email Alerts</h4>
                  <p className="text-sm color-secondary mt-1">Receive email alerts when analysis completes.</p>
                </div>
                <div className="toggle-switch active"><div className="toggle-slider"></div></div>
              </div>

              <div className="setting-block row-between mb-4">
                <div>
                  <h4>System Notifications</h4>
                  <p className="text-sm color-secondary mt-1">Show toast notifications inside the UFDR dashboard.</p>
                </div>
                <div className="toggle-switch active"><div className="toggle-slider"></div></div>
              </div>

              <div className="setting-block row-between mb-4">
                <div>
                  <h4>Weekly Reports</h4>
                  <p className="text-sm color-secondary mt-1">Send a summary of case processing stats every Monday.</p>
                </div>
                <div className="toggle-switch"><div className="toggle-slider"></div></div>
              </div>
            </div>
          </div>
        )}

        {/* DATA & STORAGE TAB */}
        {activeTab === 'storage' && (
          <div className="settings-section fade-in">
            <div className="settings-header">
              <h3>Data & Storage</h3>
              <p>Manage disk usage and retention policies</p>
            </div>

            <div className="settings-form mt-4">
              <div className="setting-block mb-5">
                <div className="row-between mb-2">
                  <h4>Storage Usage</h4>
                  <span className="text-sm fw-600">45 GB / 100 GB</span>
                </div>
                <ProgressBar progress={45} />
                <p className="text-xs color-secondary mt-2">55 GB remaining on your current plan.</p>
              </div>

              <div className="setting-block mb-4">
                <h4>Data Retention Policy</h4>
                <p className="text-sm color-secondary mt-1 mb-3">Automatically delete unpinned case files after duration.</p>
                <select className="ui-select" style={{width: '200px'}}>
                  <option>30 Days</option>
                  <option>90 Days</option>
                  <option>1 Year</option>
                  <option>Never (Manual)</option>
                </select>
              </div>

              <div className="divider" />

              <div className="setting-block row-between">
                <div>
                  <h4 className="color-danger">Clear Cache</h4>
                  <p className="text-sm color-secondary mt-1">Free up space by deleting temporary staging files.</p>
                </div>
                <button className="btn-outline danger-outline flex-center gap-2">
                  <Trash2 size={16} /> Clean 2.4 GB
                </button>
              </div>
            </div>
          </div>
        )}

        {/* API TAB */}
        {activeTab === 'api' && (
          <div className="settings-section fade-in">
            <div className="settings-header row-between">
              <div>
                <h3>API Management</h3>
                <p>Manage access tokens for remote API integrations</p>
              </div>
              <button className="btn-primary flex-center gap-2">
                <Plus size={16} /> Generate Key
              </button>
            </div>

            <div className="api-keys-list mt-5">
              <div className="api-key-item">
                <div className="api-key-info">
                  <h4>Investigation System Integration</h4>
                  <div className="api-key-value">
                    <code>ufdr_live_8f92j...x92p</code>
                    <button className="icon-btn-small"><Copy size={14}/></button>
                  </div>
                </div>
                <div className="api-key-meta">
                  <span className="text-xs color-secondary">Created: Jan 12, 2024</span>
                  <button className="btn-text danger text-sm">Revoke</button>
                </div>
              </div>

              <div className="api-key-item mt-3">
                <div className="api-key-info">
                  <h4>Automated Backup Crawler</h4>
                  <div className="api-key-value">
                    <code>ufdr_live_4m29b...1o8q</code>
                    <button className="icon-btn-small"><Copy size={14}/></button>
                  </div>
                </div>
                <div className="api-key-meta">
                  <span className="text-xs color-secondary">Created: Mar 05, 2024</span>
                  <button className="btn-text danger text-sm">Revoke</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Settings;
