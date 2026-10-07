import { useEffect } from 'react';
import { IonContent, IonPage, IonSpinner } from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import { Storage } from '@ionic/storage';

const store = new Storage();

const AuthCallback: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const run = async () => {
      await store.create();
      const params = new URLSearchParams(location.search);
      const token = params.get('t');

      if (token) {
        await store.set('access_token', token);
        history.replace('/tabs/home');
      } else {
        history.replace('/login');
      }
    };
    run();
  }, [location, history]);

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding ion-text-center">
        <div style={{ marginTop: '40vh' }}>
          <IonSpinner name="crescent" />
          <p>Signing you in...</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AuthCallback;