import { atom } from "jotai";
import { atomWithReset, RESET } from "jotai/utils";

export const onHoldDataDefaultValueAtom = atomWithReset({});
export const onHoldDataAtom = atom(
  (get) => get(onHoldDataDefaultValueAtom),
  (get, set, object) => {
    let updatedValues = object;

    if (object === RESET) {
      updatedValues = {};
    }

    set(onHoldDataDefaultValueAtom, updatedValues);
  }
);