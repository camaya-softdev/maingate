import { Table, Button, Input } from "antd";
import dayjs from "dayjs";
import flatten from "lodash/flatten";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import property from "lodash/property";
import React from "react";
import { getTaps } from "../../../../../services/api";
import useDrawer from "../useDrawer";
import { SearchOutlined } from "@ant-design/icons";

const Tap = () => {
  const tapsAPI = getTaps();
  const [setId, setData, setTapData, setDrawer] = useDrawer();

  const columns = [
    {
      title: "Tap Number",
      dataIndex: "id"
    },
    {
      title: "Type",
      dataIndex: "scan",
      filters: [
        {
          text: 'Guest',
          value: 'Guest',
        },
        {
          text: 'HOA',
          value: 'HOA',
        },
      ],
      onFilter: (value, record) => record.scan.indexOf(value) === 0,
    },
    {
      title: "Code",
      dataIndex: "code",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm,clearFilters }) => {
        return (
          <>
            <Input
              autoFocus
              placeholder="Search by Guest Code"
              value={selectedKeys[0]}
              onChange={e => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown:false });
              }}
              onPressEnter={() => {
                confirm();
              }}
              onBlur={() => {
                confirm();
              }}
            ></Input>
            <Button type="primary" onClick={()=>{confirm();}}>Search</Button>
            <Button type="danger" onClick={()=>{clearFilters();}}>Reset</Button>
          </>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.code.toUpperCase().includes(value.toUpperCase());
      }
    },
    {
      title: "Scan Date and Time",
      dataIndex: "tap_datetime",
      render: function render(tap_datetime) {
        return dayjs(tap_datetime).format("lll");
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      filters: [
        {
          text: 'Valid Code',
          value: 'valid',
        },
        {
          text: 'Invalid Code',
          value: 'invalid',
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
    }
    // {
    //   title: <div className="text-center">Details</div>,
    //   dataIndex: 'security_check',
    //   render: function render(security_check, record, index) {
    //     return security_check && <div className="text-center">
    //       <Button type="link" style={{ padding: 0 }} onClick={() => {
    //         setId(index);
    //         setData(security_check);
    //         setTapData(record);
    //         setDrawer(true);
    //       }}>
    //         View
    //       </Button>
    //     </div>;
    //   }
    // },
  ];

  return (
    <Table
      bordered
      dataSource={flatten(map(tapsAPI.data?.pages, property("data.data")))}
      columns={columns}
      footer={() =>
        <>
          {tapsAPI.hasNextPage &&
            <Button
              block
              loading={tapsAPI.isFetchingNextPage}
              onClick={() => tapsAPI.fetchNextPage()}
              type="primary"
            >
              Load More
            </Button>
          }
          {!tapsAPI.hasNextPage &&
            !isEmpty(
              flatten(map(tapsAPI.data?.pages, property("data.data")))
            ) && <em>All data has been loaded</em>}
          {isEmpty(
            flatten(map(tapsAPI.data?.pages, property("data.data")))
          ) && <em>No data found</em>}
        </>
      }
      loading={tapsAPI.isLoading}
      pagination={false}
      rowKey="id"
      scroll={{ x: "max-content" }}
    />
  );
};

export default Tap;
