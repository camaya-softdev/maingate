import { Table } from "antd";
import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";
import React from "react";

const Details = ({ data: scanData }) => {
  const tableColumns = [
    {
      title: "Label",
      dataIndex: "label"
    },
    {
      title: "Details",
      dataIndex: "item"
    }
  ];

  const data = [
    {
      id: 1,
      label: "HOA Member Name",
      item:
        !isEmpty(scanData) && scanData.user.autogate.hoa_autogate_member_name
    },
    {
      id: 2,
      label: "Member ID",
      item: !isEmpty(scanData) && scanData.user.id
    },
    {
      id: 3,
      label: "Card Number",
      item: !isEmpty(scanData) && scanData.user.card.hoa_rfid_num
    }
  ];

  return (
    <>
      <Table
        bordered
        columns={tableColumns}
        dataSource={data}
        pagination={false}
        rowKey="id"
        scroll={{ x: "max-content" }}
        title={() => <h4 className="m-0">HOA Details</h4>}
      />
    </>
  );
};

Details.propTypes = {
  data: PropTypes.object
};

export default Details;
