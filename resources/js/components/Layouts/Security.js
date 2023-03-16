import React, { useEffect } from "react";
import PropTypes from 'prop-types';
import { Badge, Button, Layout, Menu } from "antd";
import { Link, useLocation } from 'react-router-dom';
import {
  barrierAtom,
  layoutAtom,
  onHoldCounterAtom,
  scanDataAtom,
  userTokenAtom,
} from '../../atoms';
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { CheckOutlined, StopOutlined, SyncOutlined } from '@ant-design/icons';
import isEmpty from 'lodash/isEmpty';
import { getLogout } from "../../services/api";

const Security = ({ children }) => {
  const setLayout = useUpdateAtom(layoutAtom);
  const scanData = useAtomValue(scanDataAtom);
  const barrier = useAtomValue(barrierAtom);
  const onHoldCounter = useAtomValue(onHoldCounterAtom);
  const location = useLocation();
  const getLogoutAPI = getLogout();
  const setUserToken = useUpdateAtom(userTokenAtom);

  useEffect(() => {
    setLayout('security');
  }, []);

  useEffect(() => {
    if (getLogoutAPI.isSuccess) {
      setUserToken(null);
    }
  }, [getLogoutAPI.isSuccess]);

  return (
    <Layout>
      <Layout.Sider theme="light" className="h-screen overflow-auto">
        <div className="min-h-full pb-3">
          <div className="text-center">
            <img
              src={`${process.env.APP_URL}/images/camaya-logo.png`}
              alt="logo"
              className="w-full p-2" />
          </div>
          <Menu
            mode="inline"
            defaultSelectedKeys={[location.pathname]}
            className="h-full flex-grow"
          >
            <Menu.Item key="/concierge">
              <Link to="concierge">Dashboard</Link>
            </Menu.Item>
            <Menu.Item key="/guest">
              <Link to="guest">Guest</Link>
              {isEmpty(scanData) && !barrier
                && <SyncOutlined spin className="float-right mt-3" style={{ marginRight: 0 }} />}
              {!isEmpty(scanData) && scanData.status === 'OK'
                && <span className="float-right mt-3 py-0.5 rounded text-green-500 text-xs ">
                  <CheckOutlined style={{ marginRight: 0 }} />
                </span> }
              {!isEmpty(scanData) && scanData.status !== 'OK'
                && <span className="float-right mt-3 py-0.5 rounded text-red-500 text-xs ">
                  <StopOutlined style={{ marginRight: 0 }} />
                </span> }
            </Menu.Item>

            <Menu.Item key="/on-hold">
              <Link to="on-hold">
                On-hold
                <span className="float-right mt-2 py-0.5 rounded text-green-500 text-xs ">
                  <Badge count={onHoldCounter} />
                </span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/transactions">
              <Link to="transactions">Transactions</Link>
            </Menu.Item>
            <Menu.Item key="/transactions-hoa">
              <Link to="/transactions-hoa">HOA Transactions</Link>
            </Menu.Item>
            <Menu.Item key="/taps">
              <Link to="taps">Tap History</Link>
            </Menu.Item>
            <Menu.Item key="/admin">
              <Link to="admin">Admin</Link>
            </Menu.Item>
            <Menu.Item key="/logout">
              <Button
                className="p-0 text-gray-800"
                onClick={() => getLogoutAPI.mutate()}
                type="link"
              >
                Logout
              </Button>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="/system-version" disabled>
              System Version:v2
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

Security.propTypes = {
  children: PropTypes.element,
};

export default Security;
