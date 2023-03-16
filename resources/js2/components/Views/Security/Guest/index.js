import React from "react";
import { barrierAtom, scanDataAtom, scanDataHoaAtom } from "../../../../atoms";
import { useAtomValue } from "jotai/utils";
import isEmpty from "lodash/isEmpty";
import Loading from "./Loading";
import ValidVerification from "./ValidVerification";
import ValidHoaVerification from "./ValidHoaVerification";
import InvalidVerification from "./InvalidVerification";
import OpenBarrier from "./OpenBarrier";

const Index = () => {
  const scanData = useAtomValue(scanDataAtom);
  const scanDataHoa = useAtomValue(scanDataHoaAtom);
  const barrierData = useAtomValue(barrierAtom);
  return (
    <>
      {barrierData && <OpenBarrier />}
      {!barrierData && isEmpty(scanData) && isEmpty(scanDataHoa) && <Loading />}
      {!barrierData && !isEmpty(scanData) && isEmpty(scanDataHoa) && scanData.status === "OK" &&
        <ValidVerification />
      }
      {!barrierData && !isEmpty(scanDataHoa)&& isEmpty(scanData) && scanDataHoa.status === "OK" &&
        <ValidHoaVerification />
      }
      {!barrierData && !isEmpty(scanData) && scanData.status !== "OK" &&
        <InvalidVerification />
      }
      {!barrierData && !isEmpty(scanDataHoa) && scanDataHoa.status !== "OK" &&
        <InvalidVerification />
      }
    </>
  );
};

export default Index;
