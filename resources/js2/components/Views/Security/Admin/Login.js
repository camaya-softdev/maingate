import React, { useEffect } from 'react';
import { Button, Form, Input, Typography } from "antd";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { postLogin } from "../../../../services/api";
import { userTokenAtom } from "../../../../atoms/userToken";
import { useUpdateAtom } from 'jotai/utils';

const Login = () => {
  const [form] = Form.useForm();
  const loginAPI = postLogin();
  const setUserToken = useUpdateAtom(userTokenAtom);

  const onFinish = (values) => {
    loginAPI.mutate(values);    
  };
  
  useEffect(() => {
    if (loginAPI.isSuccess && loginAPI.data?.data?.token) {
      setUserToken(loginAPI.data.data.token);
    }
  }, [loginAPI.isSuccess]);    
  
  return (
    <div className="flex h-auto min-h-full w-full p-5">   
      <div className="flex items-center bg-white w-full">

        <div className="mx-auto w-80">
          <h3 className="text-center">Login to continue</h3>
          {loginAPI.isError && 
            <p className="text-center">
              <Typography.Text type="danger">
                Invalid email or password
              </Typography.Text>
            </p>
          }
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your E-mail!'
                },
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!'
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                type="email"
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your Password!'
                }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button 
                block
                htmlType="submit" 
                loading={loginAPI.isLoading}
                type="primary" >
            Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
    
      </div>
    </div>
  );
};

export default Login;
