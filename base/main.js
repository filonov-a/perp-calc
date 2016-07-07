

//console.log(to_json(price));
//console.log(to_json(prodData));
function recalcDetail() {
    var table = $$('detailTable');
    var total = {};
    var quantity = $$('quantity').getValue();
    table.eachRow(
        function (row) {
            var v = table.getItem(row);
            //console.log(to_json(v));
            if (v.open == false) {
                if (total['NIC']) {
                    total['NIC'] += v.cost * quantity;
                } else {
                    total['NIC'] = v.cost * quantity;

                } if (total[v.name]) {
                    total[v.name] += v.value * quantity;
                } else {
                    total[v.name] = v.value * quantity;
                }

            }
        }
    );
    var result = [];
    for (v in total) {
        // console.log("Price for " + v + ':' + price[v]);
        result.push({ name: v, value: total[v] });
    }
    $$('totalTable').clearAll();
    $$('totalTable').define('data', result);
    //console.log(to_json(result));
}
var priceData = [];
var detailTable = {
    type: "space",
    autoheight: true,
    id: 'detailView',
    rows: [
        {
            cols: [
                { view: "label", id: "itemName", align: "left", },
                {
                    view: "text",
                    id: "quantity",
                    value: "1",
                    label: "Количество",
                },
                {
                    view: "button",
                    label: "Пересчитать",
                    width: 100,
                    click: recalcDetail

                },
            ]
        },
        {

            cols: [
                {
                    view: "treetable",

                    autoheight: true,
                    //height: 650,
                    id: 'detailTable',
                    //container: "detail",
                    columns: [
                        {
                            id: "name", header: "Наименование", width: 200,
                            template: "{common.treetable()} #name#"
                        },
                        { id: "value", header: "Кол-во", width: 100 },
                        { id: "cost", header: "Цена", width: 150 },
                    ],
                    on: {
                        onAfterOpen: recalcDetail,
                        onAfterClose: recalcDetail
                    },
                },
                {

                    view: "datatable",
                    id: "totalTable",
                    //label:"Итого",
                    columns: [
                        { id: "name", header: "Наименование", width: 200 },
                        { id: "value", header: "Количество", width: 120 },
                    ],
                },
            ]
        }
    ]
};
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
        //console.log("Cost " + name + " -> " + cost + " " + obj.cost);
        cost += obj.cost;
        arr.push(obj);
    }
    //console.log("FinishCost " + name + " -> " + cost);
    return [arr, cost];
}
function getData(e) {
    var name = e.name;
    var arr = [];
    var cost = e.cost;
    arr.push({ name: 'Размер партии', value: e.num });
    arr.push({ name: 'Цена производства', cost: cost });
    var data = getMaterials(name, 1);
    var materials = data[0];
    cost = data[1];

    for (v in materials) {
        arr.push(materials[v]);
    }
    //console.log("getData " + to_json(arr));
    arr.push({ name: 'Итого', cost: cost, value: cost / e.num });
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
            { id: "num", header: "Партия", width: 100 },
            { id: "time", header: "Время изготовления", width: 120 },
        ],
        data: categories,
        on: {
            onItemClick: function (id, e, node) {
                var v = this.getItem(id.row);
                if (v.cost) {
                    webix.message(v.name);
                    $$('itemName').setValue(v.name);
                    detailData = prodData[v.name];
                    $$('detailTable').clearAll();
                    var d = getData(v);
                    $$('detailTable').define('data', d);
                    recalcDetail();
                    $$('detailTable').refresh();
                    $$('tabView').setValue('detailView');
                }
            },
        }
    };
    webix.ui({
        container: "price",
        //borderless: true,
        id: 'tabView',
        view: "tabview",
        //autowidth: true,
        autoheight: true,
        //width:"500",
        cells: [
            { id: "catView", header: "Категории", body: treetable },
            { id: "2", header: "Детализация", body: detailTable },
            {
                id: "3",
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
        ]
    });

};


webix.ready(initUI);
