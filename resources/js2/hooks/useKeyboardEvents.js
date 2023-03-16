import chunk from "lodash/chunk";
import dayjs from "dayjs";
import join from "lodash/join";
import last from "lodash/last";
import { useAtomValue } from "jotai/utils";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce/lib";
import { layoutAtom } from "../atoms";
import { manualGateAccess, scanLog } from "../services/api";

const useKeyboardEvents = () => {
  const [scanText, setScanText] = useState('');
  const [debouncedScanText, debounceFn] = useDebounce(scanText, 1000);
  const manualGateAccessAPI = manualGateAccess();
  const scanLogAPI = scanLog();
  const layout = useAtomValue(layoutAtom);

  useEffect(() => {
    let code = '';

    if (debouncedScanText) {
      let debouncedCode = debouncedScanText;
      const debouncedCodeLength = debouncedCode.length;
      const isNotNumber = (n) => !/^\d+$/.test(n);

      // double tap fix
      if (debouncedCodeLength > 10 && debouncedCodeLength <= 20 && isNotNumber(debouncedCode)) {
        const chunkCode = chunk(debouncedCode, debouncedCodeLength / 2);
        const lastCode = last(chunkCode);
        debouncedCode = join(lastCode, '') ;
      }

      // triple tap fix
      if (debouncedCodeLength > 20 && debouncedCodeLength <= 30 && isNotNumber(debouncedCode)) {
        const chunkCode = chunk(debouncedCode, debouncedCodeLength / 3);
        const lastCode = last(chunkCode);
        debouncedCode = join(lastCode, '') ;
      }

      const values = {
        code: debouncedCode,
        secret_token: process.env.MANUAL_SECRET_TOKEN,
        kiosk_id: process.env.MANUAL_KIOSK_ID,
        interface: process.env.MANUAL_INTERFACE,
        mode: process.env.MANUAL_MODE,
        timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      };

      if (layout === 'kiosk') {
        manualGateAccessAPI.mutate(values);
      }

      code = '';
      setScanText('');
    }

    window.addEventListener('keypress', e => {
      if (e.key.length > 1) {
        return;
      }

      code = `${code}${e.key}`;
      setScanText(code);
    });

    return () => {
      code = '';
      setScanText('');
      debounceFn.cancel;
    };
  }, [layout, debouncedScanText]);

  useEffect(() => {
    if (layout === 'kiosk') {
      if (manualGateAccessAPI.isSuccess) {
        const values = {
          code: manualGateAccessAPI.variables.code,
          status: manualGateAccessAPI.data.data.status,
          status_message: manualGateAccessAPI.data.data.status_message,
          timestamp: manualGateAccessAPI.variables.timestamp,
        };

        scanLogAPI.mutate(values);
        manualGateAccessAPI.reset();
      }

      if (manualGateAccessAPI.isError) {
        const values = {
          code: manualGateAccessAPI.variables.code,
          status: manualGateAccessAPI.error.response.data.status,
          status_message: manualGateAccessAPI.error.response.data.status_message,
          timestamp: manualGateAccessAPI.variables.timestamp,
        };

        scanLogAPI.mutate(values);
        manualGateAccessAPI.reset();
      }
    }
  }, [layout, manualGateAccessAPI]);
};

export default useKeyboardEvents;