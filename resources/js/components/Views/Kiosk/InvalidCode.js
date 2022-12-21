import React from 'react';
import { useAtomValue } from 'jotai/utils';
import { scanMessageAtom } from '../../../atoms';
import { isEmpty } from 'lodash';
// import useRedirectToHomeWithTimer from '../../../hooks/useRedirectToHomeWithTimer';

const InvalidCode = () => {
  const scanMessage = useAtomValue(scanMessageAtom);
  // useRedirectToHomeWithTimer();

  return (
    <>
      <p className="font-semibold text-6xl mb-5 text-red-500">
      Code is invalid
      </p>
      <p className="text-3xl">
        {! isEmpty(scanMessage) && scanMessage}
      </p>
    </>
  );
};

export default InvalidCode;
