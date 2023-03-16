import { Table, Button, Input } from "antd";
import flatten from "lodash/flatten";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import property from "lodash/property";
import React from "react";
import { getTransactions } from "../../../../../services/api";
import useDrawer from "../useDrawer";
import { SearchOutlined } from "@ant-design/icons";
import name from "../../../../../services/name";

const Transaction = () => {
  const transactionsAPI = getTransactions();
  const [setId, setData, setTapData, setDrawer] = useDrawer();

  const columns = [
    {
      title: "Transaction Number",
      dataIndex: "id"
    },
    {
      title: "Status",
      dataIndex: "security_check",
      render: function render(security_check) {
        return security_check.status;
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
        record.security_check.status.indexOf(value) === 0
    },
    {
      title: "Code",
      dataIndex: "security_check",
      render: function render(security_check) {
        return security_check.reference_number;
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
              placeholder="Search by Guest Code"
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
        return record.security_check.reference_number
          .toUpperCase()
          .includes(value.toUpperCase());
      }
    },
    {
      title: "Primary Customer",
      dataIndex: "booking",
      render: booking =>isEmpty(booking)?'': name(booking.customer[0]),
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
              placeholder="Search by Customer's Name"
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
        return record.security_check.reference_number
          .toUpperCase()
          .includes(value.toUpperCase());
      }
    },
    {
      title: <div className="text-center">Details</div>,
      dataIndex: "security_check",
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
                  setTapData(record.tap);
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

export default Transaction;
