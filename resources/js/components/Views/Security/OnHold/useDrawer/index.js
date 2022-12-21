import { Button, Form, Input, Space } from 'antd';
import { useUpdateAtom } from 'jotai/utils';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import merge from 'lodash/merge';
import omitBy from 'lodash/omitBy';
import setWith from 'lodash/setWith';
import React, { useEffect, useState } from 'react';
import { drawerConfigAtom, showDrawerAtom } from '../../../../../atoms';
import { putSecurityChecks } from '../../../../../services/api';
import AdditionalGuests from './Table/AdditionalGuests';
import AdditionalVehicles from './Table/AdditionalVehicles';
import Details from './Table/Details';
import Guests from './Table/Guests';
import InvalidNotes from './Table/InvalidNotes';
import Notes from './Table/Notes';
import Others from './Table/Others';

const Index = () => {
  const setShowDrawer = useUpdateAtom(showDrawerAtom);
  const setDrawerConfig = useUpdateAtom(drawerConfigAtom);
  const [id, setId] = useState('');
  const [data, setData] = useState({});
  const [form] = Form.useForm();
  const putSecurityChecksAPI = putSecurityChecks();

  const onClose = () => {
    if (putSecurityChecksAPI.isLoading) {
      return;
    }

    form.resetFields();
    setShowDrawer(false);
  };

  const onFinish = (values) => {
    const startWithActionTaken = new RegExp(/^action_taken/);
    const actionTaken = {};
    const actionTakenOmitedValues = omitBy(values, function(value, key) {
      return startWithActionTaken.test(key);
    });

    // fixed action taken format
    // format: {action_taken: booking: {}, guests: {}, customChecklist: {}}
    keys(values).map(key => {
      if (startWithActionTaken.test(key)) {
        setWith(actionTaken, key, values[key], Object);
      }
    });

    const newValues = merge(actionTaken, actionTakenOmitedValues);

    putSecurityChecksAPI.mutate({ values: newValues, id });
  };

  const onSubmit = () => {
    form.submit();
  };

  const Footer = () => <div className="text-right">
    <Space align="end">
      <Button
        disabled={putSecurityChecksAPI.isLoading}
        onClick={onClose}>
        Cancel
      </Button>
      <Button
        disabled={putSecurityChecksAPI.isLoading}
        onClick={onSubmit}
        type="primary">
        Validated
      </Button>
    </Space>
  </div>;

  const Contents = () => <Form
    form={form}
    initialValues={{
      status: 'validated'
    }}
    layout="vertical"
    onFinish={onFinish}>
    <Form.Item name="status" hidden noStyle>
      <Input />
    </Form.Item>
    <div className="my-5">
      <Details data={data} />
    </div>
    <div className="my-5">
      <AdditionalVehicles data={data} />
    </div>
    <div className="my-5">
      <Guests data={data} />
    </div>
    <div className="my-5">
      <AdditionalGuests data={data} />
    </div>
    {!isEmpty(data.custom_checklists) &&
      <div className="my-5">
        <Others data={data} />
      </div>
    }
    <div className="my-5">
      <Notes data={data} />
    </div>
  </Form>;

  const ContentsInvalid = () => <Form
    form={form}
    initialValues={{
      status: 'validated'
    }}
    layout="vertical"
    onFinish={onFinish}>
    <Form.Item name="status" hidden noStyle>
      <Input />
    </Form.Item>
    <div className="my-5">
      <InvalidNotes data={data} />
    </div>
    <div className="my-5">
      <Notes data={data} />
    </div>
  </Form>;

  const afterVisibleChange = () => {
    form.resetFields();
  };

  useEffect(() => {
    setDrawerConfig({
      afterVisibleChange,
      children: data.scan_status === 'valid' ? <Contents /> : <ContentsInvalid />,
      footer: <Footer />,
      onClose,
      title: 'Validate',
    });
  }, [id, data]);

  useEffect(() => {
    if (putSecurityChecksAPI.isLoading) {
      setDrawerConfig({
        footer: <Footer />,
        title: 'Saving...',
      });
    }

    if (putSecurityChecksAPI.isSuccess) {
      setDrawerConfig({
        footer: <Footer />,
        title: 'Validate',
      });

      putSecurityChecksAPI.reset();
      setShowDrawer(false);
    }
  }, [putSecurityChecksAPI]);

  return [ setId, setData, setShowDrawer ];
};

export default Index;
