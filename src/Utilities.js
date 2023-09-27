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
/*

Test set for regex:

$123
$123.456
-$123,456
$123,456.789
$12,000,000
aaaa$42,000,00
$42,000,000aaa
($0.07/Fl Oz)
$1.00
$0.02
$ .99
$0.50
$ 1,999.99
$100,999
$1,234.56
$ 123
$12
$345.678
$7890
$0.001
$0
$5,000,000.00


*/



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
        regexPattern = `(\\${symbol}\\s*\\d*(?:,\\d{3})*(?:\\.\\d*)?(?=[\\s\\/]*))`;
        return new RegExp(regexPattern);
    }
      
}

export { Currency };