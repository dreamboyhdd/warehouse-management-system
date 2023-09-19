
export const  EncodeString = (string) => {
    debugger
    if (string.trim() !== "") {
        return btoa(string);
    } else
        return '';
};