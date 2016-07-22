

//console.log(to_json(price));
//console.log(to_json(prodData));

//var info = to_json(categories);
var detailTable = {
    type: "space",
    autoheight: true,
    id: 'detailView',
    rows: [
        {
            height: 40,
            cols: [
                /*                {
                                    view: "template", id: "itemIco", align: "left",
                                    width: 40,
                                    data: {
                                        src: "icons/noIconAvailable.png",
                                        desr: "Icon"
                                    },
                                    template: function (obj) {
                                        return '<img src="' + obj.src + '" width=32 height=32 align=top >';
                                    }
                                },
                */
                { view: "label", id: "itemName", align: "left" },

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
                {
                    view: "combo",
                    width: 450,
                    id: "itemNameSelector",
                    options: itemNames,
                    //label: "Поиск",
                },
                 {
                    view: "button",
                    label: "Поиск",
                    width: 100,
                    click: findItem,

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
                        { id: "costVisible", header: "Цена", width: 150 },
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


function initUI() {
    var treetable = {
        view: "treetable",
        //autowidth: true,
        autoheight: true,
        id: "catTable",
        columns: [
            {
                id: "name", header: "Категория", width: 450,
                template: "{common.treetable()} #name#"
            },
            { id: "tier", header: "Уровень", width: 90 },
            { id: "cost", header: "Цена пр-ва", width: 120 },
            { id: "rescost", header: "Стоимость", width: 120 },
            { id: "me", header: "Эфф", width: 80 },
            { id: "num", header: "Партия", width: 100 },
            { id: "time", header: "Время изготовления", width: 120 },
        ],
        data: categories,
        on: {
            onItemClick: function (id, e, node) {
                var v = this.getItem(id.row);
                lastCalculatedRowId = id.row;
                webix.message(v.name);
                $$('itemName').setValue(v.name);
                recalcDetail();
                $$('tabView').setValue('detailView');
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
                    id: "priceTable",
                    view: "datatable",
                    editable: true,
                    columns: [
                        { id: "name", header: "Наименование", width: 200 },
                        { id: "price", header: "Цена", width: 150, editor: "text" },
                    ],
                    on: {
                        onAfterEditStop: editPrices,
                    },
                    data: priceData
                }
            },
        ]
    });

};


webix.ready(initUI);
