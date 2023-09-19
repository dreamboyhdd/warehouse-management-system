export const DateDiff = (FromDate, ToDate) => {
  let dt1 = new Date(FromDate);
  let dt2 = new Date(ToDate);
  return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
  /* if (key == 1) { // khoảng cách ngày
    let CheckDay = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
    return CheckDay;
  }
  if (key == 2) { // khoảng cách tháng
    var months;
    months = (dt2.getFullYear() - dt1.getFullYear()) * 12;
    months -= dt1.getMonth();
    months += dt2.getMonth();
    return months <= 0 ? 0 : months;
  } */

};