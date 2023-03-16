import { Button, Form, Input, Space } from 'antd';
import { useUpdateAtom } from 'jotai/utils';
import React, { useEffect, useState } from 'react';
import { drawerConfigAtom, onHoldDataAtom, showDrawerAtom } from '../../../../../atoms';
import { putSecurityChecks, verifyReferenceCode } from '../../../../../services/api';
import InvalidNotes from './Table/InvalidNotes';
import Notes from './Table/Notes';
import ReferenceNumber from './Table/ReferenceNumber';

const Assign = () => {
  const setShowDrawer = useUpdateAtom(showDrawerAtom);
  const setDrawerConfig = useUpdateAtom(drawerConfigAtom);
  const setOnHoldData = useUpdateAtom(onHoldDataAtom);
  const [id, setId] = useState('');
  const [data, setData] = useState({});
  const [form] = Form.useForm();
  const putSecurityChecksAPI = putSecurityChecks();
  const verifyReferenceCodeAPI = verifyReferenceCode();

  const onClose = () => {
    if (verifyReferenceCodeAPI.isLoading) {
      return;
    }

    form.resetFields();
    setShowDrawer(false);
  };

  const onFinish = (values) => {
    form.setFields([{ name: 'code', errors: [] }]);

    if (values.status === 'invalid-code' && values.code.trim() === '') {
      form.setFields([{
        name: 'code',
        errors: ['Reference code is required']
      }]);

      return;
    }

    values.status === 'invalid-code'
      ? verifyReferenceCodeAPI.mutate(values)
      : putSecurityChecksAPI.mutate({ values, id });
  };

  const onSubmit = () => {
    form.setFieldsValue({
      status: 'invalid-code',
    });
    form.submit();
  };

  const onSubmitVoided = () => {
    form.setFieldsValue({
      code: '',
      status: 'voided',
    });
    form.submit();
  };

  const Footer = () => <div className="text-right">
    <Button
      // eslint-disable-next-line max-len
      className="bg-red-500 float-left focus:bg-red-500 focus:text-white hover:bg-red-600 hover:border-white hover:text-white  text-white"
      disabled={verifyReferenceCodeAPI.isLoading || putSecurityChecksAPI.isLoading}
      onClick={onSubmitVoided}>
        Voided
    </Button>
    <Space>
      <Button
        disabled={verifyReferenceCodeAPI.isLoading || putSecurityChecksAPI.isLoading}
        onClick={onClose}>
        Cancel
      </Button>
      <Button
        disabled={verifyReferenceCodeAPI.isLoading || putSecurityChecksAPI.isLoading}
        onClick={onSubmit}
        type="primary">
        Validated
      </Button>
    </Space>
  </div>;

  const ContentsInvalid = () => <Form
    form={form}
    initialValues={{
      code: '',
      status: 'invalid-code',
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
    <div className="my-5">
      <ReferenceNumber />
    </div>
  </Form>;

  const afterVisibleChange = () => {
    form.resetFields();
  };

  useEffect(() => {
    setDrawerConfig({
      afterVisibleChange,
      children: <ContentsInvalid />,
      footer: <Footer />,
      onClose,
      title: 'Validate',
    });
  }, [id, data]);

  useEffect(() => {
    const values = form.getFieldsValue();

    if (values.status === 'invalid-code'
      && verifyReferenceCodeAPI.isLoading
      || values.status === 'voided'
      && putSecurityChecksAPI.isLoading) {
      setDrawerConfig({
        footer: <Footer />,
        title: 'Saving...',
      });
    }

    if (verifyReferenceCodeAPI.isSuccess) {
      setDrawerConfig({
        footer: <Footer />,
        title: 'Validate',
      });

      values.new_reference_number = values.code.trim();
      putSecurityChecksAPI.mutate({ values, id });
      setOnHoldData(verifyReferenceCodeAPI.data.data.data);
      verifyReferenceCodeAPI.reset();
      setShowDrawer(false);
    }

    if (verifyReferenceCodeAPI.isError) {
      setDrawerConfig({
        footer: <Footer />,
        title: 'Validate',
      });

      form.setFields([{
        name: 'code',
        errors: [verifyReferenceCodeAPI.error.response.data.status_message]
      }]);
    }

    if (putSecurityChecksAPI.isSuccess) {
      setDrawerConfig({
        footer: <Footer />,
        title: 'Validate',
      });

      putSecurityChecksAPI.reset();
      setShowDrawer(false);
    }
  }, [putSecurityChecksAPI, verifyReferenceCodeAPI]);

  return [ setId, setData, setShowDrawer ];
};

export default Assign;
