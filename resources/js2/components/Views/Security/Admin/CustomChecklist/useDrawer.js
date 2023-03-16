import { Button, Form, Input, Space } from 'antd';
import { useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import React, { useEffect, useState } from 'react';
import { drawerConfigAtom, showDrawerAtom } from '../../../../../atoms';
import { postCustomChecklist, putCustomChecklist, queryClient } from '../../../../../services/api';

const useDrawer = () => {
  const [showDrawer, setShowDrawer] = useAtom(showDrawerAtom);
  const setDrawerConfig = useUpdateAtom(drawerConfigAtom);
  const [id, setId] = useState('');
  const [list, setList] = useState(false);
  const [form] = Form.useForm();
  const postCustomChecklistAPI = postCustomChecklist({ queryClient: queryClient() });
  const putCustomChecklistAPI = putCustomChecklist({ queryClient: queryClient() });

  const onClose = () => {
    if (postCustomChecklistAPI.isLoading || putCustomChecklistAPI.isLoading) {
      return;
    }

    setShowDrawer(false);
  };

  const onFinish = (values) => {
    if (id) {
      putCustomChecklistAPI.mutate({ values, id });
      return;
    }

    postCustomChecklistAPI.mutate(values);
  };

  const onSubmit = () => {
    form.submit();
  };

  const Footer = () => <div className="text-right">
    <Space align="end">
      <Button
        onClick={onClose}
        loading={postCustomChecklistAPI.isLoading || putCustomChecklistAPI.isLoading}>
        Cancel
      </Button>
      <Button
        onClick={onSubmit}
        type="primary"
        loading={postCustomChecklistAPI.isLoading || putCustomChecklistAPI.isLoading}>
        Submit
      </Button>
    </Space>
  </div>;

  const Contents = () => <Form
    form={form}
    layout="vertical"
    onFinish={onFinish}>
    <Form.Item
      name="list"
      rules={[
        {
          required: true,
          message: 'List is required',
        },
      ]}
    >
      <Input
        placeholder="Enter a list"
        disabled={postCustomChecklistAPI.isLoading || putCustomChecklistAPI.isLoading} />
    </Form.Item>
  </Form>;

  useEffect(() => {
    setDrawerConfig({
      children: <Contents />,
      footer: <Footer />,
      onClose,
      title: postCustomChecklistAPI.isLoading || putCustomChecklistAPI.isLoading ? 
        'Saving...' : `${id && 'Update ' || 'Add '}Custom Checklist`,
    });
  });

  useEffect(() => {
    if (showDrawer && ! (
      postCustomChecklistAPI.isLoading ||
      putCustomChecklistAPI.isLoading ||
      postCustomChecklistAPI.isSuccess ||
      putCustomChecklistAPI.isSuccess
    )) {
      form.setFieldsValue({ list });
    }
  });

  useEffect(() => {
    if (postCustomChecklistAPI.isSuccess || putCustomChecklistAPI.isSuccess) {
      setShowDrawer(false);
      postCustomChecklistAPI.reset();
      putCustomChecklistAPI.reset();
    }
  }, [postCustomChecklistAPI, putCustomChecklistAPI]);

  return [ setId, setList, setShowDrawer ];
};

export default useDrawer;
