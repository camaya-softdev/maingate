import { atom } from "jotai";

export const userTokenAtom = atom(
  localStorage.getItem('userToken'),
  (get, set, token) => {
    if (token) localStorage.setItem('userToken', token);
    else localStorage.removeItem('userToken');
    set(userTokenAtom, token);
  }
);
