import { useEffect } from 'react';
import { userTokenAtom } from '../../atoms';
import { useHistory } from 'react-router';
import { useAtom } from 'jotai';

const Logout = () => {
  const [userToken, setUserToken] = useAtom(userTokenAtom);
  const history = useHistory();

  useEffect(() => {
    if (!userToken) {
      history.push('/');
      return;
    }

    setTimeout(() => {
      setTimeout(() => {setUserToken(null);}, 500);
      history.push('/');
    }, 1000);
  }, []);

  return userToken ? 'Logging out...' : '';
};

export default Logout;
