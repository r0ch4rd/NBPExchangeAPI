async function getExchangeRates() {
    const response = await fetch("http://api.nbp.pl/api/exchangerates/tables/A/?format=json");
    const responseJSON = await response.json();
    let exchangeRates = responseJSON[0].rates

    exchangeRates.unshift({
        "currency": "polski złoty",
        "code": "PLN",
        "mid": 1.0000
    });

    return responseJSON[0].rates;
}
  
async function fillOptions() {
    let exchangeRates = await getExchangeRates();
    let optionElements = document.querySelectorAll("select");

    optionElements.forEach(optionElement => {

        exchangeRates.forEach(element => {

            let opt = document.createElement('option');
            opt.value = element.code;
            opt.innerHTML = `${element.code} - ${element.currency}`;
            optionElement.appendChild(opt);

        });

    });

}

document.querySelector("#convert").addEventListener("click", async function(){
    let output = document.querySelector("#output");
    let amount = parseInt(document.querySelector("#amount").value);
    let exchangeRates = await getExchangeRates();
    let currencyFrom = document.querySelector("#from").value;
    let currencyTo = document.querySelector("#to").value;

    let findCurrencyValue = (currency, exchangeRates) => {
        let returnValue;
        exchangeRates.forEach(element => {
            if(element.code == currency){
                returnValue = element.mid;
                return;
            }
        });
        return returnValue;
    };
    
    let currencyFromInPLN = findCurrencyValue(currencyFrom, exchangeRates);
    let currencyToInPLN = findCurrencyValue(currencyTo, exchangeRates);

    output.innerHTML = `${amount} ${currencyFrom} = ${(currencyFromInPLN/currencyToInPLN).toFixed(2)} ${currencyTo}`
});

fillOptions();