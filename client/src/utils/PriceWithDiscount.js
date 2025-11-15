
// utils/PriceWithDiscount.js (server-side)
export const pricewithDiscount = (price, dis = 1) => {
  // price and dis can be strings; coerce
  const p = Number(price) || 0;
  const d = Number(dis) || 0;
  // compute discounted price with two decimals, avoid floating trash
  const discounted = p * (1 - d / 100);
  // round to 2 decimals and return Number
  return Number(discounted.toFixed(2));
};
