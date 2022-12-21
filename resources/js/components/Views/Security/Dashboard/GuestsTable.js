import filter from "lodash/filter";
import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import startCase from "lodash/startCase";
import { Table, Tag, Input } from "antd";
import name from "../../../../services/name";

const GuestsTable = ({ query }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [paginationNumber, setPaginationNumber] = useState(1);

  const rowSelection = {
    selectedRowKeys,
    hideSelectAll: true
  };
  const data = query.data?.data;

  const [dataSource, setDataSource] = useState(data);
  const [value, setValue] = useState("");

  //add this if just incase you need in near future filters, sorter, extra
  const onChange = pagination => {
    setPaginationNumber(pagination.current);
  };

  const columns = [
    {
      title: "#",
      render: (id, record, index) => index + 1 + (paginationNumber - 1) * 10
    },
    {
      title: "Booking Reference Number",
      dataIndex: "booking_reference_number"
    },
    {
      title: "Booking Type",
      render: (text, record) =>
        record.type === "DT" ? "Day tour" : "Overnight",
      filters: [
        {
          text: "Day tour",
          value: "DT"
        },
        {
          text: "Overnight",
          value: "ON"
        },
        {
          text: "Golf Day Tour",
          value: "GD"
        },
        {
          text: "Golf Overnight",
          value: "GO"
        }
      ],
      onFilter: (value, record) => record.type.indexOf(value) === 0
    },
    {
      title: "Tags",
      dataIndex: "tags",
      render: (text, record) =>
        record.booking.tags.map(tag => <Tag key={tag.id}>{tag.name}</Tag>)
    },
    {
      title: "Booking Status",
      dataIndex: "status",
      filters: [
        {
          text: "Pending",
          value: "pending"
        },
        {
          text: "Confirmed",
          value: "confirmed"
        },
        {
          text: "Cancelled",
          value: "cancelled"
        }
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0
    },
    {
      title: "Primary Customer",
      dataIndex: "booking",
      render: booking => isEmpty(booking) ? "" : name(booking.customer[0])
    },
    {
      title: "Guest Status",
      render: (text, record) => startCase(record.guests.status),
      filters: [
        {
          text: "Arriving",
          value: "arriving"
        },
        {
          text: "On Premise",
          value: "on_premise"
        },
        {
          text: "Checked In",
          value: "checked_in"
        },
        {
          text: "No Show",
          value: "no_show"
        },
        {
          text: "Cancelled",
          value: "cancelled"
        }
      ],
      onFilter: (value, record) => record.guests.status.indexOf(value) === 0
    },
    {
      title: "Guest Reference Number",
      render: (text, record) => record.guests.reference_number
    },
    {
      title: "Guest Name",
      render: (text, record) => name(record.guests)
    },
    {
      title: "Guest Age",
      render: (text, record) => record.guests.age
    },
    {
      title: "Guest Type",
      render: (text, record) => startCase(record.guests.type)
    },
    {
      title: "Mode of Transportation",
      dataIndex: "mode_of_transportation",
      render: text => startCase(text),
      onFilter: (value, record) =>
        record.booking.mode_of_transportation.indexOf(value) === 0,
      filters: [
        {
          text: "Own Vehicle",
          value: "own_vehicle"
        },
        {
          text: "Van Rental",
          value: "van_rental"
        },
        {
          text: "Undecided",
          value: "undecided"
        },
        {
          text: "Company Vehicle",
          value: "company_vehicle"
        },
        {
          text: "Camaya Vehicle",
          value: "camaya_vehicle"
        },
        {
          text: "Camaya Transportation",
          value: "camaya_transportation"
        },
      ]
    },
    {
      title: "Vehicle Details",
      render: (text, record) =>
        record.guest_vehicles.map(vehicle =>
          <Tag key={vehicle.id}>
            {vehicle.model}, {vehicle.plate_number}
          </Tag>
        )
    }
  ];

  useEffect(() => {
    const selectedReferenceNumbers = map(
      filter(query.data?.data, data => data.guests.status !== "arriving"),
      data => data.guests.reference_number
    );

    setSelectedRowKeys(selectedReferenceNumbers);
  }, [query]);

  useEffect(() => {
    setDataSource(query.data?.data);
  }, [data]);

  return (
    <div className="xl:px-16 lg:px-12 md:px-10 sm:px-8 p-5">
      <Input
        placeholder="Search by guest name, booking ref #, guest ref #"
        className="mb-5 rounded-md"
        value={value}
        onChange={e => {
          const currValue = e.target.value;
          setValue(currValue);
          const filteredData = data.filter(
            entry =>
              entry.guests.reference_number
                .toUpperCase()
                .includes(currValue.toUpperCase()) ||
              entry.guests.booking_reference_number
                .toUpperCase()
                .includes(currValue.toUpperCase()) ||
              entry.guests.last_name
                .toLowerCase()
                .includes(currValue.toLowerCase()) ||
              entry.guests.first_name
                .toLowerCase()
                .includes(currValue.toLowerCase())
          );
          setDataSource(filteredData);
        }}
      />
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        loading={query.loading}
        onChange={onChange}
        rowKey={record => record.guests.reference_number}
        rowSelection={rowSelection}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

GuestsTable.propTypes = {
  query: PropTypes.object
};

export default GuestsTable;
