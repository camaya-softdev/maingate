import { Button, Form, Space } from 'antd';
import { useUpdateAtom } from 'jotai/utils';
import isEmpty from 'lodash/isEmpty';
import indexOf from 'lodash/indexOf';
import React, { useEffect, useState } from 'react';
import {
  actionTakenValueAtom,
  drawerConfigAtom,
  guestAdditionalVehiclesValueAtom,
  guestVehiclesValueAtom,
  showDrawerAtom,
} from '../../../../../atoms';
import AdditionalVehicles from './TableValidate/AdditionalVehicles';
import Vehicles from './TableValidate/Vehicles';

const VehiclesDrawer = () => {
  const setShowDrawer = useUpdateAtom(showDrawerAtom);
  const setDrawerConfig = useUpdateAtom(drawerConfigAtom);
  const setActionTaken = useUpdateAtom(actionTakenValueAtom);
  const setGuestVehicles = useUpdateAtom(guestVehiclesValueAtom);
  const setGuestAdditionalVehicles = useUpdateAtom(guestAdditionalVehiclesValueAtom);
  const [id, setId] = useState('');
  const [data, setData] = useState({});
  const [updatedData, setUpdatedData] = useState({});
  const [form] = Form.useForm();

  const onClose = () => {
    setId('');
    form.resetFields();
    setShowDrawer(false);
  };

  const onFinish = (values) => {
    const currentVehicleDisplay = data.booking.guest_vehicles.map(vehicle =>
      `${vehicle.model} ${vehicle.plate_number}`);
    const vehiclesToUpdate = [];
    const vehiclesToUpdateObj = [];

    values.vehicles.map(vehicle => {
      const vehicleDisplay = `${vehicle.model} ${vehicle.plate_number}`;
      if (indexOf(currentVehicleDisplay, vehicleDisplay) === -1) {
        vehiclesToUpdate.push(vehicleDisplay);
        vehiclesToUpdateObj.push(vehicle);
      }
    });

    if (vehiclesToUpdate.length) {
      setActionTaken({
        path: 'booking.5',
        value: `Updated to\r\n${vehiclesToUpdate.join("\r\n")}`
      });
    }

    setGuestVehicles(vehiclesToUpdateObj);
    setGuestAdditionalVehicles(values.additional_vehicles);
    setUpdatedData(values);
    onClose();
  };

  const onSubmit = () => {
    form.submit();
  };

  const Footer = () => <div className="text-right">
    <Space align="end">
      <Button
        onClick={onClose}>
        Cancel
      </Button>
      <Button
        onClick={onSubmit}
        type="primary">
        Save
      </Button>
    </Space>
  </div>;

  const Contents = () => <Form
    form={form}
    layout="vertical"
    onFinish={onFinish}>
    <div className="my-5">
      <Vehicles data={isEmpty(updatedData)
        ? data.booking.guest_vehicles?.length
          ? [...data.booking.guest_vehicles.map(vehicle =>
            ({ id: vehicle.id, model: vehicle.model, plate_number: vehicle.plate_number }))]
          : []
        : updatedData.vehicles}
      disable={data?.previous_security_check_data ? true : false} />
    </div>
    <div className="my-5">
      <AdditionalVehicles
        bookingReferenceNumber={data.booking.reference_number}
        data={isEmpty(updatedData)
          ? []
          : updatedData.additional_vehicles} />
    </div>
  </Form>;

  const afterVisibleChange = () => {
    form.resetFields();
  };

  useEffect(() => {
    setDrawerConfig({
      afterVisibleChange,
      children: <Contents />,
      footer: <Footer />,
      onClose,
      title: 'Validate Vehicle',
    });
  }, [id, data]);

  return [ setId, setData, setShowDrawer ];
};

export default VehiclesDrawer;
