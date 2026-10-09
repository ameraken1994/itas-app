import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Home from './pages/Home';
import Leave from './pages/Leave';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Whereabouts from './pages/Whereabouts';
import Justification from './pages/Justification';
import AuthCallback from './pages/AuthCallback';
import AppLaunch from './pages/AppLaunch';

setupIonicReact();

function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/">
            <AppLaunch />
          </Route>
          {/* <Route exact path="/login" component={Login} /> */}
          <Route exact path="/auth-callback" component={AuthCallback} />

          {/* Tabs live under a single parent route */}
          <Route path="/tabs">
            <IonTabs>
              <IonRouterOutlet>
                <Route exact path="/tabs/home" component={Home} />
                <Route exact path="/tabs/leave" component={Leave} />
                <Route exact path="/tabs/reports" component={Reports} />
                <Route exact path="/tabs/profile" component={Profile} />
                <Route exact path="/tabs/settings" component={Settings} />
                <Route exact path="/tabs/justification" component={Justification} />
                <Route exact path="/tabs/whereabouts" component={Whereabouts} />
                <Route exact path="/tabs">
                  <Redirect to="/tabs/home" />
                </Route>
              </IonRouterOutlet>

              {/*
              <IonTabBar slot="bottom">
                <IonTabButton tab="home" href="/tabs/home">
                  <IonIcon icon={homeOutline} />
                  <IonLabel>Home</IonLabel>
                </IonTabButton>
                <IonTabButton tab="leave" href="/tabs/leave">
                  <IonIcon icon={calendarOutline} />
                  <IonLabel>Leave</IonLabel>
                </IonTabButton>
                <IonTabButton tab="whereabouts" href="/tabs/whereabouts">
                  <IonIcon icon={locationOutline} />
                  <IonLabel>Whereabouts</IonLabel>
                </IonTabButton>
              </IonTabBar>
              */}
            </IonTabs>
              
          </Route>

          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;