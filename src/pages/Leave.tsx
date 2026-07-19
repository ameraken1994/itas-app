import { useState } from 'react';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import Sidebar from '../components/Sidebar';
import {
  menuOutline,
  notificationsOutline,
  airplaneOutline,
  medkitOutline,
  calendarOutline,
  chevronDownOutline,
  chevronForwardOutline,
  attachOutline,
  checkmarkOutline,
} from 'ionicons/icons';
import './Leave.css';

type LeaveTab = 'apply' | 'my';
type Session = 'full' | 'morning' | 'afternoon';

const Leave: React.FC = () => {
  const [tab, setTab] = useState<LeaveTab>('apply');
  const [session, setSession] = useState<Session>('full');
  const [reason, setReason] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [leaveType, setLeaveType] = useState('Annual Leave');

  const leaveTypes = [
    { label: 'Annual Leave', icon: airplaneOutline },
    { label: 'Medical Leave', icon: medkitOutline },
  ];
  const activeType = leaveTypes.find((t) => t.label === leaveType) ?? leaveTypes[0];

  const week = [
    { day: 'Mon', date: '13 Jul', status: 'wfh', label: 'WFH' },
    { day: 'Tue', date: '14 Jul', status: 'wfh', label: 'WFH' },
    { day: 'Wed', date: '15 Jul', status: 'leave', label: 'AL' },
    { day: 'Thu', date: '16 Jul', status: 'office', label: 'Office' },
    { day: 'Fri', date: '17 Jul', status: 'leave', label: 'MC', today: true },
  ];

  const history = [
    { month: 'JUL', day: '15', type: 'Annual Leave', detail: '1 Day • Wed, 15 Jul 2026', status: 'Approved' },
    { month: 'JUN', day: '10', type: 'Medical Leave', detail: '0.5 Day • Tue, 10 Jun 2026 (Morning)', status: 'Approved' },
    { month: 'MAY', day: '28-29', type: 'Annual Leave', detail: '2 Days • Wed, 28 May - Thu, 29 May 2026', status: 'Approved' },
  ];

  const sessions: { key: Session; label: string }[] = [
    { key: 'full', label: 'Full Day' },
    { key: 'morning', label: 'Morning Half' },
    { key: 'afternoon', label: 'Afternoon Half' },
  ];

  return (
    <IonPage>
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <IonContent fullscreen className="leave-content">
        {/* Top bar */}
        <div className="leave-topbar">
          <div className="leave-topbar-left">
            <IonIcon
              icon={menuOutline}
              className="topbar-icon"
              onClick={() => setMenuOpen(true)}
            />
            <h1 className="leave-title">Leave</h1>
          </div>
          <div className="notification-wrapper">
            <IonIcon icon={notificationsOutline} className="topbar-icon" />
            <span className="badge">2</span>
          </div>
        </div>

        {/* Segment */}
        <div className="leave-segment">
          <button
            className={`segment-btn ${tab === 'apply' ? 'active' : ''}`}
            onClick={() => setTab('apply')}
          >
            Apply Leave
          </button>
          <button
            className={`segment-btn ${tab === 'my' ? 'active' : ''}`}
            onClick={() => setTab('my')}
          >
            My Leave
          </button>
        </div>

        {tab === 'apply' && (
          <>
            {/* Apply Leave form */}
            <div className="leave-card">
              <span className="card-title">Apply Leave</span>
              <span className="card-subtitle">Submit a new leave request</span>

              {/* Leave Type */}
              <div className="form-group">
                <label className="form-label">Leave Type</label>
                <div className="select-wrapper">
                  <button
                    type="button"
                    className="select-field"
                    onClick={() => setTypeOpen((o) => !o)}
                  >
                    <span className="select-icon-wrapper">
                      <IonIcon icon={activeType.icon} />
                    </span>
                    <span className="select-value">{activeType.label}</span>
                    <IonIcon
                      icon={chevronDownOutline}
                      className={`select-chevron ${typeOpen ? 'open' : ''}`}
                    />
                  </button>

                  {typeOpen && (
                    <div className="select-dropdown">
                      {leaveTypes.map((t) => (
                        <button
                          type="button"
                          key={t.label}
                          className={`select-option ${leaveType === t.label ? 'active' : ''}`}
                          onClick={() => {
                            setLeaveType(t.label);
                            setTypeOpen(false);
                          }}
                        >
                          <span className="select-icon-wrapper">
                            <IonIcon icon={t.icon} />
                          </span>
                          <span className="select-option-label">{t.label}</span>
                          {leaveType === t.label && (
                            <IonIcon icon={checkmarkOutline} className="select-check" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <div className="date-field">
                    <IonIcon icon={calendarOutline} />
                    <span>17 July 2026 (Fri)</span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <div className="date-field">
                    <IonIcon icon={calendarOutline} />
                    <span>17 July 2026 (Fri)</span>
                  </div>
                </div>
              </div>

              {/* Session */}
              {/* <div className="form-group">
                <label className="form-label">
                  Session <span className="optional">(Optional)</span>
                </label>
                <div className="session-row">
                  {sessions.map((s) => (
                    <button
                      key={s.key}
                      className={`session-option ${session === s.key ? 'active' : ''}`}
                      onClick={() => setSession(s.key)}
                    >
                      <span className={`radio-dot ${session === s.key ? 'checked' : ''}`} />
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div> */}

              {/* Reason */}
              <div className="form-group">
                <label className="form-label">Reason</label>
                <div className="textarea-wrapper">
                  <textarea
                    className="reason-input"
                    placeholder="Enter reason for leave..."
                    maxLength={200}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <span className="char-count">{reason.length}/200</span>
                </div>
              </div>

              {/* Attachment */}
              {/* <div className="form-group">
                <label className="form-label">
                  Attachment <span className="optional">(Optional)</span>
                </label>
                <div className="attachment-row">
                  <button className="attachment-btn">
                    <IonIcon icon={attachOutline} />
                    <span>Add Attachment</span>
                  </button>
                  <span className="attachment-hint">Max 5MB</span>
                </div>
              </div> */}

              {/* Actions */}
              <div className="form-actions">
                <button className="btn-reset" onClick={() => { setReason(''); setSession('full'); }}>
                  Reset
                </button>
                <button className="btn-submit">Submit</button>
              </div>
            </div>

            {/* Whereabouts */}
            <div className="leave-card">
              <div className="list-header">
                <span className="card-title">This Week Whereabouts Planner</span>
                {/* <span className="view-all view-calendar">
                  View Calendar <IonIcon icon={calendarOutline} />
                </span> */}
              </div>
              <div className="week-row">
                {week.map((d) => (
                  <div className={`week-col ${d.today ? 'today' : ''}`} key={d.day}>
                    <span className="week-day">{d.day}</span>
                    <span className="week-date">{d.date}</span>
                    <span className={`week-marker ${d.status}`}>
                      {d.label === 'AL' && <IonIcon icon={airplaneOutline} />}
                      {d.label === 'MC' && <IonIcon icon={medkitOutline} />}
                    </span>
                    <span className="week-label">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'my' && (
          <>
          {/* Leave history */}
          <div className="leave-card">
            <div className="list-header">
              <span className="card-title">My Leave History</span>
              {/* <span className="view-all">View All</span> */}
            </div>
            {history.map((item, i) => (
              <div className="history-row" key={i}>
                <div className="date-box">
                  <span className="date-month">{item.month}</span>
                  <span className="date-day">{item.day}</span>
                </div>
                <div className="history-main">
                  <span className="history-type">{item.type}</span>
                  <span className="history-detail">{item.detail}</span>
                </div>
                <span className="status-pill green">{item.status}</span>
                <IonIcon icon={chevronForwardOutline} className="chevron" />
              </div>
            ))}
          </div>
          </>
        )}

        
      </IonContent>
    </IonPage>
  );
};

export default Leave;
