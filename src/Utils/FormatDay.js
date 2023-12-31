export const  FormatDay= (date) => {
    if(date === undefined){
        let data = 'N/A'
        return data;
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
        return [month, day,year].join('/');
}