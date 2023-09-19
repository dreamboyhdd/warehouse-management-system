
export const GenerateNumber = (n) => {
    return String(Math.ceil(Math.random() * 10**n)).padStart(n, '0');
};