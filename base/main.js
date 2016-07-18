

//console.log(to_json(price));
//console.log(to_json(prodData));
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
        result.push({ name: v, value: Math.floor(total[v]) });
    }
    $$('totalTable').clearAll();
    $$('totalTable').define('data', result);
}
function recalcDetail() {
    var itemName = $$('itemName').getValue();
    console.log("Calc for item " + itemName);
    var table = $$('detailTable');
    table.clearAll();
    var baseItemMe = parseInt($$('me').getValue(), 10);
    var quantity = parseInt($$('quantity').getValue(), 10);
    var d = getData(itemName, quantity, baseItemMe);
    $$('detailTable').define('data', d);
    recalcTotal();
    table.refresh();
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
                    view: "text",
                    id: "me",
                    value: "0",
                    label: "ME",
                }, {
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
                        { id: "basevalue", header: "Баз. Кол-во", width: 100 },
                        { id: "me", header: "Эффект.", width: 100 },
                        { id: "value", header: "Кол-во", width: 100 },
                        { id: "cost", header: "Цена", width: 150 },
                    ],
                    on: {
                        onAfterOpen: recalcTotal,
                        onAfterClose: recalcTotal
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

function getMaterials(name, quantity, baseItemMe) {
    var arr = [];
    var materials = prodData[name].material;
    var k = 1;
    var me = 0;
    var cost = 0;
    var obj;
    me = getProductivityByName(name, baseItemMe);
    k = getEffByName(name, baseItemMe);
    //console.log("Eff " + name + " " + me + ' : ' + k);
    for (v in materials) {
        // console.log("Found " + v + ':' + materials[v]);
         obj = {
            name: v,
            basevalue: Math.floor(materials[v] * quantity),
            value: Math.floor(materials[v] * quantity * k),
            open: false,
            'me': me
        };
        if (prodData[v]) {
            var data = getMaterials(v, materials[v] * quantity * k, 0);
            obj.data = data[0];
            obj.cost = data[1];
        }
        if (!obj.cost || obj.cost === NaN) {
            if (price[obj.name]) {
                obj.cost = Math.floor(price[obj.name] * obj.value);
            } else {
                obj.cost = '???';
            }
        }
        //console.log("Price " + obj.name + " -> " +  price[obj.name]);
        //console.log("Cost " + name + "/" + obj.name + " -> " + cost + " " + obj.cost);
        cost += obj.cost;
        arr.push(obj);
    }
    //console.log("FinishCost " + name + " -> " + cost);
    return [arr, cost];
}
function getData(name, quantity, baseItemMe) {
    var arr = [];
    var item = prodData[name];
    var cost = item.cost;
    if(item.num ){
        arr.push({ name: 'Размер партии', value: item.num });
    }
    arr.push({ name: 'Цена производства', cost: item.cost });
    var baseME = getProductivityByName(name, 0 + baseItemMe);
    arr.push({ name: 'Эффективность КШ', me: item.me });
    arr.push({ name: 'Эфф. Фабрики', me: getBaseProductivityByName(name, 0) });
    arr.push({
        name: 'Эфф. Итоговая',
        basevalue: getEffByName(name,baseItemMe),
        me:  baseME,
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
        cost: Math.floor(cost),
        basevalue: Math.floor(cost / (prodData[name].num|| 1))
    });
    return arr;
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
                //if (v.cost) {
                webix.message(v.name);
                console.log(to_json(v));
                $$('itemName').setValue(v.name);
                recalcDetail();
                $$('tabView').setValue('detailView');
                //}
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
