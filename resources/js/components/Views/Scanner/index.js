import React from "react";
import Scanner from "./Scanner";
import { barrierAtom, scanDataMobileAtom, } from "../../../atoms";
import { useAtomValue } from "jotai/utils";
import isEmpty from "lodash/isEmpty";
import ValidVerification from "./ValidVerification";
import InvalidVerification from "./InvalidVerification";
import OpenBarrier from "./OpenBarrier";


const Index = () =>{
  const scanDataMobile = useAtomValue(scanDataMobileAtom);
  const barrierData = useAtomValue(barrierAtom);
  return(
    <>
      {barrierData && <OpenBarrier />}

      {!barrierData && isEmpty(scanDataMobile) && <Scanner />}
      {!barrierData && !isEmpty(scanDataMobile) && scanDataMobile.status === "OK" &&
        <ValidVerification />
      }
      {!barrierData && !isEmpty(scanDataMobile) && scanDataMobile.status !== "OK" &&
        <InvalidVerification />
      }
    </>
  );
};

export default Index;