import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { layoutAtom, onHoldCounterAtom, userTokenAtom } from "../atoms";
import { getOnHoldCounter } from "../services/api";

const useOnHoldCounter = () => {
  const setOnHoldCounter = useUpdateAtom(onHoldCounterAtom);
  const layout = useAtomValue(layoutAtom);
  const userToken = useAtomValue(userTokenAtom);

  getOnHoldCounter({
    options: {
      enabled: !!userToken && layout === 'security',
      onSuccess: (data) => setOnHoldCounter(data.data),
    }
  });
};

export default useOnHoldCounter;