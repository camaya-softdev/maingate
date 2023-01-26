import React,{ useEffect } from "react";
import PropTypes from 'prop-types';
import { Layout } from "antd";
import { useUpdateAtom } from "jotai/utils";
import {
  layoutAtom,
} from '../../atoms';
const Tablet = ({ children }) =>{
  const setLayout = useUpdateAtom(layoutAtom);


  useEffect(() => {
    setLayout('tablet');
  }, []);

  return(
    <Layout>
      <Layout.Header className="header">
        <div className="logo" />

      </Layout.Header>
      <Layout.Content style={{
        padding: 24,
        margin: 0,
        minHeight: 280,

      }}>
        {children}
      </Layout.Content>
    </Layout>
  );
};

Tablet.propTypes = {
  children: PropTypes.element,
};

export default Tablet;