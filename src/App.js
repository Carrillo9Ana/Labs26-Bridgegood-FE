import React, { useState, useEffect, useMemo } from 'react';
import { Route, useHistory, Switch } from 'react-router-dom';

import {
  Security,
  SecureRoute,
  LoginCallback,
  useOktaAuth,
} from '@okta/okta-react';

import {
  HomePage,
  LoginPage,
  NotFoundPage,
  DonatePage,
  MakeResPage,
  WelcomeBoard,
  AdminPage,
} from './components/pages';

import HomeContainer from './components/common/HomeContainer';
import AdminLayout from './components/pages/AdminLayout';
// import Dispatch from './components/pages/Dispatch';

export default function App() {
  // User info from Okta
  const { authState, authService } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  // eslint-disable-next-line
  const [memoAuthService] = useMemo(() => [authService], []);

  useEffect(() => {
    let isSubscribed = true;
    memoAuthService
      .getUser()
      .then(info => {
        // if user is authenticated we can use the authService to snag some user info.
        // isSubscribed is a boolean toggle that we're using to clean up our useEffect.
        if (isSubscribed) {
          setUserInfo(info);
        }
      })
      .catch(err => {
        isSubscribed = false;
        return setUserInfo(null);
      });
    return () => (isSubscribed = false);
  }, [memoAuthService]);

  return (
    <Switch>
      <Route
        path="/login"
        component={() => <HomeContainer PageContent={LoginPage} />}
      />

      {/* <Route path="/login" component={LoginPage} /> */}
      <Route path="/implicit/callback" component={LoginCallback} />
      <Route
        path="/"
        exact
        component={() => <HomeContainer PageContent={HomePage} />}
      />
      <SecureRoute
        path="/make-res"
        component={() => <HomeContainer PageContent={MakeResPage} />}
      />
      <Route
        path="/welcome"
        component={() => <HomeContainer PageContent={WelcomeBoard} />}
      />
      <Route
        path="/donate"
        component={() => <HomeContainer PageContent={DonatePage} />}
      />
      <SecureRoute path="/admin">
        <AdminLayout userInfo={userInfo} PageContent={AdminPage}>
          {/* <AdminPage user={userInfo}
              isLoggedIn={authState.isAuthenticated}
              userInfo={userInfo}
              authService={authService}
              /> */}
        </AdminLayout>
      </SecureRoute>

      <Route component={() => <HomeContainer PageContent={NotFoundPage} />} />
    </Switch>
  );
}
