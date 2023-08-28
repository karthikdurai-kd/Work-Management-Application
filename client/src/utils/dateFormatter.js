// This function is used to format date

import moment from "moment";

export const dateFormatter = (data) => {
  return moment(data).format("MMMM Do YYYY, h:mm A"); // Format here - [September 25 2023, 12:34 PM]
};

export const dateFormatterWithoutTime = (data) => {
  return moment(data).format("MMMM Do YYYY"); // Format here - [September 25 2023, 12:34 PM]
};
