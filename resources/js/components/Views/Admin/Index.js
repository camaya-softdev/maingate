import React from 'react';
import Dashboard from "./Components/Dashboard";
import Login from "./Components/Login";
import { useAtomValue } from 'jotai/utils';
import { userTokenAtom } from '../../../atoms';

const Index = () => {
  const userToken = useAtomValue(userTokenAtom);

  if (! userToken) {
    return <Login />;
  }

  return <Dashboard />;
};

export default Index;
