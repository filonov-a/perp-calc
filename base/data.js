


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
        || subcat.indexOf("болванк") > 0
        || subcat.indexOf("ракет") > 0
        || subcat.indexOf("кассет") > 0
    ) {
        return "Расходники";
    } return "Оборудование";

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

function getPEByName(name, base) {
    var x = productivity['build'];
    if ( prodData[name].type === 'proto' || prodData[name].type === 'protoOwn') {
        x = productivity['buildProto'];
    }
    return (x+base);
}

function getTimeEffByName(name, base) {
    var x = getPEByName(name, base);
    var k = 1;
    if ( prodData[name].type === 'proto' || prodData[name].type === 'protoOwn') {
        k = 10;
    }
    return k * eff(x);
}

var priceData = [];
function updatePrices() {
    productivity['base'] = (price['Эффективность переработки']);
    productivity['item'] = (price['Эффективность производства']);
    productivity['proto'] = (price['Эффективность прототипирования']);
    productivity['protoOwn'] = productivity['proto'];
    productivity['build'] = price['Производительность производства'];
    productivity['buildProto'] = price['Производительность прототипирования'];

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
var itemNames = [];
function updateCategories() {
    for (v in prodData) {
        // console.log("Price for " + v + ':' + price[v]);
        priceData.push({ name: v, price: price[v] });
    }
}

function createCategories() {
    var cat = {};
    for (var v in prodData) {
        itemNames.push(v);

        if (!ownCT[v] && prodData[v].type != 'proto' && prodData[v].type != 'base') {
            continue;
        }
        if (prodData[v].type == 'proto' && prodData[v].tier != 'П') {
            continue;
        }
        if (ownCT[v]) {
            //prodData[v].cost = ownCT[v].cost || 0;
            prodData[v].me = ownCT[v].me || 0;
        }
        var newRec = {
            name: v,
            cost: prodData[v].cost,
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
    itemNames.sort();

}


function to_json(s) {
    return JSON.stringify(s, null, 2);
}
function to_time(x) {

    var sec_num = Math.ceil(x);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    if( hours > 23){
        var days = Math.floor(hours / 24);
        hours -= days * 24;
        return days + "д " + hours+':'+minutes+':'+seconds;
    }
    return hours+':'+minutes+':'+seconds;
}
function to_number(x) {
    var n = Math.ceil(x);
    return n.toFixed(0).replace(/./g, function (c, i, a) {
        return i && c !== "." && ((a.length - i) % 3 === 0) ? ' ' + c : c;
    });
}

createCategories();

var lastCalculatedRowId;
function recalcTotal() {
    var table = $$('detailTable');
    var total = {};
    var quantity = $$('quantity').getValue();
    table.eachRow(
        function (row) {
            var v = table.getItem(row);
            //console.log(to_json(v));
            if (v.name == 'Цена производства') {
                total['NIC'] = v.cost * quantity;
            }
            if (v.open == false) {

                if (total[v.name]) {
                    total[v.name] += v.value;
                } else {
                    total[v.name] = v.value;
                }

            }
        }
    );
    var result = [];
    for (v in total) {
        result.push({ name: v, value: to_number(total[v]) });
    }
    $$('totalTable').clearAll();
    $$('totalTable').define('data', result);
}
function recalcDetail() {
    var itemName = $$('itemName').getValue();
    if (itemName === '') {
        return;
    }
    var table = $$('detailTable');
    table.clearAll();
    var baseItemMe = parseInt($$('me').getValue(), 10);
    var quantity = parseInt($$('quantity').getValue(), 10);
    var d = getData(itemName, quantity, baseItemMe);
    //var icon = prodData[itemName].img;
    //$$('itemIco').setValue("icons/"+icon+".png");
    $$('detailTable').define('data', d);
    recalcTotal();
    table.eachRow(
        function (row) {
            var v = table.getItem(row);
            if (v.cost && v.cost != NaN) {
                v.costVisible = to_number(v.cost);
                table.updateItem(row, v);
            }
        }
    );

    var priceTable = $$('catTable');
    if (lastCalculatedRowId >= 0) {
        var tableItem = priceTable.getItem(lastCalculatedRowId);
        tableItem.rescost = d[d.length - 1].cost;
        priceTable.updateItem(lastCalculatedRowId, tableItem);
        table.refresh();
    }
}

function findItem() {
    $$('itemName').setValue($$('itemNameSelector').getValue());
    lastCalculatedRowId = -1;
    recalcDetail();
}
var priceData = [];

function getMaterials(name, quantity, baseItemMe) {
    var arr = [];
    var materials = prodData[name].material;
    var k = 1;
    var me = 0;
    var cost = prodData[name].cost || 0;

    me = getProductivityByName(name, baseItemMe);
    k = getEffByName(name, baseItemMe);
    //console.log("Eff " + name + " " + me + ' : ' + k + " q:",quantity);
    for (v in materials) {
        // console.log("Found " + v + ':' + materials[v]);
        var matValue = Math.ceil(materials[v] * quantity * ((materials[v] === 1) ? 1 : k));
        var obj = {
            name: v,
            basevalue: Math.floor(materials[v] * quantity),
            value: matValue,
            open: false,
            'me': getProductivityByName(v, 0)
        };
        if (prodData[v]) {
            var data = getMaterials(v, materials[v] * quantity, 0);
            obj.data = data[0];
            obj.cost = data[1];
        }
        if (!obj.cost || obj.cost === NaN) {
            if (price[obj.name]) {
                obj.cost = Math.ceil(price[obj.name] * obj.value);
            } else {
                obj.cost = '???';
            }
        }
        obj.costVisible = obj.cost;
        //console.log("Price " + obj.name + " -> " +  price[obj.name]);
        //console.log("Cost " + name + "/" + obj.name + " -> " + cost + " " + obj.cost);
        if (obj.cost != '???') {
            cost += obj.cost;
        }
        arr.push(obj);
    }
    //console.log("FinishCost " + name + " -> " + cost);
    return [arr, cost];
}
function getData(name, quantity, baseItemMe) {
    var arr = [];
    var item = prodData[name];
    var cost = item.cost || 0;

    if (item.num) {
        arr.push({ name: 'Размер партии', value: item.num });
    }
    var pe = getPEByName(name, baseItemMe);
    var buildTime = item.time * getTimeEffByName(name, baseItemMe);
    item.cost = buildTime*3;
    arr.push({
        name: 'Время производства',
        me: pe,
        basevalue:eff(pe),
        costVisible: to_time(buildTime)
    });
    arr.push({ name: 'Стоимость производства', cost: item.cost });
    var baseME = getProductivityByName(name, 0 + baseItemMe);
    arr.push({ name: 'Эффективность КШ', me: item.me });
    arr.push({ name: 'Эфф. Фабрики', me: getBaseProductivityByName(name, 0) });
    arr.push({
        name: 'Эфф. Итоговая',
        basevalue: getEffByName(name, baseItemMe),
        me: baseME,
    });
    var data = getMaterials(name, quantity, baseItemMe);
    var materials = data[0];
    cost = data[1];

    for (v in materials) {
        arr.push(materials[v]);
    }
    //console.log("getData " + to_json(arr));
    arr.push({
        name: 'Итого',
        cost: cost,
        basevalue: to_number(cost / (prodData[name].num || 1))
    });
    return arr;
}

updatePrices();