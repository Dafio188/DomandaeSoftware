import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaCheck, FaTrash, FaCircle } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config/api.js';
import './NotificationBell.css';

const API_URL = API_BASE_URL; // Porta corretta: 8088

function NotificationBell() {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const currentToken = token || localStorage.getItem('access');
      const response = await axios.get(`${API_URL}/api/notifiche/`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      setNotifications(response.data.results || response.data);
      setUnreadCount((response.data.results || response.data).filter(n => !n.letta).length);
    } catch (error) {
      console.error('Errore nel recupero notifiche:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Polling ogni 30 secondi
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      const currentToken = token || localStorage.getItem('access');
      await axios.post(`${API_URL}/api/notifiche/${id}/segna-letta/`, {}, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      setNotifications(notifications.map(n => n.id === id ? { ...n, letta: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Errore nel segnare come letta:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const currentToken = token || localStorage.getItem('access');
      await axios.post(`${API_URL}/api/notifiche/segna-tutte-lette/`, {}, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      setNotifications(notifications.map(n => ({ ...n, letta: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Errore nel segnare tutte come lette:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const currentToken = token || localStorage.getItem('access');
      await axios.delete(`${API_URL}/api/notifiche/${id}/`, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      setNotifications(notifications.filter(n => n.id !== id));
      if (!notifications.find(n => n.id === id).letta) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Errore nella cancellazione notifica:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button 
        className={`bell-button ${unreadCount > 0 ? 'has-unread' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifiche"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notifications-dropdown mac-glass-card">
          <div className="dropdown-header">
            <h6 className="mac-title mb-0">Notifiche</h6>
            {unreadCount > 0 && (
              <button className="mark-all-btn" onClick={markAllAsRead}>
                Segna tutte come lette
              </button>
            )}
          </div>

          <div className="notifications-list">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.letta ? 'read' : 'unread'}`}
                  onClick={() => !notification.letta && markAsRead(notification.id)}
                >
                  <div className="notification-content">
                    <div className="d-flex justify-content-between align-items-start">
                      <span className={`type-dot bg-${notification.tipo || 'info'}`}></span>
                      <small className="notification-time">
                        {new Date(notification.data_creazione).toLocaleDateString()}
                      </small>
                    </div>
                    <div className="notification-title mac-title small">{notification.titolo}</div>
                    <p className="notification-message mb-1">{notification.messaggio}</p>
                    {notification.link && (
                      <Link to={notification.link} className="notification-link" onClick={() => setIsOpen(false)}>
                        Visualizza dettagli
                      </Link>
                    )}
                  </div>
                  <div className="notification-actions">
                    {!notification.letta && (
                      <button className="action-btn read" onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }} title="Segna come letta">
                        <FaCheck />
                      </button>
                    )}
                    <button className="action-btn delete" onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }} title="Elimina">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <FaBell className="empty-icon" />
                <p>Nessuna notifica</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
