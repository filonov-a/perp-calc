

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
function getData(e) {
    var name = e.name;
    var arr=[];
    arr.push({ name: 'Размер партии', value: e.num });
    arr.push({ name: 'Цена производства', cost: prodData[name].cost });
    for (v in prodData[name].material) {
        // console.log("Price for " + v + ':' + price[v]);
        arr.push({ name: v, value: prodData[name].material[v] });
    }
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
            view: "datatable",
            id: 'detailTable',
            autoheight: true,
            width: 350,
            container: "detail",
            columns: [
                { id: "name", header: "Наименование", width: 200 },
                { id: "value", header: "", width: 150 },
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
