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

    static getCurrencyRegex(currency) {

        let symbol = null;
        let regexPattern = null;

        switch(currency) {
            case "usd":
                symbol = "$";
                break;
            case "eur": 
                symbol = "€";
                break;
            case "gbp": 
                symbol = "£";
                break;
            case "inr": 
                symbol = "₹";
                break;
            case "rub": 
                symbol = "₽";
                break;
            case "cny": 
                symbol = "元".replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                regexPattern = `(\\d{1,3}(?:,\\d{3})*(?:\\.\\d+)?|\\d*(?:\\.\\d*)?)(${symbol}\\s*)`;
                return new RegExp(regexPattern);
            case "jpy": 
                symbol = "円".replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                regexPattern = `(\\d{1,3}(?:,\\d{3})*(?:\\.\\d+)?|\\d*(?:\\.\\d*)?)(${symbol}\\s*)`;
                return new RegExp(regexPattern);
            default:
                return null;
        }
        regexPattern = `(?<!\\S)(\\${symbol}\\s*\\d*(?:,\\d{3})*(?:\\.\\d*)?(?!\\S))`;
        return new RegExp(regexPattern);
    }
      
}

export { Currency };