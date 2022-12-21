import React from 'react';
import { Row, Col, Typography, Button, Input, Form } from 'antd';
import { scanHoldingArea } from '../../../../services/api';
import { barrierAtom, scanDataAtom } from '../../../../atoms';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';

const InvalidVerification = () => {
  const scanHoldingAreaAPI = scanHoldingArea();
  const [form] = Form.useForm();
  const scanData = useAtomValue(scanDataAtom);
  const setBarrier = useUpdateAtom(barrierAtom);

  const onFinish = (values) => {
    setBarrier(true);
    scanHoldingAreaAPI.mutate(
      {
        checklists: {
          booking: {},
          customChecklists: {},
          guests: {},
        },
        booking_reference_number: '',
        reference_number: scanData.details.code,
        invalid_notes: values.invalid_notes,
        scan_status: 'invalid',
        status: 'on-hold',
        tap_id: scanData.details.tap_id,
      }
    );
  };

  return (
    <>
      <Row justify="space-around" align="middle" className="h-screen">
        <Col className="flex flex-col min-h-screen w-screen p-5">
          <div className="flex-grow bg-white">
            <h3 className="text-center pt-5">
              <Typography.Text>
                Invalid Code Verification
              </Typography.Text>
            </h3>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}>

              <div className="mx-5">
                <table className="border-collapse border border-solid border-gray-100 p-4 w-full">
                  <caption
                    // eslint-disable-next-line max-len
                    className="border border-b-0 border-solid border-gray-100 p-4 text-black font-semibold"
                    style={{ captionSide: 'top' }}>
                    Note
                  </caption>
                  <tbody>
                    <tr>
                      <td className="border border-t-0 border-solid border-gray-100 px-4 pt-4">
                        <Form.Item
                          initialValue=""
                          name="invalid_notes"
                          rules={[{ required: true, message: 'Note is required' }]}>
                          <Input.TextArea rows={4} />
                        </Form.Item>
                      </td>
                    </tr>
                  </tbody>
                </table>

              </div>

              <div className="text-center my-5">
                <Button
                  htmlType="submit"
                  loading={scanHoldingAreaAPI.isLoading}
                  size="large"
                  type="primary">
                  Holding Area
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default InvalidVerification;
