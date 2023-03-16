import React, { useEffect } from 'react';
import { Button, Divider, Form, Input, Space } from 'antd';
import {
  getKioskBarrierRedirectTimer,
  getLogout,
  kioskDefaultPage,
  kioskReloadPage,
  putKioskBarrierRedirectTimer,
  syncTable,syncHoaTables } from "../../../../services/api";
import { useUpdateAtom } from 'jotai/utils';
import { kioskBarrierRedirectTimerAtom, userTokenAtom } from '../../../../atoms';
import Table from './CustomChecklist/Table';

const Dashboard = () => {
  const [form] = Form.useForm();
  const syncTableAPI = syncTable();
  const syncHoaTablesAPI = syncHoaTables();
  const kioskDefaultPageAPI = kioskDefaultPage();
  const kioskReloadPageAPI = kioskReloadPage();
  const getLogoutAPI = getLogout();
  const setKioskBarrierRedirectTimer = useUpdateAtom(kioskBarrierRedirectTimerAtom);
  const getKioskBarrierRedirectTimerAPI = getKioskBarrierRedirectTimer({
    options: {
      onSuccess: (data) => {
        form.setFieldsValue({ timer: data?.data || 0 });
      }
    }
  });
  const putKioskBarrierRedirectTimerAPI = putKioskBarrierRedirectTimer({
    options: {
      onSuccess: () => {
        getKioskBarrierRedirectTimerAPI.mutate();
      }
    }
  });
  const setUserToken = useUpdateAtom(userTokenAtom);

  const onFinish = (values) => {
    putKioskBarrierRedirectTimerAPI.mutate(values);
  };

  useEffect(() => {
    if (getLogoutAPI.isSuccess) {
      setUserToken(null);
    }
  }, [getLogoutAPI.isSuccess]);

  useEffect(() => {
    getKioskBarrierRedirectTimerAPI.mutate();
  }, []);

  useEffect(() => {
    if (getKioskBarrierRedirectTimerAPI?.data) {
      setKioskBarrierRedirectTimer(getKioskBarrierRedirectTimerAPI.data.data * 1000);
    }
  }, [getKioskBarrierRedirectTimerAPI.isSuccess]);

  return (
    <div className="flex justify-center h-auto min-h-full w-full p-5">
      <div className="bg-white w-full">
        <Divider orientation="left">
              Database
        </Divider>
        <div className="xl:px-16 lg:px-12 md:px-10 sm:px-8 p-5">
          <Button
            loading={syncTableAPI.isLoading}
            size="large"
            onClick={() => syncTableAPI.mutate()}
          >
            {syncTableAPI.isLoading ? 'CWS Syncing Table' : 'CWS Sync Table'}
          </Button>
        </div>

        <div className="xl:px-16 lg:px-12 md:px-10 sm:px-8 p-5">
          <Button
            loading={syncHoaTablesAPI.isLoading}
            size="large"
            onClick={() => syncHoaTablesAPI.mutate()}
          >
            {syncTableAPI.isLoading ? 'HOA Syncing Table' : 'HOA Sync Table'}
          </Button>
        </div>

        <Divider orientation="left">
            Kiosk
        </Divider>
        <div className="xl:px-16 lg:px-12 md:px-10 sm:px-8 p-5">
          <Space>
            <Button
              loading={kioskDefaultPageAPI.isLoading}
              size="large"
              onClick={() => kioskDefaultPageAPI.mutate()}
            >
              {kioskDefaultPageAPI.isLoading ? 'Reseting' : 'Reset'}
            </Button>
            <Button
              loading={kioskReloadPageAPI.isLoading}
              size="large"
              onClick={() => kioskReloadPageAPI.mutate()}
            >
              {kioskReloadPageAPI.isLoading ? 'Reloading' : 'Reload'}
            </Button>
          </Space>
        </div>

        <Divider orientation="left">
            User
        </Divider>
        <div className="xl:px-16 lg:px-12 md:px-10 sm:px-8 p-5">
          <Button
            loading={getLogoutAPI.isLoading}
            size="large"
            onClick={() => getLogoutAPI.mutate()}
          >
            Logout
          </Button>
        </div>

        <Divider orientation="left">
          Custom Checklist
        </Divider>
        <div className="xl:px-16 lg:px-12 md:px-10 sm:px-8 p-5">
          <Table />
        </div>

        <Divider orientation="left">
          Settings
        </Divider>
        <div className="xl:px-16 lg:px-12 md:px-10 sm:px-8 p-5">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              label="Kiosk Barrier Redirection Timer (in seconds)"
              name="timer"
              rules={[{ required: true, message: 'Please enter Kiosk Barrier Redirection Timer' }]}
            >
              <Input type="number" min="1" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
