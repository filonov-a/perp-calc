

//console.log(to_json(price));
//console.log(to_json(prodData));
var priceData = [];
var detailTable;
var detailData;
function updatePrices() {
    for (v in price) {
        // console.log("Price for " + v + ':' + price[v]);
        priceData.push({ name: v, price: price[v] });
    }
}
function getMaterials(name, quantity) {
    var arr = [];
    var materials = prodData[name].material;
    var k = 1;
    var cost = 0;
    if (prodData[name].type == 'base') {
        k = productivity;
    }
    for (v in materials) {
        // console.log("Found " + v + ':' + materials[v]);
        var obj = { name: v, value: materials[v] * quantity * k, open: false };
        if (prodData[v]) {
            var data = getMaterials(v, materials[v] * quantity);
            obj.data = data[0];
            obj.cost = data[1];
        }
        if (!obj.cost) {
            if (price[obj.name]) {
                obj.cost = price[obj.name] * obj.value;
            } else {
                obj.cost = '???';
            }
        }
        console.log("Cost " +name + " -> " + cost + " " + obj.cost);
        cost += obj.cost;
        arr.push(obj);
    }
    console.log("FinishCost " +name + " -> " + cost );
    return [arr, cost];
}
function getData(e) {
    var name = e.name;
    var arr = [];
    var cost = prodData[name].cost;
    arr.push({ name: 'Размер партии', value: e.num });
    arr.push({ name: 'Цена производства', cost: cost });
    var data = getMaterials(name, 1);
    var materials = data[0];
    cost = data[1];
    
    for (v in materials) {
        arr.push(materials[v]);
    }
    //console.log("getData " + to_json(arr));
    arr.push({ name: 'Итого', cost: cost ,value: cost/e.num});
    return arr;
}

function updateCategories() {
    for (v in prodData) {
        // console.log("Price for " + v + ':' + price[v]);
        priceData.push({ name: v, price: price[v] });
    }
}

updatePrices();
var info = to_json(categories);
function initUI() {
    detailTable = webix.ui(
        {
            view: "treetable",
            id: 'detailTable',
            autoheight: true,
            width: 450,
            container: "detail",
            columns: [
                {
                    id: "name", header: "Наименование", width: 200,
                    template: "{common.treetable()} #name#"
                },
                { id: "value", header: "Кол-во", width: 100 },
                { id: "cost", header: "Цена", width: 150 },
            ],

        }
    );
    var treetable = {
        view: "treetable",
        //autowidth: true,
        autoheight: true,

        columns: [
            {
                id: "name", header: "Категория", width: 250,
                template: "{common.treetable()} #name#"
            },
            { id: "cost", header: "Стоимость производства", width: 90 },
            { id: "num", header: "Партия", width: 200 },
            { id: "time", header: "Время изготовления", width: 80 },
        ],
        data: categories,
        on: {
            onItemClick: function (id, e, node) {
                var v = this.getItem(id.row);
                if (v.cost) {
                    webix.message(v.name);
                    detailData = prodData[v.name];
                    detailTable.clearAll();
                    var v = getData(v);
                    detailTable.define('data', v);
                    detailTable.refresh();
                }
            },
        }
    };
    webix.ui({
        container: "price",
        //borderless: true,
        view: "tabview",
        //autowidth: true,
        autoheight: true,
        //width:"500",
        cells: [
            { header: "Категории", body: treetable },
            {
                header: "Базовые цены",
                body: {
                    height: "300",
                    view: "datatable",
                    columns: [
                        { id: "name", header: "Наименование", width: 200 },
                        { id: "price", header: "Цена", width: 80 },
                    ],
                    data: priceData
                }
            },
/*            {
                header: "Детализация",
                body: { template: '<pre>' + info + '</pre>' }
            },
*/        ]
    });

};


webix.ready(initUI);
