import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Layout, Menu } from "antd";
import { useUpdateAtom } from "jotai/utils";
import { layoutAtom } from "../../atoms";

const Tablet = ({ children }) => {
  const setLayout = useUpdateAtom(layoutAtom);

  useEffect(() => {
    setLayout("tablet");
  }, []);

  return (
    <Layout>
      <Layout.Header className="bg-white">
        <div className="logo" />
        <Menu
          mode="horizontal"
          defaultSelectedKeys={[location.pathname]}

        >
          <Menu.Item key="/scanner">
            <Link to="scanner">Scanner</Link>
          </Menu.Item>
          <Menu.Item key="/scanner-manual-input">
            <Link to="scanner-manual-input">Manual Input</Link>
          </Menu.Item>
        </Menu>
      </Layout.Header>
      <Layout.Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280
        }}
      >
        {children}
      </Layout.Content>
    </Layout>
  );
};

Tablet.propTypes = {
  children: PropTypes.element
};

export default Tablet;
