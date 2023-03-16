import { Form, Input, Table } from 'antd';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import map from 'lodash/map';
import pickBy from 'lodash/pickBy';
import values from 'lodash/values';
import PropTypes from 'prop-types';
import React from 'react';
import date from '../../../../../../services/date';
import name from '../../../../../../services/name';

const Details = ({ data: scanData }) => {
  const rowSelection = {
    selectedRowKeys: isEmpty(scanData) ? [] :
      keys(
        pickBy(
          scanData.security_check.checklists.booking, value => value === true
        )
      ).map(key => Number(key)),
  };

  const tableColumns = [
    {
      title: 'Label',
      dataIndex: 'label',
    },
    {
      title: 'Details',
      dataIndex: 'item',
    },
    {
      title: <div className="text-center">Action Taken</div>,
      dataIndex: 'id',
      render: function render(id) {
        return <div className="text-center">
          <Form.Item name={`action_taken.booking.${id}`} className="m-0"
            initialValue={`${scanData.security_check.action_taken?.booking[id] || ''}`}>
            <Input.TextArea rows={2} disabled="disabled" />
          </Form.Item>
        </div>;
      }
    },
  ];

  const data = [
    {
      id: 1,
      label: 'Name',
      item: !isEmpty(scanData) &&
        name(scanData.booking.customer[0]),
    },
    {
      id: 2,
      label: 'Booking Reference Number',
      item: !isEmpty(scanData) &&
        scanData.booking.reference_number,
    },
    {
      id: 3,
      label: 'Balance',
      item: !isEmpty(scanData) &&
        scanData.balance || 0,
    },
    {
      id: 4,
      label: 'Date of Visit',
      item: !isEmpty(scanData) &&
        `${date(scanData.booking.start_datetime)} - ${date(scanData.booking.end_datetime)}`
    },
    {
      id: 5,
      label: 'Vehicle Details',
      item: !isEmpty(scanData) &&
        values(scanData.security_check.booking_guest_vehicles).map((vehicle, index) =>
          <div key={vehicle.id}>
            {`${vehicle.model} ${vehicle.plate_number}`}
            {index && <br />}
          </div>),
    },
    {
      id: 6,
      label: 'Pax',
      item: !isEmpty(scanData) &&
        scanData.booking.adult_pax + scanData.booking.kid_pax + scanData.booking.infant_pax
    },
    {
      id: 7,
      label: 'Tags',
      item: !isEmpty(scanData) &&
        map(scanData.booking.tags, 'name').join(', '),
    },
  ];

  return (
    <>
      <Table
        bordered
        columns={tableColumns}
        dataSource={data}
        pagination={false}
        rowKey="id"
        rowSelection={rowSelection}
        scroll={{ x: 'max-content' }}
        title={() => <h4 className="m-0">Booking Details</h4>} />
    </>
  );
};

Details.propTypes = {
  data: PropTypes.object,
};

export default Details;
