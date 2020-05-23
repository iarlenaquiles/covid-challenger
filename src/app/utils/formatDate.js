const { format, parseISO } = require("date-fns");

formatDate = date => {
  let result = format(parseISO(date), "yyyy-MM-dd");
  return result;
};

module.exports = formatDate;
