export const formatCurrency = (amount) => {
  const currency = localStorage.getItem("currency") || "₹";

  const map = {
    "₹": { locale: "en-IN", currency: "INR" },
    "$": { locale: "en-US", currency: "USD" },
    "€": { locale: "de-DE", currency: "EUR" },
    "£": { locale: "en-GB", currency: "GBP" },
  };

  const config = map[currency];

  if (!config) return `${currency}${amount}`;

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.currency,
    maximumFractionDigits: 2,
  }).format(amount);
};
