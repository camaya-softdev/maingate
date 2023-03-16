import { Button, Space, Table } from 'antd';
import isEmpty from 'lodash/isEmpty';
import startCase from 'lodash/startCase';
import React from 'react';
import { getCustomChecklists, getSecurityChecks } from '../../../../../services/api';
import date from '../../../../../services/date';
import name from '../../../../../services/name';
import useDrawer from '../useDrawer';
import useAssignDrawer from '../useDrawer/assign';

const OnHold = () => {
  const customChecklistsAPI = getCustomChecklists();
  const securityChecksAPI = getSecurityChecks();
  const [setId, setData, setDrawer] = useDrawer();
  const [setAssignId, setAssignData, setAssignDrawer] = useAssignDrawer();

  const columns = [
    {
      title: 'Transaction Number',
      dataIndex: 'transaction',
      render: function render(transaction) {
        return transaction?.id || '';
      }
    },
    {
      title: 'Booking Reference Number',
      dataIndex: 'booking_reference_number',
    },
    {
      title: 'Guest Reference Number',
      dataIndex: 'reference_number',
    },
    {
      title: 'Customer',
      dataIndex: 'booking',
      render: function render(booking) {
        return isEmpty(booking) ? '' : name(booking.customer[0]);
      }
    },
    {
      title: 'Date',
      dataIndex: 'booking',
      render: function render(booking) {
        return isEmpty(booking)
          ? ''
          : `${date(booking.start_datetime)} - ${date(booking.end_datetime)}`;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: function render(text) {
        return startCase(text);
      }
    },
    {
      title: <div className="text-center">Action</div>,
      dataIndex: 'id',
      render: function render(id, record) {
        return <div className="text-center">
          {record.status === 'valid'
            ? <Button type="link" style={{ padding: 0 }} onClick={() => {
              setId(id);
              setData(record);
              setDrawer(true);
            }}>
              Validate
            </Button>
            : <Button type="link" style={{ padding: 0 }} onClick={() => {
              setAssignId(id);
              setAssignData(record);
              setAssignDrawer(true);
            }}>
              Validate
            </Button> }
        </div>;
      }
    },
  ];

  return (
    <>
      <Table
        bordered
        columns={columns}
        dataSource={securityChecksAPI.data?.data}
        loading={securityChecksAPI.isLoading || customChecklistsAPI.isLoading}
        pagination={false}
        rowKey="id"
        scroll={{ x: 'max-content' }} />
    </>
  );
};

export default OnHold;
