import React from "react";
// import useRedirectToHomeWithTimer from '../../../hooks/useRedirectToHomeWithTimer';
import { scanDataHoaAtom } from "../../../atoms";
import { useAtomValue } from "jotai/utils";
// import SlideShow from "./Slides/SlideShow";
import SecondPage from "./Pages/SecondPage";

const ValidCode = () => {
  const scanHoaData = useAtomValue(scanDataHoaAtom);
  const secondPage =
    scanHoaData.users.autogate.template.hoa_autogate_template_second_page;
  const footerSecondPage =
    scanHoaData.users.autogate.template
      .hoa_autogate_template_footer_second_page;
  const thirdPage =
    scanHoaData.users.autogate.template.hoa_autogate_template_third_page;
  const footerThirdPage =
    scanHoaData.users.autogate.template.hoa_autogate_template_footer_third_page;
  const fullName = scanHoaData.users.autogate.hoa_autogate_member_name;
  const balance = scanHoaData.billing === null ? '' : scanHoaData.billing.hoa_billing_total_cost;
  const duedate = scanHoaData.billing === null ? '' : scanHoaData.billing.hoa_billing_due_dates;
  const privilegeLoad = scanHoaData.users.card[0].hoa_rfid_reg_privilege_load;
  const subdivision = scanHoaData.users.autogate.hoa_autogate_subdivision_name;
  const address =
    "Block Number" +
    " " +
    scanHoaData.lot.hoa_subd_lot_block +
    " lot Number " +
    scanHoaData.lot.hoa_subd_lot_num;
  return (
    <>
      <div>
        <SecondPage
          secondPage={secondPage}
          footerSecondPage={footerSecondPage}
          thirdPage={thirdPage}
          footerThirdPage={footerThirdPage}
          fullName={fullName}
          balance={balance}
          duedate={duedate}
          privilegeLoad={privilegeLoad}
          subdivision={subdivision}
          address={address}
        />
      </div>
    </>
  );
};

export default ValidCode;
