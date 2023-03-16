
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { useState, useEffect, useMemo } from "react";
import {
  kioskPageAtom,
  layoutAtom,
  scanDataAtom,
  scanDataHoaAtom,
  scanMessageAtom,
} from "../atoms";
import echo from "../utils/echo";

const useEchoPublicChannel = ({ channel, event }) => {

  const [channelResponse, setChannelResponse] = useState(null);
  const memoizedChannelResponse = useMemo(() => channelResponse, [
    channelResponse
  ]);
  const layout = useAtomValue(layoutAtom);
  const setPage = useUpdateAtom(kioskPageAtom);
  const setScanData = useUpdateAtom(scanDataAtom);
  const setScanDataHoa = useUpdateAtom(scanDataHoaAtom);
  const setScanMessage = useUpdateAtom(scanMessageAtom);


  useEffect(() => {
    echo.channel(channel).listen(event, response => {
      setChannelResponse(response);
    });
  }, []);

  useEffect(() => {

    if (layout === "kiosk" && memoizedChannelResponse ) {
      if (memoizedChannelResponse.page === "reload") {
        setPage("/");
        setTimeout(() => {
          location.reload();
        }, 1000);
        return;
      }

      setScanMessage(memoizedChannelResponse.message);
      if(memoizedChannelResponse.data){

        if(Object.keys(memoizedChannelResponse?.data.users).length !== 0){
          setScanDataHoa(memoizedChannelResponse.data);
        }
        else{
          setScanData(memoizedChannelResponse.data);
        }
      }

      setPage(memoizedChannelResponse.page);
    }


    if (layout === "security") {
      if(memoizedChannelResponse?.data){
        if(Object.keys(memoizedChannelResponse?.data.users).length !== 0){
          setScanDataHoa(memoizedChannelResponse?.data);
        }
        else{
          setScanData(memoizedChannelResponse?.data);
        }
      }

    }
  }, [layout, memoizedChannelResponse]);
};

export default useEchoPublicChannel;
