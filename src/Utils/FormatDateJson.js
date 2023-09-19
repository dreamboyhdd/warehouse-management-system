export const FormatDateJson = (date, key = 0) => {
    if (date === undefined) {
        let data = 'N/A'
        return data;
    }
    if (date === "" || date === null) {
        let a = ''
        return a;
    }
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        h = d.getHours(),
        m = d.getMinutes(),
        s = d.getSeconds()

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;


    // 0 Lấy Tháng/ngày/năm Giờ:phut:Giây
    // 1 Lấy Tháng/ngày/năm
    // 2 Lấy Năm/Tháng

    if (key === 0)
        return [month, day, year].join('/') + ' ' + [h, m, s].join(':');
    else if (key === 2)
        return [year, month].join('-');
    else if (key === 3)
        return [day, month, year].join('/') + ' ' + [h, m].join(':');
    else if (key === 4)
        return [month, year].join('-');
    else if (key === 5)
        return [day, month, year].join('/');
    else
        return [month, day, year].join('/');

}