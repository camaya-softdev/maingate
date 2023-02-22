import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  useQueryClient
} from "react-query";
import axios from "../utils/axios";
import merge from "lodash/merge";
import dayjs from "dayjs";

const post = (url, values) => axios.post(url, values);
const get = url => axios.get(url);
const remove = url => axios.delete(url);
const put = (url, values) => axios.put(url, values);

export const queryClient = () => useQueryClient();
export const postLogin = (url = "/api/login") =>
  useMutation(values => post(url, values));
export const getLogout = (url = "/api/logout") => useMutation(() => get(url));
export const scanValid = (url = "/api/security-checks/valid-code") =>
  useMutation(values => post(url, values));

export const scannerValid = (url = "/api/security-checks/scanner-valid-code") =>
  useMutation(values => post(url, values));

export const scanHoldingArea = ({
  url = "/api/security-checks/holding-area",
  queryClient = useQueryClient()
} = {}) =>
  useMutation(values => post(url, values), {
    onSuccess: () => queryClient.invalidateQueries("on-hold-counter")
  });

export const clearScreen = (url = "/api/security-checks/clear-cache") =>
  useMutation(() => get(url));

export const scanerHoldingArea = ({
  url = "/api/security-checks/scanner-holding-area",
  queryClient = useQueryClient()
} = {}) =>
  useMutation(values => post(url, values), {
    onSuccess: () => queryClient.invalidateQueries("on-hold-counter")
  });

export const scanHoaValid = (url = "/api/security-checks-hoa/valid-code") =>
  useMutation(values => post(url, values));

export const scanHoldingHoaArea = ({
  url = "/api/security-checks-hoa/holding-area",
  queryClient = useQueryClient()
} = {}) =>
  useMutation(values => post(url, values), {
    onSuccess: () => queryClient.invalidateQueries("on-hold-counter")
  });

export const kioskDefaultPage = (url = "/ws") => useMutation(() => get(url));
export const kioskDefaultPageWithTimer = (url = "/ws-with-timer") =>
  useMutation(() => get(url));
export const kioskReloadPage = (url = "/ws/reload") =>
  useMutation(() => get(url));
export const syncTable = (url = "/sync-table") => useMutation(() => get(url));
export const syncHoaTables = (url = "/hoa-sync-table") =>
  useMutation(() => get(url));
export const getGuests = ({
  date,
  url = `/api/guests?date=${dayjs(date).format("YYYY-MM-DD")}`,
  params,
  name = ["guest", "todays"]
} = {}) =>
  useQuery(name, () => get(`${url}${params ? `?${params}` : ""}`), {
    refetchInterval: 1000 * 30,
    refetchOnWindowFocus: false
  });
export const getTaps = ({
  url = "/api/taps",
  name = "taps",
  limit = 10
} = {}) =>
  useInfiniteQuery(
    name,
    ({ pageParam = 1 }) => get(`${url}?page=${pageParam}&limit=${limit}`),
    {
      getNextPageParam: lastPage =>
        lastPage.data.next_page_url ? lastPage.data.current_page + 1 : null
    }
  );
export const getCustomChecklists = ({
  url = "/api/custom-checklists",
  name = "custom-checklists"
} = {}) =>
  useQuery(name, () => get(`${url}`), {
    refetchInterval: 60000 * 5,
    refetchOnWindowFocus: false
  });
export const postCustomChecklist = ({
  url = "/api/custom-checklists",
  name = "custom-checklists",
  queryClient
} = {}) =>
  useMutation(values => post(url, values), {
    onSuccess: () => queryClient.invalidateQueries(name)
  });
export const putCustomChecklist = ({
  url = "/api/custom-checklists",
  name = "custom-checklists",
  queryClient
} = {}) =>
  useMutation(({ values, id }) => put(`${url}/${id}`, values), {
    onSuccess: () => queryClient.invalidateQueries(name)
  });
