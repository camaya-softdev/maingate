import { Table } from 'antd';
import { useAtomValue } from 'jotai/utils';
import find from 'lodash/find';
import matchesProperty from 'lodash/matchesProperty';
import React from 'react';
import { scanDataAtom } from '../../../../../atoms';
import name from '../../../../../services/name';

const Inclusions = () => {
  const scanData = useAtomValue(scanDataAtom);

  const rowSelection = {
    onChange: () => {},
  };

  const tableColumns = [
    {
      title: 'Item',
      dataIndex: 'item',
    },
    {
      title: 'Guest',
      dataIndex: 'guest_id',
      render: (id) => name(find(scanData.booking.guests, matchesProperty('id', id))),
    },
  ];

  return (
    <>
      <Table
        bordered
        columns={tableColumns}
        dataSource={scanData.booking.inclusions}
        pagination={false}
        rowKey="id"
        rowSelection={rowSelection}
        scroll={{ x: 'max-content' }} />
    </>
  );
};

export default Inclusions;
