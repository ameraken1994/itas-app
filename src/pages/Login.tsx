import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { personCircleOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import appLogo from '../assets/logo.png';
import loginIllustration from '../assets/mesiniaga-home.jpg';
import './Login.css';

const Login: React.FC = () => {
  const handleMicrosoftSignIn = () => {
    // TODO: wire up MSAL / OAuth redirect flow here
    console.log('Sign in with Microsoft clicked');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-content">
        <div className="login-container">
          {/* App icon */}
          <div className="app-icon-wrapper">
            <div className="app-icon">
              <img src={appLogo} alt="App logo" className="app-icon-img" />
            </div>
          </div>

          {/* Illustration */}
          <div className="illustration-wrapper">
            <img
              src={loginIllustration}
              alt="Mesiniaga building"
              className="illustration-img"
            />
          </div>

          {/* Text block */}
          <div className="login-text">
            <p className="welcome-text">Welcome to</p>
            <h1 className="app-title">
              Integrated Time<br />Attendance System (ITAS)
            </h1>
            <p className="subtitle">
              Smart attendance tracking for a productive and connected workplace.
            </p>
          </div>

          {/* Microsoft sign-in button */}
          <button className="microsoft-btn" onClick={handleMicrosoftSignIn}>
            <svg width="20" height="20" viewBox="0 0 20 20">
              <rect x="1" y="1" width="8.5" height="8.5" fill="#F25022" />
              <rect x="10.5" y="1" width="8.5" height="8.5" fill="#7FBA00" />
              <rect x="1" y="10.5" width="8.5" height="8.5" fill="#00A4EF" />
              <rect x="10.5" y="10.5" width="8.5" height="8.5" fill="#FFB900" />
            </svg>
            <span>Sign in With Microsoft</span>
          </button>

          {/* Divider */}
          <div className="divider">
            <span className="line" />
            <span className="divider-text">OR</span>
            <span className="line" />
          </div>

          {/* Help link */}
          <button className="help-link">
            <IonIcon icon={personCircleOutline} />
            <span>Need help signing in?</span>
          </button>

          {/* Footer */}
          <div className="footer-note">
            <IonIcon icon={shieldCheckmarkOutline} />
            <span>Secure sign-in powered by Microsoft</span>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;