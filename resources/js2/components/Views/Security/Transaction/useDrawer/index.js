import { Button, Form, Input } from "antd";
import dayjs from "dayjs";
import { useUpdateAtom } from "jotai/utils";
import isEmpty from "lodash/isEmpty";
import React, { useEffect, useState } from "react";
import { drawerConfigAtom, showDrawerAtom } from "../../../../../atoms";
import AdditionalGuests from "./Table/AdditionalGuests";
import AdditionalVehicles from "./Table/AdditionalVehicles";
import Details from "./Table/Details";
import Guests from "./Table/Guests";
import InvalidNotes from "./Table/InvalidNotes";
import Notes from "./Table/Notes";
import Others from "./Table/Others";

const Index = () => {
  const setShowDrawer = useUpdateAtom(showDrawerAtom);
  const setDrawerConfig = useUpdateAtom(drawerConfigAtom);
  const [id, setId] = useState("");
  const [data, setData] = useState({});
  const [tapData, setTapData] = useState({});
  const [form] = Form.useForm();

  const onClose = () => {
    form.resetFields();
    setShowDrawer(false);
  };

  const onFinish = () => {};

  const Footer = () => 
    <div className="text-right">
      <Button onClick={onClose}>Close</Button>
    </div>
  ;

  const TransactionDetails = () => 
    <div className="overflow-hidden border-b border-gray-200 rounded-sm">
      <table className="border-transparent w-full">
        <tbody>
          <tr>
            <td className="border border-gray-200 border-solid p-3">
              Transaction Number
            </td>
            <td className="border border-gray-200 border-solid p-3 text-right">
              {data.id}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-200 border-solid p-3">
              Transaction Date and Time
            </td>
            <td className="border border-gray-200 border-solid p-3 text-right">
              {dayjs(data.created_at).format("lll")}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-200 border-solid p-3">
              Tap Number
            </td>
            <td className="border border-gray-200 border-solid p-3 text-right">
              {tapData?.id || "N/A"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ;

  const Contents = () => 
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item name="status" noStyle>
        <Input type="hidden" />
      </Form.Item>
      <TransactionDetails />
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
    </Form>
  ;

  const ContentsInvalid = () => 
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item name="status" noStyle>
        <Input type="hidden" />
      </Form.Item>
      <TransactionDetails />
      <div className="my-5">
        <InvalidNotes data={data} />
      </div>
      <div className="my-5">
        <Notes data={data} />
      </div>
    </Form>
  ;

  const afterVisibleChange = () => {
    form.resetFields();
  };

  useEffect(() => {
    setDrawerConfig({
      afterVisibleChange,
      children:
        data.security_check?.scan_status === "valid" ? 
          <Contents />
          : 
          <ContentsInvalid />
      ,
      footer: <Footer />,
      onClose,
      title: "Details"
    });
  }, [id, data]);

  return [setId, setData, setTapData, setShowDrawer];
};

export default Index;
