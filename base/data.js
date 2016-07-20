


var productivity = {};
function subcatToCategory(subcat) {
    if (subcat.indexOf("атериал") > 0) {
        return "Материалы";
    }
    if (subcat.indexOf("робот") > 0
        || subcat.indexOf("мехи") > 0
        || subcat.indexOf("Мехи") >= 0
        || subcat.indexOf("глайд") >= 0
    ) {
        return "Роботы";
    }
    if (subcat.indexOf("патрон") > 0
        || subcat.indexOf("ячейк") > 0
        || subcat.indexOf("кассет") > 0
    ) {
        return "Расходники";
    }    return "Оборудование";

}
function getProductivity(cat, baseMe) {
    if (!cat) {
        cat = 'item';
    }
    if (cat == 'item') {

        var v = productivity[cat] + baseMe;
        //console.log("Prod for "+cat +" "+v+ "/ "+baseMe+" "+to_json(productivity));
        return v;
    }
    if (productivity[cat]) {
        return productivity[cat];
    }
    return 0;
}
function getProductivityByName(name, baseMe) {
    if (!prodData[name]) {
        return 0;
    }
    var o = prodData[name].type;
    var me = prodData[name].me || 0;
    return getProductivity(o, baseMe) + me;
}
function getBaseProductivityByName(name, baseMe) {
    var o = prodData[name].type;
    return getProductivity(o, baseMe);
}
function eff(x) {
    return 1 + (1 / ((x / 50) + 2));
}

function getEffByName(name, base) {
    var x = getProductivityByName(name, base);
    var k = 1;
    if (prodData[name].type == 'proto') {
        k = 10;
    }
    if (prodData[name].type == 'protoOwn') {
        k = 5;
    }
    return k * eff(x);
}

var priceData = [];
function updatePrices() {
    productivity['base'] = (price['Эффективность переработки']);
    productivity['item'] = (price['Эффективность производства']);
    productivity['proto'] = (price['Эффективность прототипирования']);
    productivity['protoOwn'] = productivity['proto'];

    for (v in price) {
        priceData.push({ name: v, price: price[v] });
    }
}
function editPrices() {
    var table = $$('priceTable');
    table.eachRow(
        function (row) {
            var v = table.getItem(row);
            price[v.name] = parseInt(v.price, 10);
        }
    );
    updatePrices();
}
var categories = [];
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
        if (!ownCT[v] && prodData[v].type != 'proto' && prodData[v].type != 'base') {
            continue;
        }
        if (prodData[v].type == 'proto' && prodData[v].tier != 'П') {
            continue;
        }
        if (ownCT[v]) {
            prodData[v].me = ownCT[v].me || 0;
        }
        var newRec = {
            name: v,
            cost: '-',
            num: prodData[v].num,
            me: prodData[v].me,
            tier: prodData[v].tier,
            time: prodData[v].time
        };
        if (ownCT[v]) {
            if (prodData[v].type == 'proto') {
                prodData[v].type = 'protoOwn';
                newRec.me = 'свой';
            }
        } else {
            if (prodData[v].type == 'proto') {
                newRec.me = 'корп';
            }
        }
        //console.log("Data for " + v + to_json(newRec));
        var objCat = prodData[v].cat || 'Other';
        if (!cat[objCat]) {
            cat[objCat] = [];
        }
        cat[objCat].push(newRec);
    };
    //      console.log(to_json(cat));
    var subcat = {};
    for (var v in cat) {
        var o = { name: v, data: cat[v] };
        var newCat = subcatToCategory(v);
        if (!subcat[newCat]) {
            subcat[newCat] = [];
        }
        subcat[newCat].push(o);

    };
    for (var v in subcat) {
        //subcat[v].sort();
        var o = { name: v, data: subcat[v] };
        categories.push(o);

    };
    categories.sort();
}


function to_json(s) {
    return JSON.stringify(s, null, 2);
}
function to_number(x) {
    var n = Math.ceil(x);
    return n.toFixed(0).replace(/./g, function (c, i, a) {
        return i && c !== "." && ((a.length - i) % 3 === 0) ? ' ' + c : c;
    });
}

createCategories();