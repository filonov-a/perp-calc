var priceData = [];
function updatePrices() {
    productivity['base'] = (price['Эффективность переработки']);
    productivity['item'] = (price['Эффективность производства']);
    productivity['proto'] = (price['Эффективность прототипирования']);
    productivity['protoCorp'] = productivity['proto'];

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
var categories = [];
function createCategories() {
    var cat = {};
    for (var v in prodData) {
        //console.log("Data for " + v );
        var newRec = { name: v, cost: prodData[v].cost, num: 1, time: prodData[v].time };
        if (prodData[v].num) {
            newRec.num = prodData[v].num;
        }
        //console.log("Data for " + v + to_json(newRec));
        var objCat = prodData[v].cat || 'Other';
        if (!cat[objCat]) {
            cat[objCat] = [];
        }
        cat[objCat].push(newRec);
    };
    //      console.log(to_json(cat));
    for (var v in cat) {
        var o = { name: v, open:false ,data: cat[v] };
        if(v == "Промышленные модули"){
            o.open = true;
        }
        categories.push(o);
        
    };
}
createCategories();