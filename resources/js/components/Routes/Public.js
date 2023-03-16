import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { useAtomValue } from 'jotai/utils';
import { userTokenAtom } from '../../atoms';
import Login from './Login';
import includes from "lodash/includes";

const Public = ({ component: Component, layout: Layout, path }) => {
  const userToken = useAtomValue(userTokenAtom);

  if (! userToken && ! includes(['/logout'], path)) {
    return <Login />;
  }

  return (
    <Route path={path}>
      <Layout>
        <Component />
      </Layout>
    </Route>
  );
};

Public.propTypes = {
  component: PropTypes.elementType,
  layout: PropTypes.elementType,
  path: PropTypes.string,
};

export default Public;