export const deleteCustomChecklist = ({
  url = "/api/custom-checklists",
  name = "custom-checklists",
  queryClient
} = {}) =>
  useMutation(id => remove(`${url}/${id}`), {
    onSuccess: () => queryClient.invalidateQueries(name)
  });
export const getSecurityChecks = ({
  url = "/api/security-checks",
  name = "security-checks"
} = {}) =>
  useQuery(name, () => get(`${url}`), {
    refetchInterval: 1000 * 5,
    refetchOnWindowFocus: false
  });
export const putSecurityChecks = ({
  url = "/api/security-checks",
  name = "security-checks",
  queryClient = useQueryClient()
} = {}) =>
  useMutation(({ values, id }) => put(`${url}/${id}`, values), {
    onSuccess: () => {
      queryClient.invalidateQueries(name);
      queryClient.invalidateQueries("on-hold-counter");
    }
  });
export const getSecurityDashboard = ({
  date,
  url = `/api/security-dashboard?date=${dayjs(date).format("YYYY-MM-DD")}`,
  name = "security-dashboard"
} = {}) =>
  useQuery(name, () => get(`${url}`), {
    refetchInterval: 1000 * 30,
    refetchOnWindowFocus: false
  });
export const getCheckKioskData = (url = "/api/check-kiosk-data") =>
  useMutation(() => get(url));
export const postGuestVehicle = ({ url = "/api/vehicles" } = {}) =>
  useMutation(values => post(url, values));
export const putGuestVehicle = ({ url = "/api/vehicle" } = {}) =>
  useMutation(({ values, bookingReferenceNumber }) =>
    bookingReferenceNumber
      ? put(`${url}/${bookingReferenceNumber}`, values)
      : put(url, values)
  );
export const getKioskBarrierRedirectTimer = ({
  url = "/api/settings/kiosk-barrier-redirect-timer",
  sec = true,
  options = {}
}) => useMutation(() => sec ? get(url) : get(`${url}/0`), options);
export const putKioskBarrierRedirectTimer = ({
  url = "/api/settings/kiosk-barrier-redirect-timer",
  options = {}
} = {}) => useMutation(values => put(url, values), options);
export const getOnHoldCounter = ({
  url = "/api/on-hold/counter",
  name = "on-hold-counter",
  options = {}
} = {}) =>
  useQuery(
    name,
    () => get(`${url}`),
    merge(
      {
        refetchInterval: 1000 * 30,
        refetchOnWindowFocus: false
      },
      options
    )
  );
export const getTransactions = ({
  url = "/api/transactions",
  name = "transactions",
  limit = 10
} = {}) =>
  useInfiniteQuery(
    name,
    ({ pageParam = 1 }) => get(`${url}?page=${pageParam}&limit=${limit}`),
    {
      getNextPageParam: lastPage =>
        lastPage.data.next_page_url ? lastPage.data.current_page + 1 : null
    }
  );

export const getHoaTransactions = ({
  url = "/api/hoa-transactions",
  name = "hoaTransactions",
  limit = 10
} = {}) =>
  useInfiniteQuery(
    name,
    ({ pageParam = 1 }) => get(`${url}?page=${pageParam}&limit=${limit}`),
    {
      getNextPageParam: lastPage =>
        lastPage.data.next_page_url ? lastPage.data.current_page + 1 : null
    }
  );

export const verifyReferenceCode = ({
  url = "/api/on-hold/gate-access"
} = {}) => useMutation(values => post(url, values));

export const manualGateAccess = ({
  url = "/api/auto-gate/v1/gate-access"
} = {}) => useMutation(values => post(url, values));

export const scanGateAccess = ({
  url = "/api/auto-gate/v1/scan-gate-access"
} = {}) => useMutation(values => post(url, values));

export const scanLog = ({ url = "/api/scan-log" } = {}) =>
  useMutation(values => post(url, values));
