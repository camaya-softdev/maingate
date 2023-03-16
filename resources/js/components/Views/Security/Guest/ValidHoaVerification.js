import React, { useState } from "react";
import { Input, Form, Row, Col, Divider, Typography, Space, Button } from "antd";
import { useAtomValue, useResetAtom, useUpdateAtom } from "jotai/utils";
import { barrierAtom, scanDataAtom, scanDataHoaAtom } from "../../../../atoms";
import HoaDetails from "./Table/HoaDetails";
import { scanHoldingHoaArea, scanHoaValid } from "../../../../services/api";

const ValidHoaVerification = () => {
  const scanDataHoa = useAtomValue(scanDataHoaAtom);
  const [form] = Form.useForm();
  const setBarrier = useUpdateAtom(barrierAtom);
  const scanDataReset = useResetAtom(scanDataAtom);
  const scanDataHoaReset = useResetAtom(scanDataHoaAtom);
  const [isValidated, setIsValidated] = useState(false);
  const [isHoldingArea, setIsHoldingArea] = useState(false);
  const scanHoldingAreaAPI = scanHoldingHoaArea();
  const scanValidAPI = scanHoaValid();

  const onSubmit = (values,status = "validated") => {
    console.log(values);
    let arg = {
      status: status,
      code: scanDataHoa.users.card[0].hoa_rfid_num,
      user_id: scanDataHoa.users ? scanDataHoa.users.id : '',
      notes: values.notes,
    };
    setIsHoldingArea(false);
    setIsValidated(false);
    setBarrier(true);
    scanDataReset();
    scanDataHoaReset();
    status === "validated"
      ? scanValidAPI.mutate(arg)
      : scanHoldingAreaAPI.mutate(arg);

  };
  return (
    <>
      <Row justify="space-around" align="middle" className="h-screen">
        <Col className="flex flex-col min-h-screen w-screen p-5">

          <div className="flex-grow bg-white">
            <h3 className="text-center pt-5">
              <Typography.Text>Scanned Code Information</Typography.Text>
            </h3>

            <Divider orientation="left">HOA Member Details</Divider>
            <div className="xl:px-16 lg:px-12 md:px-10 sm:px-8 p-5">
              <HoaDetails />
            </div>

            <div className="flex-grow bg-white">
              <h3 className="text-center pt-5">
                <Typography.Text>
                Remarks
                </Typography.Text>
              </h3>

              <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}>

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
                            name="notes"
                            rules={[{ required: true, message: 'Note is required' }]}>
                            <Input.TextArea rows={4} />
                          </Form.Item>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                </div>
                <div className="text-center my-5">
                  <Space align="center">
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      disabled={isValidated}
                      // onClick={() => onSubmit("validated")}
                      loading={
                        scanValidAPI.isLoading
                      }
                    >
                  Validated
                    </Button>
                    <Button
                      size="large"
                      disabled={isHoldingArea}
                      onClick={() => {
                        onSubmit("Holding Area","on-hold");
                      }}
                      loading={
                        scanHoldingAreaAPI.isLoading || scanValidAPI.isLoading
                      }
                    >
                  Holding Area
                    </Button>
                  </Space>
                </div>
              </Form>
            </div>


          </div>
        </Col>
      </Row>
    </>
  );
};

export default ValidHoaVerification;
