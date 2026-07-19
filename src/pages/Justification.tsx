import { useState } from 'react';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import Sidebar from '../components/Sidebar';
import {
  menuOutline,
  notificationsOutline,
  searchOutline,
  filterOutline,
  createOutline,
  chevronBackOutline,
  chevronForwardOutline,
  informationCircleOutline,
  closeOutline,
} from 'ionicons/icons';
import './Justification.css';

interface JustificationRecord {
  date: string;
  timeIn: string;
  timeOut: string;
  duration: string;
  reason: string;
  inStatus: string;
  outStatus: string;
}

const Justification: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [activeRecord, setActiveRecord] = useState<JustificationRecord | null>(null);
  const [formDate, setFormDate] = useState('');
  const [formTimeIn, setFormTimeIn] = useState('');
  const [formTimeOut, setFormTimeOut] = useState('');
  const [formStatus, setFormStatus] = useState('On Time');
  const [formReason, setFormReason] = useState('');

  const records: JustificationRecord[] = [
    { date: '16 Jul 2026', timeIn: '9:20 AM', timeOut: '5:30 PM', duration: '8h 9m', reason: 'Meeting with Client', inStatus: 'Late', outStatus: 'On Time' },
    { date: '09 Jul 2026', timeIn: '9:57 AM', timeOut: '5:30 PM', duration: '7h 32m', reason: 'Traffic Jam', inStatus: 'On Time', outStatus: 'Early Out' },
    { date: '08 Jul 2026', timeIn: '9:05 AM', timeOut: '5:30 PM', duration: '8h 24m', reason: 'System Maintenance', inStatus: 'On Time', outStatus: 'On Time' },
    { date: '03 Jul 2026', timeIn: '9:12 AM', timeOut: '5:30 PM', duration: '8h 17m', reason: 'Doctor Appointment', inStatus: 'On Time', outStatus: 'On Time' },
    { date: '05 Jun 2026', timeIn: '9:03 AM', timeOut: '5:30 PM', duration: '8h 26m', reason: 'Team Training', inStatus: 'On Time', outStatus: 'On Time' },
    { date: '26 May 2026', timeIn: '9:07 AM', timeOut: '5:30 PM', duration: '8h 22m', reason: 'Meeting with Vendor', inStatus: 'On Time', outStatus: 'On Time' },
    { date: '25 May 2026', timeIn: '9:02 AM', timeOut: '5:30 PM', duration: '8h 27m', reason: 'Public Holiday Eve', inStatus: 'On Time', outStatus: 'On Time' },
  ];

  const totalPages = 5;
  const pageNumbers = [1, 2, 3, 4, 5];

  const openModal = (record: JustificationRecord) => {
    setActiveRecord(record);
    setFormDate(record.date);
    setFormTimeIn(record.timeIn);
    setFormTimeOut(record.timeOut);
    setFormStatus(record.inStatus);
    setFormReason(record.reason);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveRecord(null);
  };

  const handleSubmit = () => {
    // TODO: send formDate/formTimeIn/formTimeOut/formStatus/formReason to PHP API
    console.log('Submitting justification', {
      date: formDate,
      timeIn: formTimeIn,
      timeOut: formTimeOut,
      status: formStatus,
      reason: formReason,
    });
    closeModal();
  };

  return (
    <IonPage>
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <IonContent fullscreen className="justification-content">
        {/* Top bar */}
        <div className="justification-topbar">
          <div className="justification-topbar-left">
            <IonIcon
              icon={menuOutline}
              className="topbar-icon"
              onClick={() => setMenuOpen(true)}
            />
            <h1 className="justification-title">Justification</h1>
          </div>
          <div className="notification-wrapper">
            <IonIcon icon={notificationsOutline} className="topbar-icon" />
            <span className="badge">2</span>
          </div>
        </div>

        {/* Search + Filter */}
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
            <button className="filter-btn">
              <IonIcon icon={filterOutline} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="justification-card table-card">
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
                {records.map((r, i) => (
                  <tr key={i}>
                    <td>{r.date}</td>
                    <td>{r.timeIn}</td>
                    <td>{r.timeOut}</td>
                    <td>{r.duration}</td>
                    <td>{r.reason}</td>
                    <td>
                      <span className="status-pill green">
                        <span className="status-dot" />
                        {r.inStatus}
                      </span>
                    </td>
                    <td>
                      <span className="status-pill green">
                        <span className="status-dot" />
                        {r.outStatus}
                      </span>
                    </td>
                    <td>
                      <button className="edit-btn" onClick={() => openModal(r)}>
                        <IonIcon icon={createOutline} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              className="page-nav"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <IonIcon icon={chevronBackOutline} />
            </button>
            {pageNumbers.map((n) => (
              <button
                key={n}
                className={`page-num ${currentPage === n ? 'active' : ''}`}
                onClick={() => setCurrentPage(n)}
              >
                {n}
              </button>
            ))}
            <span className="page-ellipsis">...</span>
            <button
              className="page-nav"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <IonIcon icon={chevronForwardOutline} />
            </button>
          </div>
        </div>

        {/* Justification Modal */}
        {modalOpen && activeRecord && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add Your Justification</h2>
                <button className="modal-close-btn" onClick={closeModal}>
                  <IonIcon icon={closeOutline} />
                </button>
              </div>

              <div className="modal-body">
                <div className="modal-field">
                  <label>Date</label>
                  <input
                    type="text"
                    className="modal-input"
                    readOnly
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                  />
                </div>

                <div className="modal-field">
                  <label>Time In</label>
                  <input
                    type="text"
                    className="modal-input"
                    readOnly
                    value={formTimeIn}
                    onChange={(e) => setFormTimeIn(e.target.value)}
                  />
                </div>

                <div className="modal-field">
                  <label>Time Out</label>
                  <input
                    type="text"
                    className="modal-input"
                    readOnly
                    value={formTimeOut}
                    onChange={(e) => setFormTimeOut(e.target.value)}
                  />
                </div>

                <div className="modal-field">
                  <label>Status</label>
                  <input
                    type="text"
                    className="modal-input"
                    readOnly
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                  />
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
                <button className="btn-submit-modal" onClick={handleSubmit}>Submit</button>
              </div>
            </div>
          </div>
        )}

        {/* Info banner */}
        {/* <div className="info-banner">
          <div className="info-banner-left">
            <IonIcon icon={informationCircleOutline} className="info-icon" />
            <div className="info-text">
              <span className="info-title">Need to submit a new justification?</span>
              <span className="info-subtitle">You can add a new justification for your attendance records.</span>
            </div>
          </div>
          <button className="add-justification-btn">Add Justification</button>
        </div> */}
      </IonContent>
    </IonPage>
  );
};

export default Justification;