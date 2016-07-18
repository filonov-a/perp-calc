
// ресурсы на партию в 1кк титана

var price = {
    'Эффективность переработки': 283,
    'Эффективность производства': 253,
    'Эффективность прототипирования': 253,
    'Сильгиум': 4,
    'Иментиум': 2,
    'Стермонит': 2.84,
    'Нефть': 0.49,
    'Ликвизит': 1.2,
    'Призмоцит': 5.35,
    'Триандус': 3,
    'Норалгис': 18,
    'Гелиоптрис': 5,
    'Титановая руда': 1.2,
    'Эпритон': 15,
    'Коликсиум': 800,
    'Битый общий фрагмент': 19000,
    'Рабочий общий фрагмент': 7900,
    'Целый общий фрагмент': 8000,
    'Битый фрагмент Пелистян': 1455,
    'Рабочий фрагмент Пелистян': 11999,

};

var productivity = {};
/*productivity['base'] = (price['Эффективность переработки']);
productivity['item'] = (price['Эффективность производства']);
productivity['proto'] = (price['Эффективность прототипирования']);
*/
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
        k = 5;
    }
    if (prodData[name].type == 'protoCorp') {
        k = 10;
    }
    return k * eff(x);
}

var prodData = {
    'Титан': {
        'type': 'base',
        cat: 'Материалы',
        "material": {
            'Титановая руда': 75,
        },
    },
    'Аксиколин': {
        'type': 'base',
        cat: 'Материалы',
        "material": {
            'Ликвизит': 50,
            'Титановая руда': 25,
        },
    },
    'Флоботил': {
        'type': 'base',
        cat: 'Материалы',
        "material": {
            'Сильгиум': 50,
            'Ликвизит': 25,
            'Триандус': 30,
        },
    },
    'Полинуклеит': {
        'type': 'base',
        cat: 'Материалы',
        'material': {
            'Стермонит': 50,
            'Ликвизит': 25,
            'Призмоцит': 30,
        }
    },
    'Полинитрокол': {
        'type': 'base',
        cat: 'Материалы',
        'material': {
            'Иментиум': 50,
            'Ликвизит': 25,
            'Гелиоптрис': 30,
        }
    },
    'Изопропентол': {
        'type': 'base',
        cat: 'Материалы',
        'material': {
            'Сильгиум': 50,
            'Нефть': 25,
            'Триандус': 30,
        }
    },
    'Пластеозин': {
        'type': 'base',
        cat: 'Материалы',
        "material": {
            'Нефть': 50,
            'Титановая руда': 50,
        },
    },
    'Криоперин': {
        'type': 'base',
        cat: 'Материалы',
        "material": {
            'Ликвизит': 25,
            'Нефть': 50,
        },
    },
    'Витрицил': {
        'type': 'base',
        cat: 'Материалы',
        "material": {
            'Сильгиум': 50,
            'Нефть': 25,
            'Гелиоптрис': 30,
        },
    },
    'Эспитиум': {
        'type': 'base',
        cat: 'Материалы',
        "material": {
            'Ликвизит': 75,
            'Нефть': 50,
            'Эпритон': 50,
        },
    },
    'Метахропин': {
        'type': 'base',
        cat: 'Материалы',
        "material": {
            'Стермонит': 50,
            'Нефть': 25,
            'Призмоцит': 30,
        },
    },
    'Прилумиум': {
        'type': 'base',
        cat: 'Материалы',
        "material": {
            'Стермонит': 50,
            'Нефть': 25,
            'Триандус': 30,
        },
    },
    'Бриочит': {
        'type': 'base',
        cat: 'Материалы',
        "material": {
            'Норалгис': 50,
            'Титановая руда': 75,
            'Эпритон': 50,
        },
    },
    'Аллигиор': {
        'type': 'base',
        cat: 'Материалы',
        "material": {
            'Нефть': 50,
            'Титановая руда': 75,
            'Эпритон': 50,
        },
    },
    'Гидробенол': {
        'type': 'base',
        cat: 'Материалы',
        "material": {
            'Ликвизит': 75,
            'Титановая руда': 50,
            'Эпритон': 50,
        },
    },
    'Бочилиум': {
        type: 'base',
        cat: 'Материалы',
        "material": {
            'Нефть': 100,
            'Эпритон': 25,
            'Коликсиум': 50,
        },
    },
};
