import { useState } from 'react';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  menuOutline,
  notificationsOutline,
  mailOutline,
  callOutline,
  cellularOutline,
  cardOutline,
  timeOutline,
  briefcaseOutline,
  calendarOutline,
  chevronForwardOutline,
  personOutline,
  documentTextOutline,
  settingsOutline,
  logOutOutline,
} from 'ionicons/icons';
import Sidebar from '../components/Sidebar';
import './Profile.css';

const Profile: React.FC = () => {
  const history = useHistory();
  const [menuOpen, setMenuOpen] = useState(false);

  const personalInfo = [
    { icon: mailOutline, label: 'Email', value: 'Ameruddin@mesiniaga.com.my' },
    { icon: callOutline, label: 'Phone Number', value: '010-7620309' },
    { icon: cellularOutline, label: 'Grade', value: 'MB-PG-3' },
    { icon: cardOutline, label: 'Employee ID', value: '562224' },
  ];

  const workDays = ['M', 'T', 'W', 'T', 'F'];

  const actions = [
    { icon: personOutline, label: 'My Leave', color: 'orange', onClick: () => history.push('/tabs/leave') },
    { icon: documentTextOutline, label: 'Justification', color: 'blue', onClick: () => history.push('/tabs/justification') },
    // { icon: settingsOutline, label: 'Settings', color: 'green', onClick: () => history.push('/tabs/settings') },
    { icon: logOutOutline, label: 'Log Out', color: 'red', onClick: () => history.replace('/login') },
  ];

  return (
    <IonPage>
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <IonContent fullscreen className="profile-content">
        {/* Top bar */}
        <div className="profile-topbar">
          <div className="profile-topbar-left">
            <IonIcon
              icon={menuOutline}
              className="topbar-icon"
              onClick={() => setMenuOpen(true)}
            />
            <h1 className="profile-title">Profile</h1>
          </div>
          <div className="notification-wrapper">
            <IonIcon icon={notificationsOutline} className="topbar-icon" />
            <span className="badge">2</span>
          </div>
        </div>

        {/* Identity card */}
        <div className="profile-card identity-card">
          <div className="profile-avatar">AM</div>
          <div className="identity-info">
            <span className="identity-name">Ameruddin Abdul Rahim</span>
            <span className="identity-role">PHP Stack</span>
          </div>
        </div>

        {/* Personal Information */}
        <div className="profile-card">
          <div className="card-head">
            <span className="card-title">Personal Information</span>
            <IonIcon icon={chevronForwardOutline} className="card-head-chevron" />
          </div>
          {personalInfo.map((item) => (
            <div className="info-row" key={item.label}>
              <span className="info-icon">
                <IonIcon icon={item.icon} />
              </span>
              <div className="info-text">
                <span className="info-label">{item.label}</span>
                <span className="info-value">{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Work Information */}
        <div className="profile-card">
          <div className="card-head">
            <span className="card-title">Work Information</span>
            <IonIcon icon={chevronForwardOutline} className="card-head-chevron" />
          </div>

          <div className="work-row">
            <span className="info-icon">
              <IonIcon icon={timeOutline} />
            </span>
            <span className="work-label">Check In Time</span>
            <span className="work-value">9:00 AM</span>
          </div>
          <div className="work-row">
            <span className="info-icon">
              <IonIcon icon={timeOutline} />
            </span>
            <span className="work-label">Check Out Time</span>
            <span className="work-value">5:30 PM</span>
          </div>

          <div className="work-row work-row-days">
            <span className="info-icon">
              <IonIcon icon={calendarOutline} />
            </span>
            <span className="work-label">Work Days</span>
            <div className="work-days">
              {workDays.map((d, i) => (
                <span className="day-chip" key={i}>{d}</span>
              ))}
            </div>
          </div>

          <div className="work-row">
            <span className="info-icon">
              <IonIcon icon={briefcaseOutline} />
            </span>
            <span className="work-label">Work Mode</span>
            <span className="work-value">Hybrid</span>
          </div>
          <div className="work-row">
            <span className="info-icon">
              <IonIcon icon={timeOutline} />
            </span>
            <span className="work-label">Total Working Hours (Today)</span>
            <span className="work-value">8 jam 30 min</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="profile-card actions-card">
          {actions.map((a) => (
            <button className="action-item" key={a.label} onClick={a.onClick}>
              <IonIcon icon={a.icon} className={`action-icon ${a.color}`} />
              <span className="action-label">{a.label}</span>
            </button>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
