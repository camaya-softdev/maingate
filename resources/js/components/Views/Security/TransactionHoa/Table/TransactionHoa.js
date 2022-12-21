import { Table, Button, Input } from "antd";
import flatten from "lodash/flatten";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import property from "lodash/property";
import React from "react";
import { getHoaTransactions } from "../../../../../services/api";
import useDrawer from "../useDrawer";
import { SearchOutlined } from "@ant-design/icons";

const TransactionHoa = () => {
  const transactionsAPI = getHoaTransactions();
  const [setId, setData, setTapData, setDrawer] = useDrawer();

  const columns = [
    {
      title: "Transaction Number",
      dataIndex: "id"
    },
    {
      title: "Status",
      dataIndex: "status",
      render: function render(status) {
        return status;
      },
      filters: [
        {
          text: "Validated",
          value: "validated"
        },
        {
          text: "On Hold",
          value: "on-hold"
        },
        {
          text: "Invalid Code",
          value: "invalid-code"
        },
        {
          text: "Voided",
          value: "voided"
        }
      ],
      onFilter: (value, record) =>
        record.status.indexOf(value) === 0
    },
    {
      title: "Code",
      dataIndex: "code",
      render: function render(code) {
        return code;
      },
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters
      }) => {
        return (
          <>
            <Input
              autoFocus
              placeholder="Search by HOA Code"
              value={selectedKeys[0]}
              onChange={e => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onPressEnter={() => {
                confirm();
              }}
              onBlur={() => {
                confirm();
              }}
            ></Input>
            <Button
              type="primary"
              onClick={() => {
                confirm();
              }}
            >
              Search
            </Button>
            <Button
              type="danger"
              onClick={() => {
                clearFilters();
              }}
            >
              Reset
            </Button>
          </>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.code
          .toUpperCase()
          .includes(value.toUpperCase());
      }
    },
    {
      title: "Remarks",
      dataIndex: "notes"
    },
    {
      title: <div className="text-center">Details</div>,
      dataIndex: "user",
      render: function render(security_check, record, index) {
        return (
          security_check &&
            <div className="text-center">
              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={() => {
                  setId(index);
                  setData(record);
                  setTapData(index);
                  setDrawer(true);
                }}
              >
                View
              </Button>
            </div>

        );
      }
    }
  ];

  return (
    <Table
      bordered
      dataSource={flatten(
        map(transactionsAPI.data?.pages, property("data.data"))
      )}
      columns={columns}
      footer={() =>
        <>
          {transactionsAPI.hasNextPage &&
            <Button
              block
              loading={transactionsAPI.isFetchingNextPage}
              onClick={() => transactionsAPI.fetchNextPage()}
              type="primary"
            >
              Load More
            </Button>
          }
          {!transactionsAPI.hasNextPage &&
            !isEmpty(
              flatten(map(transactionsAPI.data?.pages, property("data.data")))
            ) && <em>All data has been loaded</em>}
          {isEmpty(
            flatten(map(transactionsAPI.data?.pages, property("data.data")))
          ) && <em>No data found</em>}
        </>
      }
      loading={transactionsAPI.isLoading}
      pagination={false}
      rowKey="id"
      scroll={{ x: "max-content" }}
    />
  );
};

export default TransactionHoa;
