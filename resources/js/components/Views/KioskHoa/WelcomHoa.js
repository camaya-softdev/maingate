/* eslint-disable max-len */
import { useAtomValue } from 'jotai/utils';
import React from 'react';
import { scanDataHoaAtom } from '../../../atoms';


const WelcomeHoa = () => {
  const scanHoaData = useAtomValue(scanDataHoaAtom);
  return (
    <>
      <p className="text-white">
        <span className="text-9xl md:text-7xl sm:text-5xl ">WELCOME </span><span className="text-9xl  md:text-7xl sm:text-5xl ">{scanHoaData.users.autogate.hoa_autogate_member_name.toUpperCase()}</span>,
      </p>
      <p className="text-white">
        <span className="text-5xl md:text-5xl sm:text-3xl ">OF </span><span className="text-5xl md:text-5xl sm:text-3xl">{scanHoaData.users.autogate.hoa_autogate_subdivision_name.toUpperCase()} SUBDIVISION!</span></p>
      <p className="text-3xl md:text-3xl sm:text-3xl text-white">
        {scanHoaData.users.autogate.template.hoa_autogate_template_footer}
      </p>
    </>
  );
};

export default WelcomeHoa;
