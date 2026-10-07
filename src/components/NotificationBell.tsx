import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonIcon, useIonViewWillEnter } from '@ionic/react';
import { notificationsOutline } from 'ionicons/icons';
import { viewNotification } from '../utils/apiHelper';
import './TopBar.css';

const NotificationBell: React.FC = () => {
  const navigate = useHistory();
  const [count, setCount] = useState(0);

  const loadNotifications = async () => {
    const result = await viewNotification(navigate);
    setCount(result?.type === 'success' && Array.isArray(result.data) ? result.data.length : 0);
  };

  // Runs every time the page becomes visible, so the badge stays fresh
  useIonViewWillEnter(() => {
    loadNotifications();
  });

  return (
    <div className="notification-wrapper" onClick={() => navigate.push('/tabs/justification')}>
      <IonIcon icon={notificationsOutline} className="topbar-icon" />
      {count > 0 && <span className="badge">{count > 99 ? '99+' : count}</span>}
    </div>
  );
};

export default NotificationBell;