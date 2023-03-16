import React, { useEffect } from 'react';
import { Button, Divider, Space } from 'antd';
// eslint-disable-next-line max-len
import { getLogout, kioskDefaultPage, kioskReloadPage, syncTable, syncHoaTable } from "../../../../services/api";
import { useUpdateAtom } from 'jotai/utils';
import { userTokenAtom } from '../../../../atoms';

const Dashboard = () => {
  const syncTableAPI = syncTable();
  const syncHoaTableAPI = syncHoaTable();
  const kioskDefaultPageAPI = kioskDefaultPage();
  const kioskReloadPageAPI = kioskReloadPage();
  const getLogoutAPI = getLogout();
  const setUserToken = useUpdateAtom(userTokenAtom);

  useEffect(() => {
    if (getLogoutAPI.isSuccess) {
      setUserToken(null);
    }
  }, [getLogoutAPI.isSuccess]);

  return (
    <div className="flex justify-center h-auto min-h-full w-full p-5">
      <div className="bg-white w-full">
        <Divider orientation="left">
              Database
        </Divider>
        <div className="xl:px-16 lg:px-12 md:px-10 sm:px-8 p-5">
          <Space>
            <Button
              loading={syncTableAPI.isLoading}
              size="large"
              onClick={() => syncTableAPI.mutate()}
            >
              {syncTableAPI.isLoading ? 'Syncing Table' : 'Sync Table'}
            </Button>

            <Button
              loading={syncHoaTableAPI.isLoading}
              size="large"
              onClick={() => syncHoaTableAPI.mutate()}
            >
              {syncHoaTableAPI.isLoading ? 'Syncing HOA Table' : 'Sync HOA Table'}
            </Button>
          </Space>

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
      </div>
    </div>
  );
};

export default Dashboard;
