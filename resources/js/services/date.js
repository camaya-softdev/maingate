import dayjs from "dayjs";

export default (date, format = 'MMM D, YYYY') => dayjs(date).format(format);
