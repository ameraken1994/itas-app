import { useState } from 'react';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import Sidebar from '../components/Sidebar';
import {
  menuOutline,
  notificationsOutline,
  searchOutline,
  filterOutline,
  chevronDownOutline,
  refreshOutline,
  chevronDownCircleOutline,
  businessOutline,
  homeOutline,
  locationOutline,
  removeCircleOutline,
} from 'ionicons/icons';
import './Whereabouts.css';

type LocationStatus = 'office' | 'wfh' | 'outside' | 'not-checked-in';

interface Employee {
  name: string;
  designation: string;
  location: LocationStatus;
  locationLabel: string;
  time: string;
  status: string;
}

const Whereabouts: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  const overview = [
    { icon: businessOutline, value: 16, label: 'In Office', color: 'green' },
    { icon: homeOutline, value: 8, label: 'WFH', color: 'blue' },
    { icon: locationOutline, value: 5, label: 'Outside', color: 'orange' },
    { icon: removeCircleOutline, value: 2, label: 'Not Checked In', color: 'gray' },
  ];

  const employees: Employee[] = [
    { name: 'Ameruddin Mohd Nor', designation: 'Software Developer', location: 'office', locationLabel: 'Office', time: '9:06 AM', status: 'In Office' },
    { name: 'Nurul Aisyah Binti Ahmad', designation: 'Business Analyst', location: 'wfh', locationLabel: 'WFH', time: '9:02 AM', status: 'WFH' },
    { name: 'Daniel Lim Wei Sheng', designation: 'Project Manager', location: 'office', locationLabel: 'Office', time: '8:58 AM', status: 'In Office' },
    { name: 'Siti Hajar Binti Hassan', designation: 'UI/UX Designer', location: 'outside', locationLabel: 'Outside', time: '9:10 AM', status: 'Outside' },
    { name: 'Muhammad Iqbal Bin Jamaluddin', designation: 'System Engineer', location: 'wfh', locationLabel: 'WFH', time: '8:55 AM', status: 'WFH' },
    { name: 'Farah Nabilah Binti Zulkifli', designation: 'HR Executive', location: 'office', locationLabel: 'Office', time: '9:01 AM', status: 'In Office' },
    { name: 'Kevin Tan Jun Wei', designation: 'DevOps Engineer', location: 'outside', locationLabel: 'Outside', time: '8:47 AM', status: 'Outside' },
    { name: 'Amira Natasha Binti Roslan', designation: 'QA Engineer', location: 'not-checked-in', locationLabel: 'Not Checked In', time: '-', status: 'Not Checked In' },
  ];

  const getInitials = (name: string) =>
    name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();

  const locationIcon = (loc: LocationStatus) => {
    switch (loc) {
      case 'office': return businessOutline;
      case 'wfh': return homeOutline;
      case 'outside': return locationOutline;
      default: return removeCircleOutline;
    }
  };

  return (
    <IonPage>
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <IonContent fullscreen className="whereabouts-content">
        {/* Top bar */}
        <div className="whereabouts-topbar">
          <div className="whereabouts-topbar-left">
            <IonIcon
              icon={menuOutline}
              className="topbar-icon"
              onClick={() => setMenuOpen(true)}
            />
            <h1 className="justification-title">Whereabouts</h1>
          </div>
          <div className="notification-wrapper">
            <IonIcon icon={notificationsOutline} className="topbar-icon" />
            <span className="badge">2</span>
          </div>
        </div>

        {/* Overview */}
        <div className="whereabouts-card overview-card">
          <span className="card-title">Overview</span>
          <div className="overview-row">
            {overview.map((o) => (
              <div className="overview-item" key={o.label}>
                <div className={`overview-icon-wrapper ${o.color}`}>
                  <IonIcon icon={o.icon} />
                </div>
                <div className="overview-text">
                  <span className={`overview-value ${o.color}`}>{o.value}</span>
                  <span className="overview-label">{o.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search + Filters */}
        {/* <div className="whereabouts-card filters-card">
          <div className="filters-row">
            <div className="search-field">
              <IonIcon icon={searchOutline} />
              <input
                type="text"
                placeholder="Search by name or designation"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="filter-select">
              <IonIcon icon={filterOutline} />
              <span>All Locations</span>
              <IonIcon icon={chevronDownOutline} className="chevron-icon" />
            </button>
            <button className="filter-select">
              <IonIcon icon={filterOutline} />
              <span>All Status</span>
            </button>
            <button className="refresh-btn">
              <IonIcon icon={refreshOutline} />
            </button>
          </div>
        </div> */}

        {/* Table */}
        <div className="whereabouts-card table-card">
          <div className="table-meta">
            <span>Last updated: Today, 9:30 AM</span>
            <span>Total: 31 employees</span>
          </div>

          <div className="table-scroll">
            <table className="whereabouts-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Designation</th>
                  <th>Location</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((e, i) => (
                  <tr key={i}>
                    <td>
                      <div className="employee-cell">
                        <div className="avatar">{getInitials(e.name)}</div>
                        <span className="employee-name">{e.name}</span>
                      </div>
                    </td>
                    <td className="designation-cell">{e.designation}</td>
                    <td>
                      <div className="location-cell">
                        <IonIcon icon={locationIcon(e.location)} className={`location-icon ${e.location}`} />
                        <span>{e.locationLabel}</span>
                      </div>
                    </td>
                    <td>{e.time}</td>
                    <td>
                      <span className={`status-pill ${e.location}`}>
                        <span className="status-dot" />
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* <button className="view-more-btn">
            View More
            <IonIcon icon={chevronDownCircleOutline} />
          </button> */}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Whereabouts;