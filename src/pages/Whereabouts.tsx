import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonPage, IonIcon, IonSpinner } from '@ionic/react';
import Sidebar from '../components/Sidebar';
import {
  businessOutline,
  homeOutline,
  locationOutline,
  peopleOutline,
} from 'ionicons/icons';
import { viewWhereabout } from '../utils/apiHelper';
import './Whereabouts.css';
import TopBar from '../components/TopBar';

interface LocationEntry {
  location: string;
  time: string;
}

interface RawEmployee {
  userid: string;
  employee_name: string;
  date: string;
  locations: LocationEntry[];
}

interface DepartmentGroup {
  department: string;
  data: RawEmployee[];
}

interface FlatEmployee {
  userid: string;
  name: string;
  department: string;
  latestLocation: string;
  latestTime: string;
  isWfh: boolean;
}

const formatTime12h = (time: string) => {
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${suffix}`;
};

const todayISO = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Whereabouts: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useHistory();

  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<FlatEmployee[]>([]);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    loadWhereabouts();
  }, []);

  const loadWhereabouts = async () => {
    setLoading(true);
    const result = await viewWhereabout(navigate, todayISO());

    if (result?.type === 'success' && Array.isArray(result.data)) {
      const flat: FlatEmployee[] = [];

      (result.data as DepartmentGroup[]).forEach((group) => {
        group.data.forEach((emp) => {
          const latest = emp.locations?.[0]; // most recent, per API's descending order
          if (!latest) return;

          flat.push({
            userid: emp.userid,
            name: emp.employee_name,
            department: group.department,
            latestLocation: latest.location.trim(),
            latestTime: latest.time,
            isWfh: latest.location.trim().toLowerCase() === 'home',
          });
        });
      });

      // Sort by most recent activity first
      flat.sort((a, b) => b.latestTime.localeCompare(a.latestTime));

      setEmployees(flat);
      setLastUpdated(
        new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      );
    } else {
      setEmployees([]);
    }

    setLoading(false);
  };

  const getInitials = (name: string) =>
    name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();

  const wfhCount = employees.filter((e) => e.isWfh).length;
  const onSiteCount = employees.length - wfhCount;

  const overview = [
    { icon: peopleOutline, value: employees.length, label: 'Checked In Today', color: 'blue' },
    { icon: businessOutline, value: onSiteCount, label: 'On Site', color: 'green' },
    { icon: homeOutline, value: wfhCount, label: 'WFH', color: 'orange' },
  ];

  return (
    <IonPage>
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <IonContent fullscreen className="whereabouts-content">
        {/* Top bar */}
        <TopBar title="Whereabouts" onMenuClick={() => setMenuOpen(true)} />

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

        {/* Table */}
        <div className="whereabouts-card table-card">
          <div className="table-meta">
            <span>Last updated: Today, {lastUpdated}</span>
            <span>Total: {employees.length} employees</span>
          </div>

          {loading ? (
            <div className="loading-wrapper">
              <IonSpinner name="crescent" />
            </div>
          ) : employees.length === 0 ? (
            <p className="empty-state">No whereabouts data for today yet.</p>
          ) : (
            <div className="table-scroll">
              <table className="whereabouts-table">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Department</th>
                    <th>Location</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((e) => (
                    <tr key={e.userid}>
                      <td>
                        <div className="employee-cell">
                          <div className="avatar">{getInitials(e.name)}</div>
                          <span className="employee-name">{e.name}</span>
                        </div>
                      </td>
                      <td className="designation-cell">{e.department}</td>
                      <td>
                        <div className="location-cell">
                          <IonIcon
                            icon={e.isWfh ? homeOutline : locationOutline}
                            className={`location-icon ${e.isWfh ? 'wfh' : 'office'}`}
                          />
                          <span>{e.isWfh ? 'Home' : e.latestLocation}</span>
                        </div>
                      </td>
                      <td>{formatTime12h(e.latestTime)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Whereabouts;