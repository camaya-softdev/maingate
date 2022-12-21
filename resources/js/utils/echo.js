import Echo from 'laravel-echo';
import Pusher from 'pusher-js'; // eslint-disable-line no-unused-vars

const echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.PUSHER_APP_KEY,
  cluster: process.env.PUSHER_APP_CLUSTER,
  forceTLS: true,
  wsHost: process.env.PUSHER_APP_HOST,
  wsPort: process.env.PUSHER_APP_HOST_PORT,
  wssPort: process.env.PUSHER_APP_HOST_PORT,
  disableStats: true,
  enabledTransports: ['ws','wss'],
});

export default echo;