import React, { useEffect } from "react";
import PropTypes from 'prop-types';
import { Row, Col } from "antd";
import { layoutAtom, kioskPageAtom, scanDataAtom,scanMessageAtom, } from '../../atoms';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { useHistory } from "react-router-dom";
import includes from "lodash/includes";
import isEmpty from "lodash/isEmpty";

const Kiosk = ({ children }) => {
  const setLayout = useUpdateAtom(layoutAtom);
  const page = useAtomValue(kioskPageAtom);
  const scanData = useAtomValue(scanDataAtom);
  const scanMessage = useAtomValue(scanMessageAtom);
  const history = useHistory();

  // set layout name on component mount
  useEffect(() => {
    setLayout('kiosk');
  }, []);

  // redirect on page change
  useEffect(() => {
    if(page === '' || page === '/'){
      console.log('trial');
      return;
    }
    if (page) {
      console.log('not trial');
      history.push(page);
    }
  }, [page]);

  // check scanned data if set, redirect to home page if not
  useEffect(() => {
    if (includes(['/welcome', '/valid-code', '/holding-area'], page)
      && isEmpty(scanData)) {
      history.push('/');
    } else if (!isEmpty(scanData) && history.location.pathname !== page) {
      console.log('taema');
      history.push(page);
    }else{
      console.log(page);
      return;
    }
  }, [page, scanData, history]);

  // check scanned message if set, redirect to home page if not
  useEffect(() => {
    if (includes(['/invalid-code'], page) && isEmpty(scanMessage)) {
      history.push('/');
    }
  }, [page, scanMessage, history]);

  return (
    <Row justify="space-around" align="middle" className="h-screen">
      <Col>
        <div className="text-center">
          <img
            src={`${process.env.APP_URL}/images/camaya-logo.png`}
            alt="logo"
            className="object-scale-down h-56 mb-16" />
          {children}
        </div>
      </Col>
    </Row>
  );
};

Kiosk.propTypes = {
  children: PropTypes.element,
};

export default Kiosk;
