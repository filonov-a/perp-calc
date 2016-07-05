function to_json(s) {
    return JSON.stringify(s, null, 2);
}

//console.log(to_json(price));
//console.log(to_json(prodData));
var priceData = [];
for (v in price) {
    // console.log("Price for " + v + ':' + price[v]);
    priceData.push({ name: v, price: price[v] });
}
console.log(to_json(priceData));
function initUI() {

    webix.ui({
        container: "price",
        borderless: true,

        view: "tabview",
        cells: [
            {
                header: "Цены",
                body: {
                    view: "list",
                    template: "#name# -> #price#. ",
                    type: {
                        height: 60
                    },
                    select: true,
                    data: priceData
                }
            },
            {
                header: "Form",
                body: {
                    id: "formView",
                    view: "htmlform",
                    content: "ammo",
                    rules: {
                        title: webix.rules.isNotEmpty,
                        year: webix.rules.isNumber,
                        rank: webix.rules.isNumber
                    }
                }
            },
           // { header: "Empty", body: {} }
        ]
    });

};
webix.ready(initUI);