import { Form, Input, Table } from 'antd';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import pickBy from 'lodash/pickBy';
import PropTypes from 'prop-types';
import React from 'react';

const Others = ({ data: scanData }) => {
  const rowSelection = {
    selectedRowKeys:
      keys(pickBy(scanData.checklists.customChecklist, value => value === true))
        .map(key => Number(key)),
  };

  const tableColumns = [
    {
      title: 'List',
      dataIndex: 'list',
    },
    {
      title: <div className="text-center">Action Taken</div>,
      dataIndex: 'id',
      render: function render(id) {
        return <div className="text-center">
          <Form.Item
            name={`action_taken.customChecklist.${id}`}
            className="m-0"
            initialValue={`${scanData.action_taken?.customChecklist[id] || ''}`}>
            <Input.TextArea rows={2} disabled="disabled" />
          </Form.Item>
        </div>;
      }
    },
  ];

  return (
    <>
      <Table
        bordered
        columns={tableColumns}
        dataSource={!isEmpty(scanData) && scanData.custom_checklists}
        pagination={false}
        rowKey="id"
        rowSelection={rowSelection}
        scroll={{ x: 'max-content' }}
        title={() => <h4 className="m-0">Others</h4>} />
    </>
  );
};

Others.propTypes = {
  data: PropTypes.object,
};

export default Others;
