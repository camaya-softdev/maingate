import { EditOutlined } from '@ant-design/icons';
import { Button, Space, Table, Tag } from 'antd';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import indexOf from 'lodash/indexOf';
import map from 'lodash/map';
import remove from 'lodash/remove';
import React, { useEffect, useState } from 'react';
import {
  bookingDetailsAtom,
  guestAdditionalGuestValueAtom,
  scanDataAtom,
} from '../../../../../atoms';
import date from '../../../../../services/date';
import name from '../../../../../services/name';
import useDrawerVehicles from '../useDrawer/vehicles';
import useDrawerPax from '../useDrawer/pax';

const Details = () => {
  const scanData = useAtomValue(scanDataAtom);
  const setBookingDetailsAtom = useUpdateAtom(bookingDetailsAtom);
  const guestAdditionalGuests = useAtomValue(guestAdditionalGuestValueAtom);
  // const [unchangeableRowKeys, setUnchangeableRowKeys] = useState([2, 3, 7]);
  const unchangeableRowKeys = [2, 3, 7];
  const [selectedRowKeys, setSelectedRowKeys] = useState(unchangeableRowKeys);
  const [setIdVehicles, setDataVehicles, setDrawerVehicles] = useDrawerVehicles();
  const [setIdPax, setDataPax, setDrawerPax] = useDrawerPax();

  const rowSelection = {
    getCheckboxProps: (record) => ({
      disabled:
        indexOf(unchangeableRowKeys, record.id) > -1 ||
        record.id === 6 && guestAdditionalGuests.length,
    }),
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
      setBookingDetailsAtom(selectedRowKeys);
    },
    selectedRowKeys,
  };

  const tableColumns = [
    {
      title: 'Label',
      dataIndex: 'label',
    },
    {
      title: 'Details',
      dataIndex: 'item',
    },
  ];

  const editVehicles = () => {
    setIdVehicles(scanData.tap_id);
    setDataVehicles(scanData);
    setDrawerVehicles(true);
  };

  const editGuests = () => {
    setIdPax(scanData.tap_id);
    setDataPax(scanData);
    setDrawerPax(true);
  };

  const data = [
    {
      id: 1,
      label: 'Name',
      item: name(scanData.booking.customer[0]),
    },
    {
      id: 2,
      label: 'Booking Reference Number',
      item: scanData.booking.reference_number,
    },
    {
      id: 3,
      label: 'Balance',
      item: scanData.balance || 0,
    },
    {
      id: 4,
      label: 'Date of Visit',
      item: `${date(scanData.booking.start_datetime)} - ${date(scanData.booking.end_datetime)}`
    },
    {
      id: 5,
      label: 'Vehicle Details',
      item: <Space>
        {scanData.booking.guest_vehicles.map((vehicle) =>
          <div key={vehicle.id}>
            <Tag key={vehicle.id}>
              {`${vehicle.model} ${vehicle.plate_number}`}
            </Tag>
          </div>)}
        <Button size="small" type="link" onClick={editVehicles}>
          <EditOutlined />
        </Button>
      </Space>,
    },
    {
      id: 6,
      label: 'Pax',
      item: <Space>
        {scanData.booking.adult_pax + scanData.booking.kid_pax + scanData.booking.infant_pax}
        <Button size="small" type="link" onClick={editGuests}>
          <EditOutlined />
        </Button>
      </Space>
    },
    {
      id: 7,
      label: 'Tags',
      item: map(scanData.booking.tags, 'name').join(', '),
    },
  ];

  useEffect(() => {
    setBookingDetailsAtom(selectedRowKeys);
  }, []);

  useEffect(() => {
    if (guestAdditionalGuests.length) {
      const selectedRowKeysUpdate = remove(selectedRowKeys, (key) => key !== 6);
      setSelectedRowKeys(selectedRowKeysUpdate);
    }
  }, [guestAdditionalGuests]);

  return (
    <>
      <Table
        bordered
        columns={tableColumns}
        dataSource={data}
        pagination={false}
        rowKey="id"
        rowSelection={rowSelection}
        scroll={{ x: 'max-content' }} />
    </>
  );
};

export default Details;
