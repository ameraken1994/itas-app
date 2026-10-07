import { useEffect } from 'react';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { personCircleOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { App as CapacitorApp } from '@capacitor/app';
import { Storage } from '@ionic/storage';
import { useHistory } from 'react-router-dom';
import appLogo from '../assets/logo.png';
import loginIllustration from '../assets/mesiniaga-home.jpg';
import './Login.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apiKey = '86556c5a3e15475962aa181be0c9bc18';

const store = new Storage();

const Login: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    store.create();

    if (Capacitor.isNativePlatform()) {
      const listenerPromise = CapacitorApp.addListener('appUrlOpen', async (event) => {
        const url = event.url;
        if (url.includes('auth-callback')) {
          const params = new URL(url).searchParams;
          const token = params.get('t');
          if (token) {
            await store.set('access_token', token);
            await Browser.close();
            history.push('/tabs/home');
          }
        }
      });

      return () => {
        listenerPromise.then((listener) => listener.remove());
      };
    }
  }, [history]);

  const handleMicrosoftSignIn = async () => {
    if (Capacitor.isNativePlatform()) {
      // Real mobile app (Android/iOS build)
      const loginUrl = `${API_BASE_URL}/microsoft?apikey=${apiKey}&platform=mobile`;
      await Browser.open({ url: loginUrl });
    } else {
      // Browser testing (npm run dev)
      const loginUrl = `${API_BASE_URL}/microsoft?apikey=${apiKey}&platform=mobile-web-test`;
      window.location.href = loginUrl;
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-content">
        <div className="login-container">
          <div className="app-icon-wrapper">
            <div className="app-icon">
              <img src={appLogo} alt="App logo" className="app-icon-img" />
            </div>
          </div>

          <div className="illustration-wrapper">
            <img
              src={loginIllustration}
              alt="Mesiniaga building"
              className="illustration-img"
            />
          </div>

          <div className="login-text">
            <p className="welcome-text">Welcome to</p>
            <h1 className="app-title">
              Integrated Time<br />Attendance System (ITAS)
            </h1>
            <p className="subtitle">
              Smart attendance tracking for a productive and connected workplace.
            </p>
          </div>

          <button className="microsoft-btn" onClick={handleMicrosoftSignIn}>
            <svg width="20" height="20" viewBox="0 0 20 20">
              <rect x="1" y="1" width="8.5" height="8.5" fill="#F25022" />
              <rect x="10.5" y="1" width="8.5" height="8.5" fill="#7FBA00" />
              <rect x="1" y="10.5" width="8.5" height="8.5" fill="#00A4EF" />
              <rect x="10.5" y="10.5" width="8.5" height="8.5" fill="#FFB900" />
            </svg>
            <span>Sign in With Microsoft</span>
          </button>

          <div className="divider">
            <span className="line" />
            <span className="divider-text">OR</span>
            <span className="line" />
          </div>

          <button className="help-link">
            <IonIcon icon={personCircleOutline} />
            <span>Need help signing in?</span>
          </button>

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