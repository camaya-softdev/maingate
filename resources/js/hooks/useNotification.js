import { notification } from 'antd';
import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';
import isEmpty from 'lodash/isEmpty';
import { useEffect } from 'react';
import { layoutAtom, notificationDataAtom, scanDataAtom,scanDataHoaAtom } from '../atoms';

const useNotification = () => {
  const [notificationData, setNotificationData] = useAtom(notificationDataAtom);
  const layout = useAtomValue(layoutAtom);
  const scanData = useAtomValue(scanDataAtom);
  const scanDataHoa = useAtomValue(scanDataHoaAtom);
  const notify = ({
    description,
    type,
    message = 'Kiosk',
    onClose = () => { }
  }) => notification[type]({
    message,
    description,
    onClose: () => {
      onClose();
      setNotificationData({});
    }
  });

  useEffect(() => {
    if (!isEmpty(notificationData)) {
      notify(notificationData);
    }
  }, [notificationData]);

  useEffect(() => {
    if (layout === 'security' && !isEmpty(scanData)) {
      setNotificationData({
        message: 'Kiosk',
        description: scanData.status === 'OK'
          ? 'Guest successfully scanned a valid code'
          : 'Guest scanned an invalid code',
        type: scanData.status === 'OK'
          ? 'success'
          : 'warning' });
    }
    if (layout === 'security' && !isEmpty(scanDataHoa)) {
      setNotificationData({
        message: 'KioskHoa',
        description: scanDataHoa.status === 'OK'
          ? 'Guest successfully scanned a valid code'
          : 'Guest successfully scanned a valid code',
        type: scanDataHoa.status === 'OK'
          ? 'success'
          : 'success' });
    }
  }, [layout, scanData,scanDataHoa]);
};

export default useNotification;
