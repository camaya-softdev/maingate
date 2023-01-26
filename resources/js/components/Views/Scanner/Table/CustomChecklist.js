import { Table } from 'antd';
import { useUpdateAtom } from 'jotai/utils';
import map from 'lodash/map';
import React, { useEffect } from 'react';
import { customChecklistAtom, customChecklistDefaultValueAtom } from '../../../../atoms';
import { getCustomChecklists } from '../../../../services/api';

const CustomChecklist = () => {
  const getCustomChecklistsAPI = getCustomChecklists();
  const setCustomChecklistAtom = useUpdateAtom(customChecklistAtom);
  const setCustomChecklistDefaultValueAtom = useUpdateAtom(customChecklistDefaultValueAtom);

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setCustomChecklistAtom(selectedRowKeys);
    },
  };

  const tableColumns = [
    {
      title: 'List',
      dataIndex: 'list',
    },
  ];

  useEffect(() => {
    if (getCustomChecklistsAPI.isSuccess) {
      const customChecklistIds = map(getCustomChecklistsAPI.data?.data, 'id');
      setCustomChecklistDefaultValueAtom(customChecklistIds);
    }
  }, [getCustomChecklistsAPI]);

  return (
    <>
      <Table
        bordered
        columns={tableColumns}
        dataSource={getCustomChecklistsAPI.data?.data}
        pagination={false}
        rowKey="id"
        rowSelection={rowSelection}
        scroll={{ x: 'max-content' }} />
    </>
  );
};

export default CustomChecklist;
