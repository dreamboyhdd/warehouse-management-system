export const DayInWeek = (Key) => {
    debugger
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var now = new Date();
    var Thu = days[now.getDay()];
    var month = months[now.getMonth()];
    if (Key === 1)
        return Thu;
    if (Key === 2)
        return month;
    if (Key === 3)
        return String(now.getDate()).padStart(2, '0');;

};