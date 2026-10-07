import { useEffect, useState } from 'react';
import { IonContent, IonPage, IonIcon, IonSpinner } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  mailOutline,
  callOutline,
  cellularOutline,
  cardOutline,
  timeOutline,
  briefcaseOutline,
  calendarOutline,
  personOutline,
  documentTextOutline,
  logOutOutline,
} from 'ionicons/icons';
import Sidebar from '../components/Sidebar';
import { viewUserProfile } from '../utils/apiHelper';
import './Profile.css';
import TopBar from '../components/TopBar';

interface UserProfile {
  emp_id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  floor_location: string; // actually holds grade code, e.g. "MB-PG-3"
  time_in: string;
  time_out: string;
  hour: string;
  min: string;
  day: string; // JSON-encoded array of day numbers, e.g. '["2","4","5","3","1"]'
  workmode: string;
  workmode_name: string;
}

// 1 = Monday ... 7 = Sunday (standard ISO weekday numbering)
const dayInitialMap: Record<string, string> = {
  '1': 'M',
  '2': 'T',
  '3': 'W',
  '4': 'T',
  '5': 'F',
  '6': 'S',
  '7': 'S',
};

const dayOrder = ['7','1', '2', '3', '4', '5', '6']; // Sunday first, then Monday to Saturday

const formatTime12h = (time: string | null | undefined) => {
  if (!time) return '--:--';
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${suffix}`;
};

const getInitials = (name: string) =>
  name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();

const Profile: React.FC = () => {
  const history = useHistory();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const result = await viewUserProfile(history);

    if (result?.type === 'success' && result.data?.length > 0) {
      setProfile(result.data[0]);
    } else {
      setProfile(null);
    }

    setLoading(false);
  };

  const activeWorkDays: string[] = profile ? JSON.parse(profile.day) : [];

  const personalInfo = profile
    ? [
        { icon: mailOutline, label: 'Email', value: profile.email },
        { icon: callOutline, label: 'Phone Number', value: profile.phone || '-' },
        { icon: cellularOutline, label: 'Grade', value: profile.floor_location },
        { icon: cardOutline, label: 'Employee ID', value: profile.emp_id },
      ]
    : [];

  const actions = [
    { icon: personOutline, label: 'My Leave', color: 'orange', onClick: () => history.push('/tabs/leave') },
    { icon: documentTextOutline, label: 'Justification', color: 'blue', onClick: () => history.push('/tabs/justification') },
    { icon: logOutOutline, label: 'Log Out', color: 'red', onClick: () => history.replace('/login') },
  ];

  return (
    <IonPage>
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <IonContent fullscreen className="profile-content">
        {/* Top bar */}
        <TopBar title="My Profile" onMenuClick={() => setMenuOpen(true)} />

        {loading ? (
          <div className="loading-wrapper">
            <IonSpinner name="crescent" />
          </div>
        ) : !profile ? (
          <p className="empty-state">Unable to load profile.</p>
        ) : (
          <>
            {/* Identity card */}
            <div className="profile-card identity-card">
              <div className="profile-avatar">{getInitials(profile.name)}</div>
              <div className="identity-info">
                <span className="identity-name">{profile.name}</span>
                <span className="identity-role">{profile.department}</span>
              </div>
            </div>

            {/* Personal Information */}
            <div className="profile-card">
              <div className="card-head">
                <span className="card-title">Personal Information</span>
                {/* <IonIcon icon={chevronForwardOutline} className="card-head-chevron" /> */}
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
                {/* <IonIcon icon={chevronForwardOutline} className="card-head-chevron" /> */}
              </div>

              <div className="work-row">
                <span className="info-icon">
                  <IonIcon icon={timeOutline} />
                </span>
                <span className="work-label">Check In Time</span>
                <span className="work-value">{formatTime12h(profile.time_in)}</span>
              </div>
              <div className="work-row">
                <span className="info-icon">
                  <IonIcon icon={timeOutline} />
                </span>
                <span className="work-label">Check Out Time</span>
                <span className="work-value">{formatTime12h(profile.time_out)}</span>
              </div>

              <div className="work-row work-row-days">
                <span className="info-icon">
                  <IonIcon icon={calendarOutline} />
                </span>
                <span className="work-label">Work Days</span>
                <div className="work-days">
                  {dayOrder.map((d) => (
                    <span
                      className={`day-chip ${activeWorkDays.includes(d) ? 'active' : ''}`}
                      key={d}
                    >
                      {dayInitialMap[d]}
                    </span>
                  ))}
                </div>
              </div>

              <div className="work-row">
                <span className="info-icon">
                  <IonIcon icon={briefcaseOutline} />
                </span>
                <span className="work-label">Work Mode</span>
                <span className="work-value">{profile.workmode_name}</span>
              </div>
              <div className="work-row">
                <span className="info-icon">
                  <IonIcon icon={timeOutline} />
                </span>
                <span className="work-label">Standard Hours</span>
                <span className="work-value">{profile.hour} jam {profile.min} min</span>
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
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Profile;