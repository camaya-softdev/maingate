import React from 'react';
import { Button, Popconfirm, Space, Table as AntDTable } from 'antd';
import { getCustomChecklists } from '../../../../../services/api';
import useDrawer from './useDrawer';
import { deleteCustomChecklist, queryClient } from '../../../../../services/api';

const Table = () => {
  const getCustomChecklistsAPI = getCustomChecklists();
  const [setId, setList, setShowDrawer] = useDrawer();
  const deleteCustomChecklistAPI = deleteCustomChecklist({ queryClient: queryClient() });  
    
  const columns = [
    {
      title: 'List',
      dataIndex: 'list',
    },
    {
      title: <Button type="ghost" onClick={() => {
        setId('');
        setList('');
        setShowDrawer(true);
      }}>
          Add
      </Button>,
      dataIndex: 'id',
      render: function render(id, record) {
        return (
          <Space>
            <Button type="link" style={{ padding: 0 }} onClick={() => {
              setId(id);
              setList(record.list);
              setShowDrawer(true);
            }}>
              Edit
            </Button>
            <Popconfirm 
              title="Are you sure?" 
              okText="Yes" 
              cancelText="No"
              onConfirm={() => deleteCustomChecklistAPI.mutate(id)}>
              <Button 
                style={{ padding: 0 }} 
                type="link">
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },    
  ];

  return (
    <>      
      <AntDTable
        bordered
        columns={columns}
        dataSource={getCustomChecklistsAPI.data?.data}            
        loading={getCustomChecklistsAPI.isLoading || deleteCustomChecklistAPI.isLoading}
        pagination={false}
        rowKey="id"
        scroll={{ x: 'max-content' }} />
    </>
  );
};

export default Table;
