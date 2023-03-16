import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import ThirdPage from "./ThirdPage";

const delay = 10000;

const SecondPage = props => {
  const [showThirdPage, setShowThirdPage] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowThirdPage(true), delay);

    return () => {};
  }, [showThirdPage]);

  function content(value) {
    let balance = value
      .replace('[balance]',props.balance)
      .replace('[fullname]',props.fullName)
      .replace('[duedate]',props.duedate)
      .replace('[load]',props.privilegeLoad)
      .replace('[subdivision]',props.subdivision)
      .replace('[address]',props.address);
    return JSON.parse(balance);
  }

  return (
    <>
      {!showThirdPage &&
        <div>
          <div className="mb-2">
            <ReactQuill
              theme="bubble"
              value={content(props.secondPage)}

              readOnly="false"
            ></ReactQuill>
          </div>
          <div>
            <ReactQuill
              theme="bubble"
              value={content(props.footerSecondPage)}
              readOnly="false"
            ></ReactQuill>
          </div>
        </div>
      }
      {showThirdPage &&
        <ThirdPage
          thirdPage={props.thirdPage}
          footerThirdPage={props.footerThirdPage}
        />
      }
    </>
  );
};

SecondPage.propTypes = {
  secondPage: PropTypes.string,
  footerSecondPage: PropTypes.string,
  thirdPage: PropTypes.string,
  footerThirdPage: PropTypes.string,
  fullName:PropTypes.string,
  balance:PropTypes.string,
  duedate:PropTypes.date,
  privilegeLoad:PropTypes.number,
  subdivision:PropTypes.string,
  address:PropTypes.string
};
export default SecondPage;
