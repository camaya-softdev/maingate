import React from "react";
import PropTypes from "prop-types";
// import useRedirectToHomeWithTimer from '../../../hooks/useRedirectToHomeWithTimer';

const ThirdPage = props => {
  // useRedirectToHomeWithTimer();

  return (
    <>
      <p className="text-9xl mb-5 text-white">{props.thirdPage}</p>
      <p className="text-7xl text-white">
        {props.footerThirdPage}
      </p>
    </>
  );
};

ThirdPage.propTypes = {
  thirdPage: PropTypes.string,
  footerThirdPage: PropTypes.string
};
export default ThirdPage;
