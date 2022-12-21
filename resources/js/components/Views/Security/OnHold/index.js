import { Col, Divider, Row } from 'antd';
import { useAtomValue } from 'jotai/utils';
import isEmpty from 'lodash/isEmpty';
import React from 'react';
import { onHoldDataAtom } from '../../../../atoms';
import OnHold from './Table/OnHold';
import ValidVerification from './ValidVerification';

const Index = () => {
  const onHoldData = useAtomValue(onHoldDataAtom);

  return (
    <>
      {isEmpty(onHoldData) &&
      <Row justify="space-around" align="middle" className="h-screen">
        <Col className="flex flex-col min-h-screen w-screen p-5">
          <div className="flex-grow bg-white">

            <>
              <Divider orientation="left">
              On-Hold Guests
              </Divider>
              <div className="xl:px-16 lg:px-12 md:px-10 sm:px-8 p-5">
                <OnHold />
              </div>
            </>

          </div>
        </Col>
      </Row>}
      {!isEmpty(onHoldData) && <ValidVerification /> }
    </>
  );
};

export default Index;
