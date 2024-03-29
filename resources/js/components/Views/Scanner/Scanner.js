import React, { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import { useHistory } from "react-router-dom";
import { scanGateAccess, verifyReferenceCode } from "../../../services/api";
import dayjs from "dayjs";
import { useUpdateAtom } from "jotai/utils";
import { scanDataMobileAtom } from "../../../atoms";

const Scanner = () => {
  const verifyReferenceCodeAPI = verifyReferenceCode();
  const navigate = useHistory();
  const setScanDataMobile = useUpdateAtom(scanDataMobileAtom);
  const scanGateAccessAPI = scanGateAccess();
  const [data, setData] = useState("No result");
  const [verifySuccess, setVerifySuccess] = useState(false);
  // const [errorCode, setErrorCode] = useState('');
  const onResult = result => {
    if (result) {
      let values = {
        secret_token: process.env.MANUAL_SECRET_TOKEN,
        kiosk_id: process.env.MANUAL_KIOSK_ID,
        interface: process.env.MANUAL_INTERFACE,
        mode: process.env.MANUAL_MODE,
        code: result?.text,
        timestamp: dayjs().format("YYYY-MM-DD HH:mm:ss")
      };
      setData(values);
      verifyReferenceCodeAPI.mutate(values);

      setVerifySuccess(false);
    }
  };


  useEffect(() => {
    if (data.code) {
      if (verifyReferenceCodeAPI.isSuccess && !verifySuccess) {
        scanGateAccessAPI.mutate(data);
        setVerifySuccess(true);
      }
      if (verifyReferenceCodeAPI.isError) {
        setScanDataMobile(verifyReferenceCodeAPI.error.response.data);
      }
      return;
    }

  }, [verifyReferenceCodeAPI]);

  useEffect(()=>{
    if(verifyReferenceCodeAPI.isSuccess){
      setScanDataMobile(verifyReferenceCodeAPI.data.data.data);
    }
  },[verifyReferenceCodeAPI.isSuccess]);

  return (
    <>
      <h3 className="text-blue-500 text-center">Please Scan Qrcode</h3>
      <QrReader
        onResult={onResult}
        constraints={{ facingMode: 'environment' }} //if you want front camera use 'user'
        className="m-3 rounded-lg border-gray-600"
        style={{ width: "50%", height: "50%" }}
      ></QrReader>

      {/* <p className="text-center text-red-500">{errorCode}</p> */}

    </>
  );
};

export default Scanner;
