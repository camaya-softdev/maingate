import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Row, Col } from "antd";
import {
  layoutAtom,
  kioskPageAtom,
  scanMessageAtom,
  scanDataHoaAtom
} from "../../atoms";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { useHistory } from "react-router-dom";
import includes from "lodash/includes";
import isEmpty from "lodash/isEmpty";

const KioskHoa = ({ children }) => {
  const setLayout = useUpdateAtom(layoutAtom);
  const page = useAtomValue(kioskPageAtom);
  const scanDataHoa = useAtomValue(scanDataHoaAtom);
  const scanMessage = useAtomValue(scanMessageAtom);
  const history = useHistory();

  // set layout name on component mount
  useEffect(() => {
    setLayout("kiosk");
  }, []);

  // redirect on page change
  useEffect(() => {
    if(page === '' || page === '/'){
      console.log('trial');
      return;
    }
    if (page) {
      history.push(page);
    }
  }, [page]);

  // check scanned data if set, redirect to home page if not
  useEffect(() => {
    if (
      includes(
        ["/welcome-hoa", "/valid-code-hoa", "/holding-area-hoa"],
        page
      ) &&
      isEmpty(scanDataHoa)
    ) {
      history.push("/");
    } else if (!isEmpty(scanDataHoa) && history.location.pathname !== page) {
      history.push(page);
    }else{
      return;
    }
  }, [page, scanDataHoa, history]);

  // check scanned message if set, redirect to home page if not
  useEffect(() => {
    if (includes(["/invalid-code-hoa"], page) && isEmpty(scanMessage)) {
      history.push("/");
    }
  }, [page, scanMessage, history]);

  const dataLogo =
    scanDataHoa.users.autogate.template.hoa_autogate_template_picture;
  const dataBackgroud = scanDataHoa.users
    ? scanDataHoa.users.autogate.template.background.hoa_background_image
    : "";

  return (
    <div
      style={{
        backgroundImage: `url(${dataBackgroud})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        backgroundAttachment: "fixed"
      }}
    >
      <Row justify="space-around" align="middle" className="h-screen">
        <Col>
          <div className="text-center">
            <img
              src={
                dataLogo
                  ? dataLogo
                  : `${process.env.APP_URL}/images/camaya-logo.png`
              }
              // src={`${process.env.APP_URL}/images/camaya-logo.png`}
              alt="logo"
              className="object-scale-down h-60 mb-16"
            />
            {children}
          </div>
        </Col>
      </Row>
    </div>
  );
};

KioskHoa.propTypes = {
  children: PropTypes.element
};

export default KioskHoa;
