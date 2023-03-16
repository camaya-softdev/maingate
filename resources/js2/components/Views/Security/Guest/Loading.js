import React, { useEffect, useState } from 'react';
import { SyncOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input } from 'antd';
import dayjs from 'dayjs';
import { manualGateAccess, verifyReferenceCode } from '../../../../services/api';

const Loading = () => {
  const [form] = Form.useForm();
  const verifyReferenceCodeAPI = verifyReferenceCode();
  const manualGateAccessAPI = manualGateAccess();
  const [verifySuccess, setVerifySuccess] = useState(false);

  const onFinish = (values) => {
    setVerifySuccess(false);
    verifyReferenceCodeAPI.mutate(values);
  };

  useEffect(() => {
    const values = form.getFieldsValue();

    if (verifyReferenceCodeAPI.isSuccess && !verifySuccess) {
      values.timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
      manualGateAccessAPI.mutate(values);
      setVerifySuccess(true);
    }

    if (verifyReferenceCodeAPI.isError) {
      form.setFields([{
        name: 'code',
        errors: [verifyReferenceCodeAPI.error.response.data.status_message]
      }]);
    }
  }, [verifyReferenceCodeAPI]);

  return (
    <div className="flex h-auto min-h-full w-full p-5">
      <div className="flex items-center bg-white w-full">

        <div className="text-center text-3xl w-full py-5 px-1">
          <SyncOutlined spin /> Waiting for Guest QR Code Tap

          <Divider />

          <div className="mx-auto mt-10" style={{ width: '295px' }}>
            <Form
              layout="vertical"
              form={form}
              onFinish={onFinish}
              className="text-center"
              initialValues={{
                secret_token: process.env.MANUAL_SECRET_TOKEN,
                kiosk_id: process.env.MANUAL_KIOSK_ID,
                interface: process.env.MANUAL_INTERFACE,
                mode: process.env.MANUAL_MODE,
              }}
            >
              <Form.Item
                name="code"
                rules={[
                  {
                    required: true,
                    message: 'Please enter guest QR code'
                  },
                ]}
              >
                <Input
                  placeholder="Guest QR code manual"
                />
              </Form.Item>
              <Form.Item name="secret_token" noStyle>
                <Input type="hidden" />
              </Form.Item>
              <Form.Item name="kiosk_id" noStyle>
                <Input type="hidden" />
              </Form.Item>
              <Form.Item name="interface" noStyle>
                <Input type="hidden" />
              </Form.Item>
              <Form.Item name="mode" noStyle>
                <Input type="hidden" />
              </Form.Item>
              <Form.Item name="timestamp" noStyle>
                <Input type="hidden" />
              </Form.Item>
              <Form.Item>
                <Button
                  htmlType="submit"
                  loading={verifyReferenceCodeAPI.isLoading || manualGateAccessAPI.isLoading}
                  type="primary">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Loading;
