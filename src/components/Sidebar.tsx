import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, Database, Search, BarChart3, FileText, Settings, Shield } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Upload UFDR File', icon: UploadCloud, path: '/upload' },
    { name: 'Data Processing', icon: Database, path: '/processing' },
    { name: 'Query Analyzer', icon: Search, path: '/query' },
    { name: 'Analysis Results', icon: BarChart3, path: '/analysis' },
    { name: 'Reports', icon: FileText, path: '/reports' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <Shield className="logo-icon" size={24} color="#fff" />
        </div>
        <div className="logo-text">
          <h1>UFDR AI</h1>
          <span>Analysis Tool</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={20} className="nav-icon" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span>Version 1.0.0</span>
      </div>
    </div>
  );
};

export default Sidebar;
