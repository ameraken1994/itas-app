import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import Sidebar from '../components/Sidebar';
import {
  menuOutline,
  notificationsOutline,
  checkmarkCircle,
  businessOutline,
  homeOutline,
  locationOutline,
  timeOutline,
  logOutOutline,
  calendarOutline,
  alertCircleOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import './Home.css';

type AttendanceMode = 'office' | 'wfh' | 'outside';

const Home: React.FC = () => {
  const mode: AttendanceMode = 'office'; // TODO: wire to real state
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useHistory();

  const stats = [
    { icon: timeOutline, value: 0, label: 'Late', color: 'green' },
    { icon: logOutOutline, value: 0, label: 'Left Early', color: 'orange' },
    { icon: calendarOutline, value: 22, label: 'Working Days', color: 'blue' },
    { icon: alertCircleOutline, value: 0, label: 'Absent', color: 'red' },
  ];

  const recentAttendance = [
    { date: 'Mon, 7 Jul', time: '8:52 AM - 5:33 PM', status: 'On Time', dotColor: 'green' },
    { date: 'Fri, 4 Jul', time: '8:41 AM - 5:31 PM', status: 'On Time', dotColor: 'green' },
    { date: 'Thu, 3 Jul', time: 'Leave', status: 'Annual Leave', dotColor: 'orange' },
  ];

  const pendingJustifications = [
    { month: 'FEB', day: '29', time: '9:06 AM - 5:07 PM', note: 'Jam rekod anda tidak mencapai keperluan jadual.' },
    { month: 'MAR', day: '7', time: '8:31 AM - 4:32 PM', note: 'Jam rekod anda tidak mencapai keperluan jadual.' },
  ];

  return (
    <IonPage>
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <IonContent fullscreen className="home-content">
        {/* Top bar */}
        <div className="home-topbar">
          <IonIcon
            icon={menuOutline}
            className="topbar-icon"
            onClick={() => setMenuOpen(true)}
          />
          <div className="notification-wrapper">
            <IonIcon icon={notificationsOutline} className="topbar-icon" />
            <span className="badge">2</span>
          </div>
        </div>

        {/* Greeting */}
        <div className="greeting">
          <h1>Good Day, Ameruddin !</h1>
          <p>Tuesday, 8 July 2026</p>
        </div>

        {/* Status card */}
        <div className="status-card">
          <div className="status-icon-wrapper">
            <IonIcon icon={businessOutline} />
          </div>
          <div className="status-info">
            <span className="status-label">Current Status</span>
            <span className="status-value">Working From Office</span>
            <div className="status-checked">
              <span className="dot" />
              <span className="checked-text">Checked In</span>
              <span className="checked-time">9:06 AM</span>
            </div>
          </div>
          <div className="status-check">
            <IonIcon icon={checkmarkCircle} />
          </div>
        </div>

        {/* Today's attendance */}
        <div className="attendance-card">
          <span className="section-label">Today's Attendance</span>
          <div className="attendance-row">
            <div className="attendance-col">
              <span className="col-label">Checked In</span>
              <span className="col-value">9:06 AM</span>
            </div>
            <div className="divider-vertical" />
            <div className="attendance-col">
              <span className="col-label">Checked Out</span>
              <span className="col-value muted">--:--</span>
            </div>
          </div>

          <div className="mode-selector">
            <div className={`mode-option ${mode === 'office' ? 'active' : ''}`}>
              <IonIcon icon={businessOutline} />
              <span>Office</span>
              <span className={`radio ${mode === 'office' ? 'checked' : ''}`} />
            </div>
            <div className={`mode-option ${mode === 'wfh' ? 'active' : ''}`}>
              <IonIcon icon={homeOutline} />
              <span>WFH</span>
              <span className={`radio ${mode === 'wfh' ? 'checked' : ''}`} />
            </div>
            <div className={`mode-option ${mode === 'outside' ? 'active' : ''}`}>
              <IonIcon icon={locationOutline} />
              <span>Outside</span>
              <span className={`radio ${mode === 'outside' ? 'checked' : ''}`} />
            </div>
          </div>

          <button className="clock-out-btn">
            <IonIcon icon={timeOutline} />
            <span>Clock Out</span>
          </button>
        </div>

        {/* Stats grid */}
        <div className="stats-grid">
          {stats.map((s) => (
            <div className="stat-item" key={s.label}>
              <IonIcon icon={s.icon} className={`stat-icon ${s.color}`} />
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
              <span className="stat-period">This Month</span>
            </div>
          ))}
        </div>

        {/* Recent attendance */}
        <div className="list-card">
          <div className="list-header">
            <span className="section-label">Recent Attendance</span>
            <span className="view-all">View All</span>
          </div>
          {recentAttendance.map((item, i) => (
            <div className="list-row" key={i}>
              <span className={`dot ${item.dotColor}`} />
              <div className="list-row-main">
                <span className="row-date">{item.date}</span>
                <span className="row-time">{item.time}</span>
              </div>
              <span className={`status-pill ${item.dotColor}`}>{item.status}</span>
              <IonIcon icon={chevronForwardOutline} className="chevron" />
            </div>
          ))}
        </div>

        {/* Pending justifications */}
        <div className="list-card">
          <div className="list-header">
            <span className="section-label">
              Pending Justifications <span className="count-badge">2</span>
            </span>
            <span className="view-all" onClick={() => navigate.push('/tabs/justification')}>
              View All
            </span>
          </div>
          {pendingJustifications.map((item, i) => (
            <div className="justification-row" key={i}>
              <div className="date-box">
                <span className="date-month">{item.month}</span>
                <span className="date-day">{item.day}</span>
              </div>
              <div className="justification-main">
                <span className="justification-time">{item.time}</span>
                <span className="justification-note">{item.note}</span>
              </div>
              <IonIcon icon={chevronForwardOutline} className="chevron" />
            </div>
          ))}
        </div>

        {/* Floating clock button */}
        {/* <button className="floating-clock-btn">
          <IonIcon icon={timeOutline} />
          <span>Clock</span>
        </button> */}
      </IonContent>
    </IonPage>
  );
};

export default Home;