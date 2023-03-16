import { Table } from "antd";
import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";
import React from "react";

const Designee = ({ data: scanData }) => {
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
      label: "Name",
      item:
        !isEmpty(scanData.user.designee) && scanData.user.designee.hoa_member_designee_name
    },
    {
      id: 2,
      label: "Relationship",
      item: !isEmpty(scanData.user.designee) && scanData.user.designee.hoa_member_relation
    },
    // {
    //   id: 3,
    //   label: "Status",
    //   item: !isEmpty(scanData.user.designee) && scanData.user.designee.hoa_member_
    // }
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
        title={() => <h4 className="m-0">Family Members</h4>}
      />
    </>
  );
};

Designee.propTypes = {
  data: PropTypes.object
};

export default Designee;
