import { Drawer as AntDDrawer } from 'antd';
import { useAtomValue } from 'jotai/utils';
import React from 'react';
import { drawerConfigAtom, showDrawerAtom } from '../atoms';

const Drawer = () => {
  const showDrawer = useAtomValue(showDrawerAtom);
  const drawerConfig = useAtomValue(drawerConfigAtom);

  return (
    <AntDDrawer
      afterVisibleChange={drawerConfig.afterVisibleChange}
      footer={drawerConfig.footer}
      onClose={drawerConfig.onClose}
      placement={drawerConfig.placement}
      title={drawerConfig.title}
      visible={showDrawer}
      width={drawerConfig.width}
    >
      {drawerConfig.children}
    </AntDDrawer>
  );
};

export default Drawer;
