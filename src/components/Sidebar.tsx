import { IonIcon } from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  closeOutline,
  homeOutline,
  calendarOutline,
  barChartOutline,
  personOutline,
  settingsOutline,
  logOutOutline,
  locationOutline,
  documentTextOutline,
} from 'ionicons/icons';
import appLogo from '../assets/logo.png';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Home', icon: homeOutline, path: '/tabs/home' },
  { label: 'Leave', icon: calendarOutline, path: '/tabs/leave' },
  // { label: 'Reports', icon: barChartOutline, path: '/tabs/reports' },
  { label: 'Justification', icon: documentTextOutline, path: '/tabs/justification' },
  { label: 'Whereabouts', icon: locationOutline, path: '/tabs/whereabouts' },
  { label: 'Profile', icon: personOutline, path: '/tabs/profile' },
  // { label: 'Settings', icon: settingsOutline, path: '/tabs/settings' },
  
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const history = useHistory();
  const location = useLocation();

  const navigate = (path: string) => {
    onClose();
    history.push(path);
  };

  const handleLogout = () => {
    onClose();
    // TODO: clear auth/session state here
    history.replace('/login');
  };

  return (
    <>
      <div
        className={`sidebar-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img src={appLogo} alt="ITAS logo" className="sidebar-logo" />
            <div className="sidebar-brand-text">
              <span className="sidebar-title">ITAS</span>
              <span className="sidebar-subtitle">Mesiniaga Bhd <br/>(Northern Region)</span>
            </div>
          </div>
          <button className="sidebar-close" onClick={onClose} aria-label="Close menu">
            <IonIcon icon={closeOutline} />
          </button>
        </div>

        {/* User */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">AM</div>
          <div className="sidebar-user-info" onClick={() => navigate('/tabs/profile')}>
            <span className="sidebar-user-name">Ameruddin</span>
            <span className="sidebar-user-email">ameruddin@mesiniaga.com</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <IonIcon icon={item.icon} className="sidebar-nav-icon" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button className="sidebar-logout" onClick={handleLogout}>
          <IonIcon icon={logOutOutline} className="sidebar-nav-icon" />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
