import { EditOutlined } from '@ant-design/icons';
import { Button, Select, Table } from 'antd';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import filter from 'lodash/filter';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import React, { useEffect, useState } from 'react';
import {
  guestAdditionalVehiclesValueAtom,
  guestAssignedVehiclesValueAtom,
  guestListAtom,
  guestListDefaultValueAtom,
  guestVehiclesValueAtom,
  scanDataMobileAtom
} from '../../../../atoms';
import useDrawerGuests from '../useDrawer/guests';

const Guests = () => {
  const scanData = useAtomValue(scanDataMobileAtom);
  const setGuestListAtom = useUpdateAtom(guestListAtom);
  const setGuestListDefaultValueAtom = useUpdateAtom(guestListDefaultValueAtom);
  const setGuestAssignedVehiclesAtom = useUpdateAtom(guestAssignedVehiclesValueAtom);
  const guestVehicles = useAtomValue(guestVehiclesValueAtom);
  const guestAdditionalVehicles = useAtomValue(guestAdditionalVehiclesValueAtom);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [setIdGuests, setDataGuests, setDrawerGuests] = useDrawerGuests();

  const rowSelection = {
    getCheckboxProps: (record) => ({
      disabled: record.status === 'on_premise' || record.status === 'checked_in',
    }),
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
      setGuestListAtom(selectedRowKeys);
    },
    selectedRowKeys,
  };

  let alternateVehicleCounter = 0;

  const tableColumns = [
    {
      title: 'Reference Number',
      dataIndex: 'reference_number',
    },
    {
      title: 'First Name',
      dataIndex: 'first_name',
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Assigned Vehicle',
      dataIndex: 'id',
      render: function render(id) {
        let counter = -1;

        if (! scanData.booking.guest_vehicles?.length && ! guestAdditionalVehicles.length) return;

        if (!scanData.booking.guest_vehicles[alternateVehicleCounter]) {
          alternateVehicleCounter = 0;
        }

        let defaultValue = scanData.booking.guest_vehicles?.length
          ? scanData.booking.guest_vehicles[alternateVehicleCounter].id
          : guestAdditionalVehicles?.length
            ? 'additional-0'
            : '';

        if (scanData.booking.guest_vehicles[alternateVehicleCounter]) {
          alternateVehicleCounter++;
        }

        if (scanData.previous_security_check_data?.guest_vehicles[id]) {
          defaultValue = scanData.previous_security_check_data?.guest_vehicles[id];
        }

        return <Select
          defaultValue={defaultValue}
          getPopupContainer={triggerNode => triggerNode.parentElement}
          onChange={(value) => {
            setGuestAssignedVehiclesAtom({
              path: id,
              value
            });
          }}
          size="small">
          {
            isEmpty(guestVehicles) && scanData.booking.guest_vehicles.map((vehicle, index) => {
              if (/^additional-/.test(vehicle.id)) {
                const vId = Number(vehicle.id.replace('additional-', ''));
                counter = vId;
              }

              return <Select.Option key={index} value={vehicle.id}>
                {`${vehicle.model} ${vehicle.plate_number}`}
              </Select.Option>;
            })
          }
          {
            !isEmpty(guestVehicles) && scanData.booking.guest_vehicles.map((vehicle, index) => {
              if (/^additional-/.test(vehicle.id)) {
                const vId = Number(vehicle.id.replace('additional-', ''));
                counter = vId;
              }

              const vehicleUpdated = find(guestVehicles, ['id', vehicle.id]);

              if (vehicleUpdated) {
                return <Select.Option key={index} value={vehicleUpdated.id}>
                  {`${vehicleUpdated.model} ${vehicleUpdated.plate_number}`}
                </Select.Option>;
              }

              return <Select.Option key={index} value={vehicle.id}>
                {`${vehicle.model} ${vehicle.plate_number}`}
              </Select.Option>;
            })
          }
          {
            guestAdditionalVehicles.map((vehicle) => {
              const c = counter + 1;
              counter = c;
              return <Select.Option key={`additional-${c}`} value={`additional-${c}`}>
                {`${vehicle.model} ${vehicle.plate_number}`}
              </Select.Option>;
            })
          }
        </Select>;
      }
    },
    {
      title: '',
      dataIndex: 'id',
      render: function render(id) {
        return <Button size="small" type="link" onClick={() => {
          setIdGuests(id);
          setDataGuests(scanData);
          setDrawerGuests(true);
        }}>
          <EditOutlined />
        </Button>;
      }
    }
  ];

  useEffect(() => {
    // guest vehicles
    if (scanData.booking.guest_vehicles?.length || !guestAdditionalVehicles?.length) return;

    scanData.booking.guests?.map(guest => {
      setGuestAssignedVehiclesAtom({
        path: guest.id,
        value: 'additional-0',
      });
    });
  }, [guestAdditionalVehicles]);

  useEffect(() => {
    const guestListIds = map(scanData.booking?.guests, 'id');
    setGuestListDefaultValueAtom(guestListIds);

    const onPremiseGuest = filter(scanData.booking?.guests,
      (guest) => guest.status === 'on_premise' || guest.status === 'checked_in');
    const updatedRowKeys = [scanData.details?.id, ...map(onPremiseGuest, 'id')];
    setSelectedRowKeys(updatedRowKeys);
    setGuestListAtom(updatedRowKeys);

    // guest vehicles
    if (! scanData.booking.guest_vehicles?.length) return;

    let onLoadAlternateVehicleCounter = 0;

    scanData.booking?.guests.map(guest => {
      if (!scanData.booking.guest_vehicles[onLoadAlternateVehicleCounter]) {
        onLoadAlternateVehicleCounter = 0;
      }

      if (scanData.previous_security_check_data?.guest_vehicles[guest.id]) {
        setGuestAssignedVehiclesAtom({
          path: guest.id,
          value: scanData.previous_security_check_data?.guest_vehicles[guest.id],
        });
      } else {
        setGuestAssignedVehiclesAtom({
          path: guest.id,
          value: scanData.booking.guest_vehicles[onLoadAlternateVehicleCounter].id,
        });
      }

      if (scanData.booking?.guest_vehicles[onLoadAlternateVehicleCounter]) {
        onLoadAlternateVehicleCounter++;
      }
    });
  }, []);

  return (
    <>
      <Table
        bordered
        columns={tableColumns}
        dataSource={scanData.booking?.guests}
        pagination={false}
        rowKey="id"
        rowSelection={rowSelection}
        scroll={{ x: 'max-content' }} />
    </>
  );
};

export default Guests;
