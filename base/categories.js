var categories = [
    {
        name: "Патроны", data: [
            { name: "Бронебойный средний патрон", cost: 2517, num: 1000, time: '15:04' },
            { name: 'Химактивный средний патрон', cost: 2520, num: 1000, time: '15:04' }
        ]
    },
    {
        name: "Роботы Пелистян", data: [
            { name: "Трояр-прототип корп", cost: 393228, num: 1, time: '1 день 12:24:36' },

        ]
    },
    {
        name: "Роботы Телодика", data: [
            { name: "Бафомет-прототип", cost: 393228, num: 1, time: '2 дня 00:32:49' },

        ]
    },
    {
        name: "Промышленные роботы", open: true, data: [
            { name: "Аргано", cost: 37650, num: 1, time: '03:29:10' },
            { name: "Аргано-прототип", cost: 393228, num: 1, time: '1 день 12:24:36' },
            { name: "Секер", cost: 50280, num: 1, time: '04:39:20' },

        ]
    },
];
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