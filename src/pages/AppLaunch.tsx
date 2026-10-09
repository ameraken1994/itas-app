import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonPage, IonSpinner } from '@ionic/react';
import { Storage } from '@ionic/storage';
import { checkToken } from '../utils/apiHelper';

const store = new Storage();

const AppLaunch: React.FC = () => {
  const history = useHistory();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const run = async () => {
      await store.create();
      const token = await store.get('access_token');

      if (!token) {
        history.replace('/login');
        return;
      }

      const isValid = await checkToken();

      if (isValid) {
        history.replace('/tabs/home');
      } else {
        await store.remove('access_token');
        history.replace('/login');
      }

      setChecking(false);
    };

    run();
  }, [history]);

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding ion-text-center">
        <div style={{ marginTop: '40vh' }}>
          <IonSpinner name="crescent" />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AppLaunch;