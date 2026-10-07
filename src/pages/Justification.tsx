import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonPage, IonIcon, IonSpinner } from '@ionic/react';
import Sidebar from '../components/Sidebar';
import {
  searchOutline,
  addCircleOutline,
  closeOutline,
} from 'ionicons/icons';
import { viewAllJustification, addJustification } from '../utils/apiHelper';
import './Justification.css';
import TopBar from '../components/TopBar';

interface JustificationRecord {
  id: string;
  date: string;
  time_in: string;
  time_out: string | null;
  hour: string | null;
  min: string | null;
  duration: string;
  justification: string | null;
  status: string | null;
  status_out: string | null;
  sched_workmode: string;
  approvereject_date: string | null;
}

const DISPLAY_LIMIT = 10;

const formatTime12h = (time: string | null | undefined) => {
  if (!time) return '--:--';
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${suffix}`;
};

const formatDurationDisplay = (hour: string | null, min: string | null) => {
  if (hour === null || min === null) return '-';
  return `${hour}h ${min}m`;
};

const formatDateDisplay = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const Justification: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<JustificationRecord[]>([]);
  const navigate = useHistory();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [activeRecord, setActiveRecord] = useState<JustificationRecord | null>(null);
  const [formReason, setFormReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    const result = await viewAllJustification(navigate);

    if (result?.type === 'success' && Array.isArray(result.data)) {
      const sorted = [...result.data]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, DISPLAY_LIMIT);
      setRecords(sorted);
    } else {
      setRecords([]);
    }

    setLoading(false);
  };

  const filteredRecords = records.filter((r) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      r.date.toLowerCase().includes(term) ||
      (r.justification ?? '').toLowerCase().includes(term)
    );
  });

  const openModal = (record: JustificationRecord) => {
    setActiveRecord(record);
    setFormReason('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveRecord(null);
    setFormReason('');
  };

  const handleSubmit = async () => {
    if (!activeRecord || !formReason.trim()) return;
    setSubmitting(true);

    const result = await addJustification(navigate, activeRecord.id, formReason.trim());

    if (result?.type === 'success') {
      await loadRecords();
      closeModal();
    }

    setSubmitting(false);
  };

  return (
    <IonPage>
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <IonContent fullscreen className="justification-content">
        {/* Top bar */}
        <TopBar title="Justification" onMenuClick={() => setMenuOpen(true)} />

        {/* Search */}
        <div className="justification-card search-card">
          <div className="search-row">
            <div className="search-field">
              <IonIcon icon={searchOutline} />
              <input
                type="text"
                placeholder="Search by date or justification"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <span className="search-hint">Showing {filteredRecords.length} of {records.length} records</span>
        </div>

        {/* Table */}
        <div className="justification-card table-card">
          {loading ? (
            <div className="loading-wrapper">
              <IonSpinner name="crescent" />
            </div>
          ) : filteredRecords.length === 0 ? (
            <p className="empty-state">No records found.</p>
          ) : (
            <div className="table-scroll">
              <table className="justification-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time In</th>
                    <th>Time Out</th>
                    <th>Duration</th>
                    <th>Justification</th>
                    <th>In Status</th>
                    <th>Out Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((r) => {
                    const hasJustification = !!r.justification;
                    return (
                      <tr key={r.id} className={!hasJustification ? 'row-missing' : ''}>
                        <td>{formatDateDisplay(r.date)}</td>
                        <td>{formatTime12h(r.time_in)}</td>
                        <td>{formatTime12h(r.time_out)}</td>
                        <td>{formatDurationDisplay(r.hour, r.min)}</td>
                        <td>
                          {hasJustification ? (
                            r.justification
                          ) : (
                            <span className="missing-label">-</span>
                          )}
                        </td>
                        <td>
                          <span className={`status-pill ${r.status === 'Late' ? 'orange' : 'green'}`}>
                            <span className="status-dot" />
                            {r.status ?? '-'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-pill ${r.status_out === 'Early' ? 'orange' : 'green'}`}>
                            <span className="status-dot" />
                            {r.status_out ?? '-'}
                          </span>
                        </td>
                        <td>
                          {!hasJustification && (
                            <button className="add-btn" onClick={() => openModal(r)}>
                              <IonIcon icon={addCircleOutline} />
                              <span>Add</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Justification Modal */}
        {modalOpen && activeRecord && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add Justification</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                  <IonIcon icon={closeOutline} />
                </button>
              </div>

              <div className="modal-body">
                <div className="modal-field">
                  <label>Date</label>
                  <input type="text" className="modal-input" readOnly value={formatDateDisplay(activeRecord.date)} />
                </div>

                <div className="modal-field">
                  <label>Time In</label>
                  <input type="text" className="modal-input" readOnly value={formatTime12h(activeRecord.time_in)} />
                </div>

                <div className="modal-field">
                  <label>Time Out</label>
                  <input type="text" className="modal-input" readOnly value={formatTime12h(activeRecord.time_out)} />
                </div>

                <div className="modal-field">
                  <label>Justification</label>
                  <textarea
                    className="modal-textarea"
                    placeholder="Provide your justification here..."
                    value={formReason}
                    onChange={(e) => setFormReason(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-close" onClick={closeModal}>Close</button>
                <button
                  className="btn-submit-modal"
                  onClick={handleSubmit}
                  disabled={submitting || !formReason.trim()}
                >
                  {submitting ? <IonSpinner name="crescent" /> : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Justification;