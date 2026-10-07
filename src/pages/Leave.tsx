import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonPage, IonIcon, IonModal, IonDatetime, IonSpinner, IonAlert } from '@ionic/react';
import Sidebar from '../components/Sidebar';
import {
  airplaneOutline,
  medkitOutline,
  calendarOutline,
  chevronDownOutline,
  checkmarkOutline,
  homeOutline,
  businessOutline,
  trashOutline,
} from 'ionicons/icons';
import { addLeave, getFuturePlans, viewLeave, deleteLeave  } from '../utils/apiHelper';
import './Leave.css';
import TopBar from '../components/TopBar';

type LeaveTab = 'apply' | 'my';

interface FuturePlan {
  date: string;
  status: string; // WFH, WIO, AL, MC
}

interface LeaveRecord {
  id: string;
  datefrom: string;
  dateto: string;
  reason: string;
}

const leaveTypeMap: Record<string, { label: string; icon: any; code: string }> = {
  'Annual Leave': { label: 'Annual Leave', icon: airplaneOutline, code: 'AL' },
  'Medical Leave': { label: 'Medical Leave', icon: medkitOutline, code: 'MC' },
};

const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const formatDisplayDate = (isoDate: string) => {
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'short' });
};

// const formatTableDate = (isoDate: string) => {
//   const d = new Date(`${isoDate}T00:00:00`);
//   return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
// };
const formatTableDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};

