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
    let outputTop = document.querySelector(".output-top");
    let outputBottom = document.querySelector(".output-bottom");
    let amount = parseFloat(document.querySelector("#amount").value);
    let exchangeRates = await getExchangeRates();
    let currencyFrom = document.querySelector("#from").value;
    let currencyTo = document.querySelector("#to").value;

    if(isNaN(amount)){
        outputTop.innerHTML = "<span style='color: red;'>Amount cannot be empty</span>";
        return;
    }

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

    outputTop.innerHTML = `${amount} ${currencyFrom} =`
    outputBottom.innerHTML = `${(currencyFromInPLN/currencyToInPLN*amount).toFixed(2)} ${currencyTo}`
});

fillOptions();