import React, { useEffect } from "react";
import PropTypes from 'prop-types';
import { Layout, Menu } from "antd";
import { layoutAtom } from '../../atoms';
import { useAtom } from "jotai";
import { Link } from "react-router-dom";

const Admin = ({ children }) => {
  const [, setLayout] = useAtom(layoutAtom);

  useEffect(() => {
    setLayout('admin');
  });

  return (
    <Layout>
      <Layout.Sider theme="light" className="h-screen overflow-auto">
        <div className="text-center">
          <img
            src={`${process.env.APP_URL}/images/camaya-logo.png`}
            alt="logo"
            className="w-full p-2" />
          <Menu
            mode="inline"
            defaultSelectedKeys={['2']}
            style={{ height: '100%' }}
          >
            <Menu.Item key="1">
              <Link to="security">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="admin">Admin</Link>
            </Menu.Item>
          </Menu>
        </div>
      </Layout.Sider>
      <Layout>
        <Layout.Content className="h-screen overflow-auto">
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

Admin.propTypes = {
  children: PropTypes.element,
};

export default Admin;
