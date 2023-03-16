import { Form, Input, Table } from 'antd';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import pickBy from 'lodash/pickBy';
import PropTypes from 'prop-types';
import React from 'react';

const Guests = ({ data: scanData }) => {
  const rowSelection = {
    selectedRowKeys: isEmpty(scanData) ? [] :
      keys(pickBy(scanData.checklists.guests, value => value === true)).map(key => Number(key)),
  };

  const tableColumns = [
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
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Vehicle',
      render: function render(text, record) {
        const guestVehicles = scanData.booking.guest_vehicles;
        const guestAdditionalVehicles = scanData.additional_vehicles;
        const guestVehicle = scanData.guest_vehicles[record.id];

        if (guestVehicle && /^additional-/.test(guestVehicle)) {
          if (! guestAdditionalVehicles) {
            return '';
          }

          const vehicleIndex = Number(guestVehicle.replace('additional-', ''));

          return `
            ${guestAdditionalVehicles[vehicleIndex].model}
            ${' '}
            ${guestAdditionalVehicles[vehicleIndex].plate_number}`;
        } else if (guestVehicle) {
          const vehicleObject = find(guestVehicles, ['id', guestVehicle]);

          return `
            ${vehicleObject.model}
            ${' '}
            ${vehicleObject.plate_number}`;
        }

        return;
      }
    },
    {
      title: <div className="text-center">Action Taken</div>,
      dataIndex: 'id',
      render: function render(id) {
        return <div className="text-center">
          <Form.Item name={`action_taken.guests.${id}`} className="m-0"
            initialValue={`${scanData.action_taken?.guests[id] || ''}`}>
            <Input.TextArea rows={2} />
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
        dataSource={!isEmpty(scanData) && scanData.booking.guests}
        pagination={false}
        rowKey="id"
        rowSelection={rowSelection}
        scroll={{ x: 'max-content' }}
        title={() => <h4 className="m-0">Guest Lists</h4>} />
    </>
  );
};

Guests.propTypes = {
  data: PropTypes.object,
};


export default Guests;
