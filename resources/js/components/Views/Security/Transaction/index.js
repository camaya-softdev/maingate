import { Col, Row, Divider } from 'antd';
import React from 'react';
import Transaction from './Table/Transaction';

const Index = () => {
  return (
    <Row justify="space-around" align="middle" className="h-screen">
      <Col className="flex flex-col min-h-screen w-screen p-5">
        <div className="flex-grow bg-white">
          <Divider orientation="left">
            Transactions
          </Divider>
          <div className="xl:px-16 lg:px-12 md:px-10 sm:px-8 p-5">
            <Transaction />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Index;
