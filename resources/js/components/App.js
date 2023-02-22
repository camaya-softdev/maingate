import React, { useEffect } from 'react';
import routes, { Public, Private } from './Routes';
import { BrowserRouter as Router, Switch } from "react-router-dom";
import useEchoPublicChannel from '../hooks/useEchoPublicChannel';
import useEchoPublicLogoutChannel from '../hooks/useEchoPublicLogoutChannel';
import useNotification from '../hooks/useNotification';
import Drawer from './Drawer';
import {
  getCheckKioskData,
  getKioskBarrierRedirectTimer
} from '../services/api';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import {
  kioskBarrierRedirectTimerAtom,
  userTokenAtom
} from '../atoms';
import useKeyboardEvents from '../hooks/useKeyboardEvents';
import useOnHoldCounter from '../hooks/useOnHoldCounter';


const App = () => {
  const userToken = useAtomValue(userTokenAtom);

  const setKioskBarrierRedirectTimer = useUpdateAtom(kioskBarrierRedirectTimerAtom);
  const checkKioskDataAPI = getCheckKioskData();
  const getKioskBarrierRedirectTimerAPI = getKioskBarrierRedirectTimer({
    sec: false,
    options: {
      onSuccess: (data) => setKioskBarrierRedirectTimer(data.data)
    }
  });


  useKeyboardEvents();
  useEchoPublicChannel({ channel: 'scan', event: 'ScanEvent' });
  useEchoPublicLogoutChannel({ channel: 'logout', event: 'LogoutEvent' });
  useNotification();
  useEffect(() => {
    window.addEventListener('load', () => {
      if (userToken) {
        checkKioskDataAPI.mutate();
        getKioskBarrierRedirectTimerAPI.mutate();
      }
    });
  }, []);
  useOnHoldCounter();

  return (
    <>
      <Drawer />
      <Router>
        <Switch>
          {routes.map((route, index) => route.public
            ? <Public
              key={index}
              path={route.path}
              component={route.component}
              layout={route.layout} />
            : <Private
              key={index}
              path={route.path}
              component={route.component}
              layout={route.layout} />
          )}
        </Switch>
      </Router>
    </>
  );
};

export default App;
