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

        let escapedSymbol = null;
        let regexPattern = null;

        switch(currency) {
            case "usd": 
                escapedSymbol = "$".replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                regexPattern = `(${escapedSymbol}\\s*)(\\d{1,3}(?:,\\d{3})*(?:\\.\\d+)?|\\d*(?:\\.\\d+)?)`;
                return new RegExp(regexPattern);
            case "eur": 
                escapedSymbol = "€".replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                regexPattern = `(${escapedSymbol}\\s*)(\\d{1,3}(?:,\\d{3})*(?:\\.\\d+)?|\\d*(?:\\.\\d+)?)`;
                return new RegExp(regexPattern);
            case "cny": 
                escapedSymbol = "元".replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                regexPattern = `(\\d{1,3}(?:,\\d{3})*(?:\\.\\d+)?|\\d*(?:\\.\\d+)?)(${escapedSymbol}\\s*)`;
                return new RegExp(regexPattern);
            case "jpy": 
                escapedSymbol = "円".replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                regexPattern = `(\\d{1,3}(?:,\\d{3})*(?:\\.\\d+)?|\\d*(?:\\.\\d+)?)(${escapedSymbol}\\s*)`;
                return new RegExp(regexPattern);
            case "gbp": 
                escapedSymbol = "£".replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                regexPattern = `(${escapedSymbol}\\s*)(\\d{1,3}(?:,\\d{3})*(?:\\.\\d+)?|\\d*(?:\\.\\d+)?)`;
                return new RegExp(regexPattern);
            case "inr": 
                escapedSymbol = "₹".replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                regexPattern = `(${escapedSymbol}\\s*)(\\d{1,3}(?:,\\d{3})*(?:\\.\\d+)?|\\d*(?:\\.\\d+)?)`;
                return new RegExp(regexPattern);
            case "rub": 
                escapedSymbol = "₽".replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                regexPattern = `(${escapedSymbol}\\s*)(\\d{1,3}(?:,\\d{3})*(?:\\.\\d+)?|\\d*(?:\\.\\d+)?)`;
                return new RegExp(regexPattern);
            default:
                return null;
        }
    }
      
}

export { Currency };