const Leave: React.FC = () => {
  const [tab, setTab] = useState<LeaveTab>('apply');
  const [reason, setReason] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [leaveType, setLeaveType] = useState('Annual Leave');
  const [submitting, setSubmitting] = useState(false);

  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState(todayISO());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [weekPlans, setWeekPlans] = useState<FuturePlan[]>([]);
  const [loadingWeek, setLoadingWeek] = useState(true);

  const [leaveHistory, setLeaveHistory] = useState<LeaveRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useHistory();

  const activeType = leaveTypeMap[leaveType];

  useEffect(() => {
    loadWeekPlans();
    loadLeaveHistory();
  }, []);

  const loadWeekPlans = async () => {
    setLoadingWeek(true);
    const result = await getFuturePlans(navigate);

    if (result?.type === 'success' && Array.isArray(result.data)) {
      setWeekPlans(result.data);
    } else {
      setWeekPlans([]);
    }

    setLoadingWeek(false);
  };

  const weekMarkerInfo = (status: string) => {
    switch (status) {
      case 'WFH':
        return { className: 'wfh', icon: homeOutline, label: 'WFH' };
      case 'AL':
        return { className: 'leave', icon: airplaneOutline, label: 'AL' };
      case 'MC':
        return { className: 'leave', icon: medkitOutline, label: 'MC' };
      case 'WIO':
      default:
        return { className: 'office', icon: businessOutline, label: 'Office' };
    }
  };

  const loadLeaveHistory = async () => {
    setLoadingHistory(true);
    const result = await viewLeave(navigate);

    if (result?.type === 'success' && Array.isArray(result.data)) {
      setLeaveHistory(result.data);
    } else {
      setLeaveHistory([]);
    }

    setLoadingHistory(false);
  };

  const handleDeleteLeave = async () => {
    if (!deleteId) return;

    setDeleting(true);
    const result = await deleteLeave(navigate, deleteId);

    if (result?.type === 'success') {
      await Promise.all([loadLeaveHistory(), loadWeekPlans()]);
    }

    setDeleting(false);
    setDeleteId(null);
  };


  const handleSubmit = async () => {
    if (!reason.trim()) return;

    setSubmitting(true);

    const payload = {
      fldDatefrom: startDate,
      fldDateto: endDate,
      fldHalfday: '0',
      fldHalfdaysession: '',
      fldReason: reason,
      fldType: activeType.code,
    };

    const result = await addLeave(navigate, payload);

    if (result?.type === 'success') {
      setReason('');
      setStartDate(todayISO());
      setEndDate(todayISO());
      loadWeekPlans();
      loadLeaveHistory();
      // Optionally show a toast here
    }

    setSubmitting(false);
  };

  return (
    <IonPage>
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <IonContent fullscreen className="leave-content">
        {/* Top bar */}
        <TopBar title="Leave" onMenuClick={() => setMenuOpen(true)} />

        {/* Segment */}
        <div className="leave-segment">
          <button
            className={`segment-btn ${tab === 'apply' ? 'active' : ''}`}
            onClick={() => setTab('apply')}
          >
            Register Leave
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
              <span className="card-title">Register Your Leave</span>
              <span className="card-subtitle">Set your leave details</span>

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
                      {Object.values(leaveTypeMap).map((t) => (
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
                  <button type="button" className="date-field" onClick={() => setShowStartPicker(true)}>
                    <IonIcon icon={calendarOutline} />
                    <span>{formatDisplayDate(startDate)}</span>
                  </button>
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <button type="button" className="date-field" onClick={() => setShowEndPicker(true)}>
                    <IonIcon icon={calendarOutline} />
                    <span>{formatDisplayDate(endDate)}</span>
                  </button>
                </div>
              </div>

              {/* Start date picker modal */}
              <IonModal isOpen={showStartPicker} onDidDismiss={() => setShowStartPicker(false)} className="date-picker-modal">
                <IonDatetime
                  presentation="date"
                  value={startDate}
                  onIonChange={(e) => {
                    const val = e.detail.value as string;
                    if (val) {
                      const iso = val.split('T')[0];
                      setStartDate(iso);
                      if (endDate < iso) setEndDate(iso);
                    }
                  }}
                />
                <div className="picker-actions">
                  <button className="btn-submit" onClick={() => setShowStartPicker(false)}>Done</button>
                </div>
              </IonModal>

              {/* End date picker modal */}
              <IonModal isOpen={showEndPicker} onDidDismiss={() => setShowEndPicker(false)} className="date-picker-modal">
                <IonDatetime
                  presentation="date"
                  value={endDate}
                  min={startDate}
                  onIonChange={(e) => {
                    const val = e.detail.value as string;
                    if (val) setEndDate(val.split('T')[0]);
                  }}
                />
                <div className="picker-actions">
                  <button className="btn-submit" onClick={() => setShowEndPicker(false)}>Done</button>
                </div>
              </IonModal>

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

              {/* Actions */}
              <div className="form-actions">
                <button
                  className="btn-reset"
                  onClick={() => {
                    setReason('');
                    setStartDate(todayISO());
                    setEndDate(todayISO());
                  }}
                >
                  Reset
                </button>
                <button className="btn-submit" onClick={handleSubmit} disabled={submitting || !reason.trim()}>
                  {submitting ? <IonSpinner name="crescent" /> : 'Submit'}
                </button>
              </div>
            </div>

            {/* Whereabouts / Future Plans */}
            <div className="leave-card">
              <div className="list-header">
                <span className="card-title">Attendance Plans</span>
              </div>

              {loadingWeek ? (
                <div className="loading-wrapper">
                  <IonSpinner name="crescent" />
                </div>
              ) : (
                <div className="week-row">
                  {weekPlans.map((d) => {
                    const info = weekMarkerInfo(d.status);
                    const dateObj = new Date(d.date);
                    const isToday = d.date === todayISO();

                    return (
                      <div className={`week-col ${isToday ? 'today' : ''}`} key={d.date}>
                        <span className="week-day">
                          {dateObj.toLocaleDateString('en-GB', { weekday: 'short' })}
                        </span>
                        <span className="week-date">
                          {dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                        <span className={`week-marker ${info.className}`}>
                          <IonIcon icon={info.icon} />
                        </span>
                        <span className="week-label">{info.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'my' && (
          <div className="leave-card">
            <div className="list-header">
              <span className="card-title">My Leave for Year : {new Date().getFullYear()}</span>
              <span className="card-title">Total Leave : {leaveHistory.length}</span>
            </div>

            {loadingHistory ? (
              <div className="loading-wrapper">
                <IonSpinner name="crescent" />
              </div>
            ) : leaveHistory.length === 0 ? (
              <p className="empty-state">No leave records found.</p>
            ) : (
              <div className="leave-table-wrapper">
                <table className="leave-table">
                  <thead>
                    <tr>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Reason</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveHistory.map((item, i) => (
                      <tr key={`${item.datefrom}-${i}`}>
                        <td>{formatTableDate(item.datefrom)}</td>
                        <td>{formatTableDate(item.dateto)}</td>
                        <td>{item.reason}</td>
                        <td>
                          <button
                            type="button"
                            className="icon-btn delete"
                            aria-label="Delete leave"
                            onClick={() => setDeleteId(item.id)}
                          >
                            <IonIcon icon={trashOutline} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
  </div>
        )}
        <IonAlert
          isOpen={deleteId !== null}
          header="Delete Leave"
          message="Are you sure you want to delete this leave?"
          onDidDismiss={() => !deleting && setDeleteId(null)}
          buttons={[
            { text: 'Cancel', role: 'cancel' },
            { text: deleting ? 'Deleting...' : 'Delete', role: 'destructive', handler: () => { handleDeleteLeave(); return false; } },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Leave;