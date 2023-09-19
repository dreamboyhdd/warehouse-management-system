export const FormatMoney = (num, fix) => {
    if (num === null || typeof num === 'undefined')
        num = 0;
    if (num === 0) return num;

    var p = num.toFixed(fix);

    if (p < 1000) return (p + "").replace(".", ",");

    return p.split("").reverse().reduce(function (acc, num, i, orig) {
        return num + (i && !(i % 3) ? "," : "") + acc;
    }, "");

};