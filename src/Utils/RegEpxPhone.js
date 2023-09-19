export const RegEpxPhone = (Phone) => {
    debugger
    let regEx = /(84|0[1|2|3|4|5|6|7|8|9])+([0-9]{8,})\b/g;
    return regEx.test(Phone);
}