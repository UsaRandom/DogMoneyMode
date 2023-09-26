class Currency {

    static USD = "usd";
    static EUR = "eur";
    static CNY = "cny";
    static JPY = "jpy";
    static GBP = "gbp";
    static INR = "inr";
    static RUB = "rub";

    static getCurrencyBySymbol(text) {
        if (text.includes("$")) {
          return "usd";
        }
        if (text.includes("€")) {
          return "eur";
        }
        if (text.includes("元")) {
          return "cny";
        }
        if (text.includes("円")) {
          return "jpy";
        }
        if (text.includes("£")) {
          return "gbp";
        }
        if (text.includes("₹")) {
          return "inr";
        }
        if (text.includes("₽")) {
          return "rub";
        }
        return false;
      }
      
}