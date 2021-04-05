module.exports.getToday = () => {
  let date = new Date();
  let year = date.getFullYear();
  let month = ('0' + (1 + date.getMonth())).slice(-2);
  let day = ('0' + date.getDate()).slice(-2);

  return year + '-' + month + '-' + day;
};
