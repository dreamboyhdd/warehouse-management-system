export const  DecodeString = (string) => {
    if (string.trim() !== "") {
        return atob(string);
    } else
        return '';
};