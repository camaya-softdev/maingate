// route auth
export { default as Private } from './Private';
export { default as Public } from './Public';

// layout
import { Kiosk, Security,KioskHoa } from '../Layouts';

// pages
import Scan from '../Views/Kiosk/Scan';
import Welcome from '../Views/Kiosk/Welcome';
import WelcomeHoa from "../Views/KioskHoa/WelcomHoa";
import InvalidCode from '../Views/Kiosk/InvalidCode';
import InvalidHoaCode from '../Views/KioskHoa/InvalidHoaCode';
import ValidCode from '../Views/Kiosk/ValidCode';
import ValidHoaCode from '../Views/KioskHoa/ValidHoaCode';
import HoldingArea from '../Views/Kiosk/HoldingArea';
import DashboardSecurity from '../Views/Security/Dashboard';
import GuestSecurity from '../Views/Security/Guest';
import OnHoldSecurity from '../Views/Security/OnHold';
import TapHistorySecurity from '../Views/Security/TapHistory';
import Transaction from '../Views/Security/Transaction';
import TransactionHoa from "../Views/Security/TransactionHoa";
import AdminSecurity from '../Views/Security/Admin';
import Logout from './Logout';

const routes = [
  {
    path: '/welcome',
    component: Welcome,
    layout: Kiosk,
    public: true,
  },
  {
    path: '/welcome-hoa',
    component: WelcomeHoa,
    layout: KioskHoa,
    public: true,
  },
  {
    path: '/invalid-code',
    component: InvalidCode,
    layout: Kiosk,
    public: true,
  },
  {
    path: '/invalid-code-hoa',
    component: InvalidHoaCode,
    layout: KioskHoa,
    public: true,
  },
  {
    path: '/valid-code',
    component: ValidCode,
    layout: Kiosk,
    public: true,
  },
  {
    path: '/valid-code-hoa',
    component: ValidHoaCode,
    layout: KioskHoa,
    public: true,
  },
  {
    path: '/holding-area',
    component: HoldingArea,
    layout: Kiosk,
    public: true,
  },
  {
    path: '/logout',
    component: Logout,
    layout: ({ children }) => children,
    public: true,
  },
  {
    path: '/guest',
    component: GuestSecurity,
    layout: Security,
    public: false,
  },
  {
    path: '/on-hold',
    component: OnHoldSecurity,
    layout: Security,
    public: false,
  },
  {
    path: '/taps',
    component: TapHistorySecurity,
    layout: Security,
    public: false,
  },
  {
    path: '/transactions',
    component: Transaction,
    layout: Security,
    public: false,
  },
  {
    path: '/transactions-hoa',
    component: TransactionHoa,
    layout: Security,
    public: false,
  },
  {
    path: '/admin',
    component: AdminSecurity,
    layout: Security,
    public: false,
  },
  {
    path: '/concierge',
    component: DashboardSecurity,
    layout: Security,
    public: false,
  },
  //put the default page at the bottom
  {
    path: '/',
    component: Scan,
    layout: Kiosk,
    public: false,
  },
];

// if (/^https?:\/\/concierge.maingate.site.lan/.test(window.location.href)) {
//   //put the default page at the bottom
//   routes.push(
//     {
//       path: '/',
//       component: DashboardSecurity,
//       layout: Security,
//       public: false,
//     }
//   );
// } else if (/^https?:\/\/maingate.site.lan/.test(window.location.href)) {
//   routes.push(
//     {
//       path: '/concierge',
//       component: DashboardSecurity,
//       layout: Security,
//       public: false,
//     }
//   );
//   //put the default page at the bottom
//   routes.push(
//     {
//       path: '/',
//       component: Scan,
//       layout: Kiosk,
//       public: true,
//     }
//   );
// } else {
//   routes.push(
//     {
//       path: '/dashboard',
//       component: DashboardSecurity,
//       layout: Security,
//       public: false,
//     }
//   );
//   //put the default page at the bottom
//   routes.push(
//     {
//       path: '/',
//       component: Scan,
//       layout: Kiosk,
//       public: true,
//     }
//   );
// }

export default routes;