import { Card, Col, Row, Typography } from "antd";
import PropTypes from "prop-types";
import React from "react";

const SummaryStatistics = ({ data }) => {
  return (
    <div className="xl:px-16 lg:px-12 md:px-10 sm:px-8 p-5">
      <Row gutter={[24, 24]}>
        <Col span={[8]}>
          <Card size="small">
            <Card.Meta
              title={
                <Typography.Title level={2}>
                  {data?.data.guests_today_total_count || 0}
                </Typography.Title>
              }
              description={
                <Typography.Text ellipsis={true} type="secondary">
                  Total Guests
                </Typography.Text>
              }
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Card.Meta
              title={
                <Typography.Title level={2}>
                  {data?.data.guests_not_entered_count || 0}
                </Typography.Title>
              }
              description={
                <Typography.Text ellipsis={true} type="secondary">
                  Guests Arriving
                </Typography.Text>
              }
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Card.Meta
              title={
                <Typography.Title level={2}>
                  {data?.data.guests_validated_count || 0}
                </Typography.Title>
              }
              description={
                <Typography.Text ellipsis={true} type="secondary">
                  Guests On Premise
                </Typography.Text>
              }
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card size="small">
            <Card.Meta
              title={
                <Typography.Title level={2}>
                  {data?.data.guests_entered_count || 0}
                </Typography.Title>
              }
              description={
                <Typography.Text ellipsis={true} type="secondary">
                  Guests Checked In
                </Typography.Text>
              }
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Card.Meta
              title={
                <Typography.Title level={2}>
                  {data?.data.guests_no_show_count || 0}
                </Typography.Title>
              }
              description={
                <Typography.Text ellipsis={true} type="secondary">
                  Guests No Show
                </Typography.Text>
              }
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Card.Meta
              title={
                <Typography.Title level={2}>
                  {data?.data.guests_cancelled_count || 0}
                </Typography.Title>
              }
              description={
                <Typography.Text ellipsis={true} type="secondary">
                  Guests Cancelled
                </Typography.Text>
              }
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card size="small">
            <Card.Meta
              title={
                <Typography.Title level={2}>
                  {data?.data.holding_area_guests_count || 0}
                </Typography.Title>
              }
              description={
                <Typography.Text ellipsis={true} type="secondary">
                  Guests in Holding Area
                </Typography.Text>
              }
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Card.Meta
              title={
                <Typography.Title level={2}>
                  {data?.data.guests_voided_count || 0}
                </Typography.Title>
              }
              description={
                <Typography.Text ellipsis={true} type="secondary">
                  Guests Voided
                </Typography.Text>
              }
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card size="small">
            <Card.Meta
              title={<Typography.Title level={2}>{data?.data.total_hoa}</Typography.Title>}
              description={
                <Typography.Text ellipsis={true} type="secondary">
                  HOA Portal
                </Typography.Text>
              }
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

SummaryStatistics.propTypes = {
  data: PropTypes.object
};

export default SummaryStatistics;
