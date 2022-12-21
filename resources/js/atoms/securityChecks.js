import { atom } from "jotai";
import { atomWithReset, RESET } from "jotai/utils";
import map from "lodash/map";
import keys from "lodash/keys";
import setWith from "lodash/setWith";

const setToTrue = (keysToChange, defaultValues = {}) => {
  let updatedDefaultValues = defaultValues;

  map(keysToChange, key => {
    updatedDefaultValues[key] = true;
    return key;
  });

  return updatedDefaultValues;
};

const setToFalse = (keysToChange, defaultValues = {}) => {
  let updatedDefaultValues = defaultValues;

  map(keysToChange, key => {
    updatedDefaultValues[key] = false;
    return key;
  });

  return updatedDefaultValues;
};

export const bookingDetailsAtom = atom(
  {
    1: false, //name
    2: false, //referenceNumber
    3: false, //balance
    4: false, //dateVisit
    5: false, //vehicle
    6: false, //pax
    7: false, //tags
  },
  (get, set, keysToChange) => {
    const updatedValues = setToTrue(keysToChange, setToFalse(keys(get(bookingDetailsAtom))));
    set(bookingDetailsAtom, updatedValues);
  }
);
export const guestListDefaultValueAtom = atom(
  {},
  (get, set, defaultValue) => {
    set(guestListDefaultValueAtom, setToFalse(defaultValue));
    set(guestListAtom, []);
  });
export const guestListAtom = atom(
  {},
  (get, set, keysToChange) => {
    const updatedValues = setToTrue(keysToChange, setToFalse(keys(get(guestListDefaultValueAtom))));
    set(guestListAtom, updatedValues);
  });
export const customChecklistDefaultValueAtom = atom(
  {},
  (get, set, defaultValue) => {
    set(customChecklistDefaultValueAtom, setToFalse(defaultValue));
    set(customChecklistAtom, []);
  });
export const customChecklistAtom = atom(
  {},
  (get, set, keysToChange) => {
    const updatedValues =
      setToTrue(keysToChange, setToFalse(keys(get(customChecklistDefaultValueAtom))));
    set(customChecklistAtom, updatedValues);
  });
export const actionTakenDefaultValueAtom = atomWithReset(
  {
    guests: {
    },
    booking: {
      1: '', //name
      2: '', //referenceNumber
      3: '', //balance
      4: '', //dateVisit
      5: '', //vehicle
      6: '', //pax
      7: '', //tags
    },
  }
);
export const actionTakenValueAtom = atom(
  (get) => get(actionTakenDefaultValueAtom),
  (get, set, object) => {
    let updatedValues;

    if (object === RESET) {
      updatedValues = {
        guests: {
        },
        booking: {
          1: '', //name
          2: '', //referenceNumber
          3: '', //balance
          4: '', //dateVisit
          5: '', //vehicle
          6: '', //pax
          7: '', //tags
        },
      };
    } else {
      const actionTaken = get(actionTakenDefaultValueAtom);
      updatedValues = setWith(actionTaken, object.path, object.value);
    }

    set(actionTakenDefaultValueAtom, updatedValues);
  }
);
export const guestVehiclesValueAtom = atomWithReset([]);
export const guestAssignedVehiclesDefaultValueAtom = atomWithReset({});
export const guestAssignedVehiclesValueAtom = atom(
  (get) => get(guestAssignedVehiclesDefaultValueAtom),
  (get, set, object) => {
    let updatedValues;

    if (object === RESET) {
      updatedValues = {};
    } else {
      const actionTaken = get(guestAssignedVehiclesDefaultValueAtom);
      updatedValues = setWith(actionTaken, object.path, object.value);
    }

    set(guestAssignedVehiclesDefaultValueAtom, updatedValues);
  }
);
export const guestAdditionalVehiclesValueAtom = atomWithReset([]);
export const guestAdditionalGuestValueAtom = atomWithReset([]);