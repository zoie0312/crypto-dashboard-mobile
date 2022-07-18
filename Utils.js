export const formatMoney = (num) => {
    if (num === 0) return '0.00';
    return num.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
};