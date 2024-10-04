//  this is implementation of moving average crossover
// In this algorithm we compute two averages on the go, first is short-term and second is long-term
// buy condition : when the short-term moving average crosses above the long-term moving average.
// sell condition: when the short-term moving average crosses below the long-term moving average.

const calculateMovingAverage = (data, period) => {
    const movingAverages = [];
    for (let i = 0; i <= data.length - period; i++) {
      const slice = data.slice(i, i + period); // extract period values
      const average = slice.reduce((acc, value) => acc + value, 0)/period; //avg of period values
      movingAverages.push(average); // push it into new array
    }
    return movingAverages; // return array
};
  

const logic  = async (closeValues) => {
    // console.log(closeValues)

    const shortPeriod = 3;  //short-term avaerage
    const longPeriod = 5;   // long-term avg

    closeValues.unshift(0);  // add 0 for edge case handling
    closeValues.push(0); 

    let profit = 0;
    let buyPrice = 0;
    let holding = false;  // To track if we are currently holding the stock
    let currentIndex = Math.max(shortPeriod, longPeriod); // first valid index

    // calculate moving avg for both short and long term
    const shortMA = calculateMovingAverage(closeValues, shortPeriod);
    const longMA = calculateMovingAverage(closeValues, longPeriod);

    const processNextValue = () => {
        if (currentIndex >= closeValues.length - 1) { //return condition
        console.log('Final Profit or Loss:', profit);
        return;
        }

        const currentShortMA = shortMA[currentIndex - shortPeriod];
        const currentLongMA = longMA[currentIndex - longPeriod];

        if (!holding && currentShortMA > currentLongMA) { //buy condition
            buyPrice = closeValues[currentIndex];
            holding = true; 
            console.log(`Bought at: ${buyPrice}`);
        } 
        else if (holding && currentShortMA < currentLongMA) { //sell condition
            const sellPrice = closeValues[currentIndex];
            profit += sellPrice - buyPrice;  
            holding = false; 
            console.log(`Sold at: ${sellPrice}, Profit so far: ${profit}`);
        }

        currentIndex++; // increment index
        setTimeout(processNextValue, 100); // setTimeout for better visualsation 
    };

    processNextValue();
} 

module.exports = {logic}