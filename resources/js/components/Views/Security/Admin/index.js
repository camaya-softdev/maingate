import React from 'react';
import Dashboard from "./Dashboard";
import Login from "./Login";
import { useAtomValue } from 'jotai/utils';
import { userTokenAtom } from '../../../../atoms';

const Index = () => {
  const userToken = useAtomValue(userTokenAtom);

  if (! userToken) {
    return <Login />;
  }

  return <Dashboard />;
};

export default Index;
