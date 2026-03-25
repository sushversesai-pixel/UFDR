import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, Moon, Sun, LogOut, MessageSquare, X, Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, onLogout }) => {
  const location = useLocation();
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, sender: 'ai', text: 'Hello Investigator! I am your AI assistant. How can I help you analyze the UFDR data today?' }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Analysis for CASE-2024-0412 complete', time: '5m ago', unread: true },
    { id: 2, text: 'New UFDR file uploaded successfully', time: '1h ago', unread: true },
    { id: 3, text: 'Suspicious pattern detected in device_report_001.ufdr', time: '2h ago', unread: false },
    { id: 4, text: 'Data extraction finished with 12 warnings', time: '1d ago', unread: false }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };
  
  const getPageTitle = (path: string) => {
    switch(path) {
      case '/dashboard': return 'Dashboard';
      case '/upload': return 'Upload UFDR File';
      case '/processing': return 'Data Processing';
      case '/query': return 'Query Analyzer';
      case '/analysis': return 'Analysis Results';
      case '/reports': return 'Reports';
      case '/settings': return 'Settings';
      default: return 'Overview';
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newId = Date.now();
    setChatHistory(prev => [...prev, { id: newId, sender: 'user', text: chatMessage }]);
    setChatMessage('');

    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: 'I am analyzing your request against the current case files. Please check the Query Analyzer for deeper programmatic extractions.' 
      }]);
    }, 1500);
  };

  return (
    <>
      <header className="header">
        <div className="header-title">
          <h2>{getPageTitle(location.pathname)}</h2>
        </div>
        
        <div className="header-actions">
          <button className="action-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button 
            className={`action-btn ${isMessageOpen ? 'active' : ''}`} 
            onClick={() => setIsMessageOpen(true)}
            aria-label="Messages"
          >
            <MessageSquare size={20} />
          </button>

          <div className="notification-wrapper" ref={notificationRef}>
            <button 
              className={`action-btn ${showNotifications ? 'active' : ''}`} 
              aria-label="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
            </button>
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}

            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  {unreadCount > 0 && (
                    <button className="mark-read-btn" onClick={markAllAsRead}>
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="notifications-list">
                  {notifications.length > 0 ? (
                     notifications.map(notif => (
                       <div 
                         key={notif.id} 
                         className={`notification-item ${notif.unread ? 'unread' : ''}`}
                         onClick={() => markAsRead(notif.id)}
                       >
                         <div className="notification-text">{notif.text}</div>
                         <div className="notification-time">{notif.time}</div>
                       </div>
                     ))
                  ) : (
                    <div className="notification-item" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                      No new notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="user-profile">
            <button className="profile-btn" aria-label="User menu">
              <User size={20} />
            </button>
            
            <button className="logout-btn" onClick={onLogout} aria-label="Logout" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out AI Assistant Drawer */}
      <div className={`ai-drawer-overlay ${isMessageOpen ? 'open' : ''}`} onClick={() => setIsMessageOpen(false)}></div>
      <div className={`ai-drawer ${isMessageOpen ? 'open' : ''}`}>
        <div className="ai-drawer-header">
          <div className="ai-drawer-title">
            <div className="ai-avatar">AI</div>
            <h3>UFDR Assistant</h3>
          </div>
          <button className="close-btn" onClick={() => setIsMessageOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <div className="ai-drawer-messages">
          {chatHistory.map(msg => (
            <div key={msg.id} className={`chat-message ${msg.sender}`}>
              <div className="chat-bubble">
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        
        <div className="ai-drawer-footer">
          <form className="ai-chat-form" onSubmit={handleSendMessage}>
            <input 
              type="text" 
              placeholder="Ask me anything..." 
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
            />
            <button type="submit" disabled={!chatMessage.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Header;
