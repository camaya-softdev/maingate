import { useAtomValue } from 'jotai/utils';
import React from 'react';
import { scanDataAtom } from '../../../atoms';
import name from '../../../services/name';

const Welcome = () => {
  const scanData = useAtomValue(scanDataAtom);

  return (
    <>
      <p className="text-5xl mb-5">
        Hi {name(scanData.details)},
      </p>
      <p className="text-3xl">
        Please wait as we are validating your visit
      </p>
    </>
  );
};

export default Welcome;
