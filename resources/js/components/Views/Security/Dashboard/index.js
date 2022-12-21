import React, { useEffect, useState } from "react";
// import { DatePickerProps } from 'antd';
import { Divider, Typography, DatePicker } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import GuestsTable from "./GuestsTable";
import { getGuests, getSecurityDashboard } from "../../../../services/api";
import SummaryStatistics from "./SummaryStatistics";
import date from "../../../../services/date";
import dayjs from "dayjs";

const Index = () => {


  const [selectDateString, setSelectDateString] = useState(dayjs());
  const currentDateTime = () => dayjs().format("LL LTS");
  const [dateTime, setDateTime] = useState(currentDateTime());
  const getSecurityDashboardAPI = getSecurityDashboard({ date:selectDateString });
  const todaysGuests = getGuests({ date:selectDateString });

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(currentDateTime());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (selectDateString) {
      getSecurityDashboardAPI.refetch();
      todaysGuests.refetch();
    }
    return () => {};
  }, [selectDateString]);

  return (
    <div className="flex justify-center h-auto min-h-full w-full p-5">
      <div className="bg-white w-full">
        <Divider orientation="left">Guest Arrivals</Divider>
        <div className="xl:px-16 lg:px-12 md:px-10 sm:px-8">
          <Typography.Title level={4} type="secondary">
            {dateTime}
          </Typography.Title>
          Jump Date To:&nbsp;
          <DatePicker
            defaultValue={dayjs()}
            allowClear={false}
            value={selectDateString}
            onChange={e => setSelectDateString(e)}
            className="rounded-full"
          />
          {
            getSecurityDashboardAPI.isFetching &&
            <><LoadingOutlined className="ml-2" /> Loading data. Please wait...</>
          }
        </div>
        {getSecurityDashboardAPI.isFetching || getSecurityDashboardAPI.isLoading ?
          <div className="text-center"><LoadingOutlined className="ml-2" /> Loading....</div>
          :
          <SummaryStatistics data={getSecurityDashboardAPI.data?.data} />
        }

        <Divider orientation="left">Guest Lists</Divider>
        <GuestsTable query={todaysGuests} />

        <Divider orientation="left">Data Sync</Divider>
        <div className="xl:px-16 lg:px-12 md:px-10 sm:px-8 p-5">
          <Typography.Paragraph type="secondary">
            Last data sync at{" "}
            {getSecurityDashboardAPI.data?.data.data.last_sync_date &&
              date(
                getSecurityDashboardAPI.data?.data.data.last_sync_date,
                "MMM D, YYYY hh:mma"
              )}
          </Typography.Paragraph>
        </div>
      </div>
    </div>
  );
};

export default Index;
