import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

const Reports: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Reports</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <h2>Reports Page</h2>
      </IonContent>
    </IonPage>
  );
};

export default Reports;