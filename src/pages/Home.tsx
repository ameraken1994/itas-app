import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonPage, IonIcon, IonSpinner } from '@ionic/react';
import Sidebar from '../components/Sidebar';
import {
  checkmarkCircle,
  businessOutline,
  homeOutline,
  locationOutline,
  timeOutline,
  logOutOutline,
  calendarOutline,
  alertCircleOutline,
  chevronForwardOutline,
  closeOutline,
} from 'ionicons/icons';
import { viewAttendance, addTimeIn, addTimeOut, viewAttendanceMonthly, getCheckInOut, viewAllJustification } from '../utils/apiHelper';
import './Home.css';
import TopBar from '../components/TopBar';

type AttendanceMode = 'Office' | 'WFH' | 'WFA' | 'AL' | 'MC' | '';

interface AttendanceRecord {
  id: string;
  userid: string;
  attendance_date: string;
  time_in: string | null;
  time_out: string | null;
  time: string;
  hour: string | null;
  min: string | null;
  type: string;
  location: string;
  reason: string;
  status: string | null;
  allow_wfa: string;
  allow_wfh: string;
};

interface MonthlyAttendanceRow {
  id: string;
  attendance_date: string;
  time_in: string | null;
  time_out: string | null;
  duration: string;
  type: string;
  location: string;
  status: string | null;
  status_out: string | null;
  status_duration: string | null;
};

interface CheckInOutStats {
  total_days: number;
  latecheckin: number;
  earlycheckout: number;
};

interface JustificationRow {
  id: string;
  date: string;
  time_in: string;
  time_out: string | null;
  status: string | null;
  status_out: string | null;
  sched_workmode: string;
  message: string;
}

