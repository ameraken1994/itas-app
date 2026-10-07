import { IonIcon } from '@ionic/react';
import { menuOutline } from 'ionicons/icons';
import NotificationBell from './NotificationBell';
import './TopBar.css';

interface TopBarProps {
  onMenuClick: () => void;
  title?: string;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick, title }) => (
  <div className="topbar">
    <div className="topbar-left">
      <IonIcon icon={menuOutline} className="topbar-icon" onClick={onMenuClick} />
      {title && <h1 className="topbar-title">{title}</h1>}
    </div>
    <NotificationBell />
  </div>
);

export default TopBar;