import { atom } from "jotai";
import React from 'react';

export const drawerConfigAtom = atom(
  {
    afterVisibleChange: ()=>{},
    children: <></>,
    footer: <></>,
    onClose: ()=>{},
    placement: 'right',
    title: 'Drawer',
    width: window.innerWidth > 720 ? 720 : '100%',
  },
  (get, set, config) => {
    set(drawerConfigAtom, { ...get(drawerConfigAtom), ...config });
  }
);

export const showDrawerAtom = atom(false);