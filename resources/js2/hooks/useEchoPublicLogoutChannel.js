import { useAtom } from 'jotai';
import { useEffect } from 'react';
import echo from '../utils/echo';
import { userTokenAtom } from '../atoms';

const useEchoPublicLogoutChannel = ({ channel, event }) => {
  const [userToken, setUserToken] = useAtom(userTokenAtom);

  useEffect(() => {
    echo.channel(channel)
      .listen(event, (response) => {
        if (response.logout) {
          response.tokens.map(id => {
            const tokenId = new RegExp(`^${id}\\|`);

            if (tokenId.test(userToken)) {
              setUserToken(null);
            }

            return id;
          });
        }
      });
  }, []);
};

export default useEchoPublicLogoutChannel;