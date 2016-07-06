var priceData = [];
function updatePrices() {
    for (v in price) {
        // console.log("Price for " + v + ':' + price[v]);
        priceData.push({ name: v, price: price[v] });
    }
}
var categories=[];
function updateCategories() {
    for (v in prodData) {
        // console.log("Price for " + v + ':' + price[v]);
        priceData.push({ name: v, price: price[v] });
    }
}
