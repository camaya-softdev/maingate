import { Button, Typography } from "antd";
import { useAtomValue, useUpdateAtom, useResetAtom } from "jotai/utils";
import React, { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import {
  barrierAtom,
  kioskBarrierRedirectTimerAtom,
  scanDataAtom,
  scanDataHoaAtom
} from "../../../../atoms";
import { kioskDefaultPageWithTimer } from "../../../../services/api";

const OpenBarrier = () => {
  const kioskDefaultPageWithTimerAPI = kioskDefaultPageWithTimer();
  const setBarrier = useUpdateAtom(barrierAtom);
  const kioskBarrierRedirectTimer = useAtomValue(kioskBarrierRedirectTimerAtom);
  const [redirecting, setRedirecting] = useState(false);
  const [isScanDataEmpty, setIsScanDataEmpty] = useState(false);
  const [redirectKiosk, setRedirectKiosk] = useState(false);
  const scanData = useAtomValue(scanDataAtom);
  const scanDataHoa = useAtomValue(scanDataHoaAtom);
  const scanDataReset = useResetAtom(scanDataAtom);
  const scanDataHoaReset = useResetAtom(scanDataHoaAtom);
  const onOk = () => {
    setRedirectKiosk(true);
  };

  useEffect(() => {

    if (isEmpty(scanData) && !isEmpty(scanDataHoa)) {
      setIsScanDataEmpty(true);
    } else if (isEmpty(scanDataHoa) && !isEmpty(scanData)) {
      setIsScanDataEmpty(true);
    }

    if (isScanDataEmpty && !scanData) {
      setBarrier(false);
    } else if (isScanDataEmpty && !scanDataHoa) {
      setBarrier(false);
    }

    let timer = "";

    if (redirectKiosk) {
      setRedirecting(true);
      kioskDefaultPageWithTimerAPI.mutate();

      timer = setTimeout(function() {
        setBarrier(false);
        scanDataHoaReset();
        scanDataReset();
      }, kioskBarrierRedirectTimer);
    }

    return () => {
      timer && clearTimeout(timer);
    };
  }, [redirectKiosk, scanData, scanDataHoa, isScanDataEmpty]);

  useEffect(() => {
    return () => {
      setBarrier(false);
    };
  }, []);

  return (
    <div className="flex h-auto min-h-full w-full p-5">
      <div className="flex items-center bg-white w-full">
        <div className="text-center text-3xl w-full py-5 px-1">
          <p className="mb-0">Please Open Barrier</p>
          <p className="mb-2">
            <Typography.Text type="secondary">
              <small>click &lsquo;OK&rsquo; for next transaction</small>
            </Typography.Text>
          </p>
          <Button
            className="px-12"
            onClick={onOk}
            size="large"
            type="primary"
            loading={redirecting}
          >
            {redirecting
              ? `Please wait. Redirecting kiosk display in ${kioskBarrierRedirectTimer /
                  1000} secs`
              : "OK"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OpenBarrier;