const formatTime12h = (time: string | null | undefined) => {
  if (!time) return null;
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${suffix}`;
};

const Home: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useHistory();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [record, setRecord] = useState<AttendanceRecord | null>(null);
  const [mode, setMode] = useState<AttendanceMode>('');

  const [monthlyAttendance, setMonthlyAttendance] = useState<MonthlyAttendanceRow[]>([]);
  const [checkInOutStats, setCheckInOutStats] = useState<CheckInOutStats | null>(null);

  const [fullMonthlyAttendance, setFullMonthlyAttendance] = useState<MonthlyAttendanceRow[]>([]);
  const [justifications, setJustifications] = useState<JustificationRow[]>([]);

  const [showWfaModal, setShowWfaModal] = useState(false);
  const [wfaLocation, setWfaLocation] = useState('');
  const [wfaReason, setWfaReason] = useState('');
  const [wfaError, setWfaError] = useState('');

  const absentCount = fullMonthlyAttendance.filter(
    (row) => row.type === 'AL' || row.type === 'MC'
  ).length;

    const stats = [
    { icon: timeOutline, value: checkInOutStats?.latecheckin ?? 0, label: 'Late', color: 'green' },
    { icon: logOutOutline, value: checkInOutStats?.earlycheckout ?? 0, label: 'Left Early', color: 'orange' },
    { icon: calendarOutline, value: checkInOutStats?.total_days ?? 0, label: 'Working Days', color: 'blue' },
    { icon: alertCircleOutline, value: absentCount, label: 'Absent', color: 'red' },
  ];

  useEffect(() => {
    loadAttendance();
    loadMonthlyAttendance();
    loadCheckInOutStats();
    loadJustifications();
  }, []);

  const mapType = (type: string | null | undefined): AttendanceMode => {
    if (!type) return 'Office';
    if (type === 'WIO') return 'Office';
    if (['WFH', 'WFA', 'AL', 'MC'].includes(type)) return type as AttendanceMode;
    return 'Office';
  };

  const loadCheckInOutStats = async () => {
    const result = await getCheckInOut(navigate);

    if (result?.type === 'success' && Array.isArray(result.data) && result.data.length > 0) {
      setCheckInOutStats(result.data[0]);
    } else {
      setCheckInOutStats(null);
    }
  };

  const loadAttendance = async () => {
    setLoading(true);
    const result = await viewAttendance(navigate);

    if (result?.type === 'success' && result.data?.length > 0) {
      const row: AttendanceRecord = result.data[0];
      setRecord(row);

      if (row.time_in) {
        // Already checked in today — always reflect the ACTUAL recorded type, never guess
        setMode(mapType(row.type));
      } else {
        // Not checked in yet — pick a sensible default selection (matches web app's behavior)
        setMode(row.allow_wfh === '1' ? 'WFH' : row.allow_wfa === '1' ? 'WFA' : 'Office');
      }
    } else {
      setRecord(null);
    }

    setLoading(false);
  };

  const loadMonthlyAttendance = async () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear());

    const result = await viewAttendanceMonthly(navigate, month, year);

    if (result?.type === 'success' && Array.isArray(result.data)) {
      setFullMonthlyAttendance(result.data);
      const sorted = [...result.data].reverse().slice(0, 5);
      setMonthlyAttendance(sorted);
    } else {
      setFullMonthlyAttendance([]);
      setMonthlyAttendance([]);
    }
  };

  const formatDateShort = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-MY', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const rowStatusColor = (row: MonthlyAttendanceRow) => {
    if (row.type === 'AL' || row.type === 'MC') return 'orange';
    if (row.status === 'Late' || row.status_out === 'Early') return 'orange';
    return 'green';
  };

  const rowStatusLabel = (row: MonthlyAttendanceRow) => {
    if (row.type === 'AL') return 'Annual Leave';
    if (row.type === 'MC') return 'Medical Leave';
    if (row.status === 'Late') return 'Late';
    if (row.status_out === 'Early') return 'Early Out';
    return 'On Time';
  };

  const rowTimeDisplay = (row: MonthlyAttendanceRow) => {
    if (row.type === 'AL' || row.type === 'MC') return 'Leave';
    const inTime = formatTime12h(row.time_in) ?? '--:--';
    const outTime = formatTime12h(row.time_out) ?? '--:--';
    return `${inTime} - ${outTime}`;
  };

  const submitClockIn = async (location: string, reason: string) => {
    setSubmitting(true);

    const result = await addTimeIn(navigate, { type: mode, location, reason });

    if (result?.type === 'success') {
      await loadAttendance();
    }

    setSubmitting(false);
    return result?.type === 'success';
  };

  const handleClockIn = async () => {
    if (!record) return;

    if (mode === 'WFA') {
      setWfaError('');
      setShowWfaModal(true); // collect location + reason first
      return;
    }

    await submitClockIn(mode === 'WFH' ? 'Home' : mode === 'Office' ? 'Office' : '', '');
  };

  const handleWfaConfirm = async () => {
    if (!wfaLocation.trim() || !wfaReason.trim()) {
      setWfaError('Please fill in both location and purpose.');
      return;
    }

    const ok = await submitClockIn(wfaLocation.trim(), wfaReason.trim());

    if (ok) {
      setShowWfaModal(false);
      setWfaLocation('');
      setWfaReason('');
      setWfaError('');
    } else {
      setWfaError('Check-in failed. Please try again.');
    }
  };

  const handleWfaClose = () => {
    if (submitting) return;
    setShowWfaModal(false);
    setWfaError('');
  };

  const handleClockOut = async () => {
    setSubmitting(true);
    const result = await addTimeOut(navigate);

    if (result?.type === 'success') {
      await loadAttendance();
    }

    setSubmitting(false);
  };

  const isCheckedOut = !!record?.time_out;
  const isLeaveType = record?.type === 'AL' || record?.type === 'MC';

  // Mode selector + Clock In button stay ACTIVE until checked out — matches web app behavior
  const canStillClockIn = !isCheckedOut && !isLeaveType;

  const statusLabel = () => {
    if (isLeaveType) return record?.type === 'AL' ? 'On Annual Leave' : 'On Medical Leave';
    if (mode === 'WFH') return 'Working From Home';
    if (mode === 'WFA') return 'Working Outside';
    return 'Working From Office';
  };

  const statusIcon = () => {
    if (mode === 'WFH') return homeOutline;
    if (mode === 'WFA') return locationOutline;
    return businessOutline;
  };

  const todayName = new Date().toLocaleDateString('en-MY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formatDateParts = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      month: d.toLocaleDateString('en-MY', { month: 'short' }).toUpperCase(),
      day: String(d.getDate()),
    };
  };

  const justificationTimeRange = (row: JustificationRow) => {
    const inTime = formatTime12h(row.time_in) ?? '--:--';
    const outTime = row.time_out ? formatTime12h(row.time_out) ?? '--:--' : '--:--';
    return `${inTime} - ${outTime}`;
  };

  const loadJustifications = async () => {
    const result = await viewAllJustification(navigate);

    if (result?.type === 'success' && Array.isArray(result.data)) {
      const sorted = [...result.data]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
      setJustifications(sorted);
    } else {
      setJustifications([]);
    }
  };

  return (
    <IonPage>
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <IonContent fullscreen className="home-content">
        {/* Top bar */}
        <TopBar onMenuClick={() => setMenuOpen(true)} />

        {/* Greeting */}
        <div className="greeting">
          <h1>Good Day, Ameruddin !</h1>
          <p>{todayName}</p>
        </div>

        {loading ? (
          <div className="loading-wrapper">
            <IonSpinner name="crescent" />
          </div>
        ) : (
          <>
            {/* Status card — reflects the LATEST check-in, updates every time you re-clock-in */}
            <div className="status-card">
              <div className="status-icon-wrapper">
                <IonIcon icon={statusIcon()} />
              </div>
              <div className="status-info">
                <span className="status-label">Current Status</span>
                <span className="status-value">{statusLabel()}</span>
                {mode === 'Office' && record?.location && (
                  <span className="status-location">{record.location}</span>
                )}
                <div className="status-checked">
                  <span className={`dot ${record?.time_in ? '' : 'gray'}`} />
                  <span className="checked-text">
                    {record?.time_in ? 'Checked In' : 'Not Checked In'}
                  </span>
                  {record?.time_in && (
                    <span className="checked-time">{formatTime12h(record.time_in)}</span>
                  )}
                </div>
              </div>
              {record?.time_in && (
                <div className="status-check">
                  <IonIcon icon={checkmarkCircle} />
                </div>
              )}
            </div>

            {/* Today's attendance */}
            <div className="attendance-card">
              <span className="section-label">Today's Attendance</span>
              <div className="attendance-row">
                <div className="attendance-col">
                  <span className="col-label">Checked In</span>
                  <span className="col-value">{formatTime12h(record?.time_in) ?? '--:--'}</span>
                </div>
                <div className="divider-vertical" />
                <div className="attendance-col">
                  <span className="col-label">Checked Out</span>
                  <span className={`col-value ${!record?.time_out ? 'muted' : ''}`}>
                    {formatTime12h(record?.time_out) ?? '--:--'}
                  </span>
                </div>
              </div>

              {/* Mode selector — stays active/clickable until checked out, allowing re-clock-in with a new mode */}
              {canStillClockIn && (
                <div className="mode-selector">
                  {record?.allow_wfh === '1' && (
                    <div
                      className={`mode-option ${mode === 'WFH' ? 'active' : ''}`}
                      onClick={() => setMode('WFH')}
                    >
                      <IonIcon icon={homeOutline} />
                      <span>WFH</span>
                      <span className={`radio ${mode === 'WFH' ? 'checked' : ''}`} />
                    </div>
                  )}
                  {record?.allow_wfa === '1' && (
                    <div
                      className={`mode-option ${mode === 'WFA' ? 'active' : ''}`}
                      onClick={() => setMode('WFA')}
                    >
                      <IonIcon icon={locationOutline} />
                      <span>Outside</span>
                      <span className={`radio ${mode === 'WFA' ? 'checked' : ''}`} />
                    </div>
                  )}
                  <div
                    className={`mode-option ${mode === 'Office' ? 'active' : ''}`}
                    onClick={() => setMode('Office')}
                  >
                    <IonIcon icon={businessOutline} />
                    <span>Office</span>
                    <span className={`radio ${mode === 'Office' ? 'checked' : ''}`} />
                  </div>
                </div>
              )}

              {/* Clock In button — always available (re-clockable) until checked out */}
              {canStillClockIn && (
                <button className="clock-out-btn" onClick={handleClockIn} disabled={submitting}>
                  {submitting ? (
                    <IonSpinner name="crescent" />
                  ) : (
                    <>
                      <IonIcon icon={timeOutline} />
                      <span>{record?.time_in ? 'Update Check In' : 'Clock In'}</span>
                    </>
                  )}
                </button>
              )}

              {/* Clock Out button — only enabled once actually checked in, disabled after checked out */}
              {record?.time_in && !isLeaveType && (
                <button
                  className="clock-out-btn secondary"
                  onClick={handleClockOut}
                  disabled={submitting || isCheckedOut}
                >
                  {submitting ? (
                    <IonSpinner name="crescent" />
                  ) : (
                    <>
                      <IonIcon icon={timeOutline} />
                      <span>{isCheckedOut ? 'Clocked Out' : 'Clock Out'}</span>
                    </>
                  )}
                </button>
              )}

              {isLeaveType && (
                <button className="clock-out-btn" disabled>
                  <span>On {record?.type} — no clock-in required</span>
                </button>
              )}
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
                {/* <span className="view-all">View All</span> */}
              </div>
              {monthlyAttendance.length === 0 ? (
                <p className="empty-state">No attendance records yet this month.</p>
              ) : (
                monthlyAttendance.map((row) => (
                  <div className="list-row" key={row.id}>
                    <span className={`dot ${rowStatusColor(row)}`} />
                    <div className="list-row-main">
                      <span className="row-date">{formatDateShort(row.attendance_date)}</span>
                      <span className="row-time">{rowTimeDisplay(row)}</span>
                    </div>
                    <span className={`status-pill ${rowStatusColor(row)}`}>{rowStatusLabel(row)}</span>
                    {/* <IonIcon icon={chevronForwardOutline} className="chevron" /> */}
                  </div>
                ))
              )}
            </div>

            {/* Pending justifications */}
            <div className="list-card">
              <div className="list-header">
                <span className="section-label">
                  Recent Pending Justifications
                  {/* Pending Justifications <span className="count-badge">{justifications.length}</span> */}
                </span>
                <span className="view-all" onClick={() => navigate.push('/tabs/justification')}>
                  View All
                </span>
              </div>
              {justifications.length === 0 ? (
                <p className="empty-state">No pending justifications 🎉</p>
              ) : (
                justifications.map((item) => {
                  const { month, day } = formatDateParts(item.date);
                  return (
                    <div
                      className="justification-row"
                      key={item.id}
                      onClick={() => navigate.push('/tabs/justification')}
                    >
                      <div className="date-box">
                        <span className="date-month">{month}</span>
                        <span className="date-day">{day}</span>
                      </div>
                      <div className="justification-main">
                        <span className="justification-time">{justificationTimeRange(item)}</span>
                        <span className="justification-note">{item.message || 'No justification provided'}</span>
                      </div>
                      <IonIcon icon={chevronForwardOutline} className="chevron" />
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </IonContent>
      {showWfaModal && (
        <div className="wfa-overlay" onClick={handleWfaClose}>
          <div className="wfa-modal" onClick={(e) => e.stopPropagation()}>
            <button className="wfa-close" onClick={handleWfaClose} aria-label="Close">
              <IonIcon icon={closeOutline} />
            </button>

            <h2 className="wfa-title">Please provide your location and purpose</h2>

            <label className="wfa-label">Location</label>
            <input
              className="wfa-input"
              type="text"
              value={wfaLocation}
              onChange={(e) => setWfaLocation(e.target.value)}
            />

            <label className="wfa-label">Purpose</label>
            <input
              className="wfa-input"
              type="text"
              value={wfaReason}
              onChange={(e) => setWfaReason(e.target.value)}
            />

            {wfaError && <p className="wfa-error">{wfaError}</p>}

            <div className="wfa-actions">
              <button className="wfa-btn" onClick={handleWfaClose} disabled={submitting}>
                Close
              </button>
              <button className="wfa-btn primary" onClick={handleWfaConfirm} disabled={submitting}>
                {submitting ? <IonSpinner name="crescent" /> : 'Check In'}
              </button>
            </div>
          </div>
        </div>
      )}
    </IonPage>
  );
};

export default Home;