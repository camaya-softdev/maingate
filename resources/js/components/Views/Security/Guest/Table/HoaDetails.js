import { Table } from 'antd';
import { useAtomValue } from 'jotai/utils';
import React from 'react';
import {
  scanDataHoaAtom,
} from '../../../../../atoms';

const HoaDetails = () => {
  const scanDataHoa = useAtomValue(scanDataHoaAtom);
  // const [unchangeableRowKeys, setUnchangeableRowKeys] = useState([2, 3, 7]);
  const tableColumns = [
    {
      title: 'Label',
      dataIndex: 'label',
    },
    {
      title: 'Details',
      dataIndex: 'item',
    },
  ];


  const data = [
    {
      id: 1,
      label: 'Member ID',
      item: scanDataHoa.users.autogate.user_id,
    },
    {
      id: 2,
      label: 'Member Name',
      item: scanDataHoa.users.autogate.hoa_autogate_member_name
    },
    {
      id: 3,
      label: 'Subdivision',
      item: scanDataHoa.users.autogate.hoa_autogate_subdivision_name
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
        scroll={{ x: 'max-content' }} />
    </>
  );
};

export default HoaDetails;
