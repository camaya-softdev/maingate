import { useEffect } from 'react';
import { useUpdateAtom } from 'jotai/utils';
import { kioskPageAtom } from '../atoms';

const useRedirectToHomeWithTimer = (seconds = 10) => {
  const setPage = useUpdateAtom(kioskPageAtom);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage('/');
    }, seconds * 1000);

    return () => clearTimeout(timer);
  }, []);

  return;
};

export default useRedirectToHomeWithTimer;