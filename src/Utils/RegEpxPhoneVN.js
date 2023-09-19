export const RegEpxPhoneVN = (Phone) => {
    let regEx = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    return regEx.test(Phone);
}