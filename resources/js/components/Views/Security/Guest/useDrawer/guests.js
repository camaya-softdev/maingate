import { Button, Form, Space } from 'antd';
import { useUpdateAtom } from 'jotai/utils';
import keys from 'lodash/keys';
import React, { useEffect, useState } from 'react';
import {
  actionTakenValueAtom,
  drawerConfigAtom,
  showDrawerAtom,
} from '../../../../../atoms';
import Guests from './Table/Guests';

const GuestsDrawer = () => {
  const setShowDrawer = useUpdateAtom(showDrawerAtom);
  const setDrawerConfig = useUpdateAtom(drawerConfigAtom);
  const setActionTaken = useUpdateAtom(actionTakenValueAtom);
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
    const startWithActionTaken = new RegExp(/^action_taken/);
    keys(values).map(key => {
      if (startWithActionTaken.test(key)) {
        setActionTaken({
          path: key.replace('action_taken.', ''),
          value: values[key] ?? null
        });
      }
    });

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
      <Guests actionTaken={updatedData}
        data={data.booking?.guests.length
          ? data.booking.guests
          : []}
        showActionTaken={true} />
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
      title: 'Guests',
    });
  }, [id, data]);

  return [ setId, setData, setShowDrawer ];
};

export default GuestsDrawer;
