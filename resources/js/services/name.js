import isEmpty from "lodash/isEmpty";

export default (data) => isEmpty(data)  
  ? null
  : `${data.first_name} ${data.last_name}`;