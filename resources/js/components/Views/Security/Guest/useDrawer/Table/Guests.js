import { Form, Input, Table } from 'antd';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

const Guests = ({ data: scanData, actionTaken, showActionTaken = false }) => {
  const tableColumns = [
    {
      title: '#',
      render: function render(text, record, index) {
        return index + 1;
      }
    },
    {
      title: 'Reference Number',
      dataIndex: 'reference_number',
    },
    {
      title: 'First Name',
      dataIndex: 'first_name',
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
  ];

  useEffect(() => {
    if (showActionTaken) {
      tableColumns.push({
        title: <div className="text-center">Notes</div>,
        dataIndex: 'id',
        render: function render(id) {
          const key = `action_taken.guests.${id}`;
          return <div className="text-center">
            <Form.Item name={`action_taken.guests.${id}`} className="m-0"
              initialValue={`${actionTaken[key] || ''}`}>
              <Input.TextArea rows={2} />
            </Form.Item>
          </div>;
        }
      });
    }
  }, [showActionTaken]);

  return (
    <>
      <Table
        bordered
        columns={tableColumns}
        dataSource={!isEmpty(scanData) && scanData}
        pagination={false}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        title={() => <h4 className="m-0">Guest Lists</h4>} />
    </>
  );
};

Guests.propTypes = {
  data: PropTypes.array,
  actionTaken: PropTypes.object,
  showActionTaken: PropTypes.bool,
};


export default Guests;
