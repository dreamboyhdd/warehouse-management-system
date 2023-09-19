export const FormatNumber = (num) => {
    if (num === null || num === "" || typeof num === 'undefined')
        num = '';
    if (num === '') return num;
    let val
    if (typeof num === 'string') {
        val = num.replaceAll(',', '');
    } else { val = num }
    let number = parseInt(val).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    if (number === "NaN") {
        number = "0"
    }

    return number.replaceAll('.', ',')
};