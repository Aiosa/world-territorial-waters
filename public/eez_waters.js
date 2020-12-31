var mode;

function switchMode(newMode) {
    if (mode == newMode) return;
    switch(newMode) {
        case "diff":
            mode = "diff";
            current_cumulative = "diff_cumulative";
            if (sort_comparator_attr == "cumulative") sort_comparator_attr = current_cumulative;
            stressor_categories = diff_stressor_categories;
            stressor_keys = diff_stressor_keys;
            stressors = diff_stressors;
            break;
        case "base":
        default:
            mode = "base";
            current_cumulative = "cumulative";
            if (sort_comparator_attr == "diff_cumulative") sort_comparator_attr = current_cumulative;
            stressor_categories = base_stressor_categories;
            stressor_keys = base_stressor_keys;
            stressors = base_stressors;
            break;
    }

    buildColorPicker();
    buildStressorSelector();
}

function isBaseMode() {
    return mode == "base";
}


w = 800;
h = 400;
var minZoom;
var maxZoom;
var zoom;


//D3.js canvases
// var textArea;
// var barChartArea;
// var heatMap;
var legend;
var title;
var tooltip;
var svg;
var countriesGroup;
var highlightsGroup; //for shape highlighting
var highlightsGroupWaters;


var currentGraphViz;

function vizualize(type) {
    switch (type) {
        case "showHierarchyViz":
            currentGraphViz = showHierarchy;
            break;
        case "showBarChartSimpleViz":
            currentGraphViz = showBarChartPlain;
            break;
        case "showBarChartViz":
        default:
            currentGraphViz = showBarChart;
            break;
    }
    currentGraphViz();
}


//D3.js svg elements
var selectedAreaText;

//variables for selection
var selectedRegion;


//values filtering & sorting
var inputData; //store filtered data (array)
var inputHierarchicalData; //store filtered hierarchival data
var inputHierarchicalDataSize; //children size, not as easy as inputData.length

var area_low_limit = 95000;
var filter_area_slider;
var filter_area_text;

var stressor_checkboxes;
var stressors_keys_in_use;

let desc_comparator = function(attribute) {
    return function(a,b) {
        if (a[attribute] === undefined) return 1;
        if (b[attribute] === undefined) return -1;

        return a[attribute] > b[attribute] ? -1 : (a[attribute] < b[attribute] ? 1 : 0);
    }
};

var sort_comparator_attr = "cumulative";
function setSortComparator(comparatorValue) {
    if (comparatorValue == "diff_cumulative" || comparatorValue == "cumulative") {
        comparatorValue = current_cumulative;
    }
    sort_comparator_attr = comparatorValue;
}

//cache max values to be computed only once
var max_values = {};


//variables containing reference to data
var data;
//hierarchical structure for data (to be replaced null values)
let hierarchy = {

    "GEEZ-Africa": {
        "EEZ-Somalia": null,
        "GEEZ-South_Africa": {
            "EEZ-Prince_Edward_Islands" : null,
            "EEZ-South_Africa" : null
        },
        "EEZ-Djibouti": null,
        "EEZ-Sudan": null,
        "EEZ-Eritrea": null,
        "EEZ-Egypt": null,
        "EEZ-Kenya": null,
        "EEZ-Tanzania": null,
        "EEZ-Comoro_Islands": null,
        "EEZ-Madagascar": null,
        "EEZ-Mozambique": null,
        "EEZ-Namibia": null,
        "EEZ-Democratic_Republic_of_the_Congo": null,
        "EEZ-Angola": null,
        "EEZ-Equatorial_Guinea": null,
        "EEZ-Sao_Tome_and_Principe": null,
        "EEZ-Republic_of_the_Congo": null,
        "EEZ-Gabon": null,
        "EEZ-Cameroon": null,
        "EEZ-Nigeria": null,
        "EEZ-Togo": null,
        "EEZ-Benin": null,
        "EEZ-Ghana": null,
        "EEZ-Liberia": null,
        "EEZ-Ivory_Coast": null,
        "EEZ-Sierra_Leone": null,
        "EEZ-Guinea": null,
        "EEZ-Guinea_Bissau": null,
        "EEZ-Gambia": null,
        "EEZ-Cape_Verde": null,
        "EEZ-Senegal": null,
        "EEZ-Western_Sahara": null,
        "EEZ-Mauritania": null,
        "EZZ-Morocco": null,
        "EEZ-Algeria": null,
        "EEZ-Tunisia": null,
        "EEZ-Libya": null
    },

    "GEEZ-Antarctica" : {
        "EEZ-Antarctica": null
    },

    "GEEZ-America": {
        "GEEZ-United_States": {
            "EEZ-Alaska": null,
            "EEZ-United_States": null,
            "EEZ-Hawaii": null,
            "EEZ-Puerto_Rico_and_Virgin_Islands_of_the_United_States": null,
            "EEZ-Johnston_Atoll": null,
            "EEZ-American_Samoa": null,
            "EEZ-Palmyra_Atoll": null,
            "EEZ-Jarvis_Island": null,
            "EEZ-Howland_Island_and_Baker_Island": null,
            "EEZ-Wake_Island": null,
            "EEZ-Northern_Mariana_Islands_and_Guam": null
        },
        "EEZ-Canada": null,
        "EEZ-Bahamas": null,
        "EEZ-Mexico": null,
        "EEZ-Cuba": null,
        "EEZ-Guatemala": null,
        "EEZ-Haiti": null,
        "EEZ-Jamaica": null,
        "EEZ-Colombia": null,
        "EEZ-Belize": null,
        "EEZ-Honduras": null,
        "EEZ-Trinidad_and_Tobago": null,
        "EEZ-Venezuela": null,
        "EEZ-Saint_Kitts_and_Nevis": null,
        "EEZ-Antigua_and_Barbuda": null,
        "EEZ-Suriname": null,
        "EEZ-Guyana": null,
        "EEZ-Uruguay": null,
        "GEEZ-Brazil": {
            "EEZ-Brazil": null,
            "EEZ-Trindade": null,
        },
        "EEZ-Dominican_Republic": null,
        "EEZ-Argentina": null,
        "EEZ-El_Salvador": null,
        "EEZ-Costa_Rica": null,
        "GEEZ-Ecuador": {
            "EEZ-Galapagos_Islands": null,
            "EEZ-Ecuador": null
        },
        "GEEZ-Chile": {
            "EEZ-Chile": null,
            "EEZ-Easter_Island": null
        },
        "EEZ-Peru": null,
        "EEZ-Panama": null,
        "EEZ-Nicaragua": null,
        "EEZ-Barbados": null,
        "EEZ-Dominica": null,
        "EEZ-Grenada": null,
        "EEZ-Saint_Vincent_and_the_Grenadines": null,
        "EEZ-Saint_Lucia": null,
        "EEZ-Saint_Pierre_and_Miquelon": null
    },

    "GEEZ-Asia" : {
        "EEZ-Saudi_Arabia": null,
        "EEZ-Yemen": null,
        "EEZ-Bangladesh": null,
        "EEZ-Sri_Lanka": null,
        "GEEZ-India": {
            "EEZ-Andaman_and_Nicobar": null,
            "EEZ-India": null
        },
        // "GEEZ-Iran" : {
        //     "EEZ-Iran - Caspic (empty)": null,
        //     "EEZ-Iran": null
        // },
        "EEZ-Iran": null,
        // "GEEZ-Russia": {
        //     "EEZ-Russia": null,
        //     "EEZ-Russia - Caspic (empty)": null
        // },
        "EEZ-Russia": null,
        "EEZ-China": null,
        "EEZ-Thailand": null,
        "EEZ-Cambodia": null,
        "EEZ-Vietnam": null,
        "EEZ-Malaysia": null,
        "EEZ-Brunei": null,
        "EEZ-Singapore": null,
        "EEZ-Japan": null,
        "EEZ-Taiwan": null,
        "EEZ-South_Korea": null,
        "EEZ-North_Korea": null,
        "EEZ-Myanmar": null,
        "EEZ-Pakistan": null,
        "EEZ-United_Arab_Emirates": null,
        "EEZ-Oman": null,
        "EEZ-Bahrain": null,
        "EEZ-Qatar": null,
        "EEZ-Kuwait": null,
        "EEZ-Maldives": null,
        "EEZ-Iraq": null,
        "EEZ-Israel": null,
        "EEZ-Jordan": null,
        "EEZ-Lebanon": null,
        "EEZ-Syria": null,
        "EEZ-Cyprus": null,
        "EEZ-Turkey": null,
        "EEZ-Georgia": null
    },

    "GEEZ-Europe": {
        "EEZ-Poland": null,
        "EEZ-Italy": null,
        "GEEZ-Denmark": {
            "EEZ-Greenland": null,
            "EEZ-Denmark": null,
            "EEZ-Faeroe_Islands": null
        },
        "GEEZ-United_Kingdom": {
            "EEZ-Turks_and_Caicos_Islands": null,
            "EEZ-Cayman_Islands": null,
            "EEZ-Saint_Helena": null,
            "EEZ-Ascension": null,
            "EEZ-Pitcairn": null,
            "EEZ-Tristan_da_Cunha": null,
            "EEZ-Falkland_Islands": null,
            "EEZ-South_Georgia_and_the_South_Sandwich_Islands": null,
            "EEZ-Anguilla_and_British_Virgin_Islands": null,
            "EEZ-Bermuda": null,
            "EEZ-Montserrat": null,
            "EEZ-British_Indian_Ocean_Territory": null,
            "EEZ-Jersey": null,
            "EEZ-Guernsey": null,
            "EEZ-United_Kingdom": null
        },
        "GEEZ-France": {
            "EEZ-Guadeloupe_and_Martinique": null,
            "EEZ-Clipperton_Island": null,
            "EEZ-French_Guiana": null,
            "EEZ-French_Polynesia": null,
            "EEZ-Wallis_and_Futuna": null,
            "EEZ-Ile_Tromelin": null,
            "EEZ-Amsterdam_Island_and_Saint_Paul_Island": null,
            "EEZ-Kerguelen_Islands": null,
            "EEZ-Crozet_Islands": null,
            "EEZ-Mayotte": null,
            "EEZ-Glorioso_Islands": null,
            "EEZ-Bassas_da_India": null,
            "EEZ-Juan_de_Nova_Island": null,
            "EEZ-Ile_Europa": null,
            "EEZ-Reunion": null,
            "EEZ-France": null,
            "EEZ-New_Caledonia": null
        },
        "GEEZ-Portugal": {
            "EEZ-Azores": null,
            "EEZ-Portugal": null,
            "EEZ-Madeira": null
        },
        "GEEZ-Netherlands": {
            "EEZ-Netherlands": null,
            "EEZ-Curacao_and_Bonaire_and_Aruba": null,
            "EEZ-Sint-Maarten_and_Saba_and_Sint-Eustasius": null
        },
        "GEEZ-Norway": {
            "EEZ-Bouvet_Island": null,
            "EEZ-Jan_Mayen": null,
            "EEZ-Norway": null
        },
        "EEZ-Ukraine": null,
        "EEZ-Bulgaria": null,
        "EEZ-Romania": null,
        "GEEZ-Spain": {
            "EEZ-Spain": null,
            "EEZ-Canary_Islands": null
        },
        "EEZ-Monaco": null,
        "EEZ-Malta": null,
        "EEZ-Greece": null,
        "EEZ-Montenegro": null,
        "EEZ-Albania": null,
        "EEZ-Bosnia_and_Herzegovina": null,
        "EEZ-Croatia": null,
        "EEZ-Slovenia": null,
        "EEZ-Belgium": null,
        "EEZ-Germany": null,
        "EEZ-Sweden": null,
        "EEZ-Lithuania": null,
        "EEZ-Latvia": null,
        "EEZ-Estonia": null,
        "EEZ-Finland": null,
        "EEZ-Iceland": null,
        "EEZ-Ireland": null
    },

    "GEEZ-Oceania": {
        "EEZ-Tonga": null,
        "EEZ-Tuvalu": null,
        "EEZ-Samoa": null,
        "GEEZ-Kiribati": {
            "EEZ-Line_Group": null,
            "EEZ-Gilbert_Islands": null,
            "EEZ-Phoenix_Group": null
        },
        "EEZ-Fiji": null,
        "EEZ-Vanuatu": null,
        "EEZ-Solomon_Islands": null,
        "GEEZ-Australia": {
            "EEZ-Australia": null,
            "EEZ-Christmas_Island": null,
            "EEZ-Heard_and_McDonald_Islands": null,
            "EEZ-Cocos_Islands": null,
            "EEZ-Norfolk_Island": null,
            "EEZ-Macquarie_Island": null,
            "EEZ-Australia_-_Papua_New_Guinea": null
        },
        "GEEZ-New_Zealand": {
            "EEZ-Cook_Islands": null,
            "EEZ-New_Zealand": null,
            "EEZ-Tokelau": null,
            "EEZ-Niue": null
        },
        "EEZ-Nauru": null,
        "EEZ-Marshall_Islands": null,
        "EEZ-Micronesia": null,
        "EEZ-Philippines": null,
        "EEZ-Palau": null,
        "EEZ-Mauritius": null,
        "EEZ-Seychelles": null,
        "EEZ-Papua_New_Guinea": null,
        "EEZ-Indonesia": null,
        "EEZ-East_Timor_and_Oecussi_Ambeno": null
    },

    "GEEZ-Other": {
        "EEZ-Colombia_-_Jamaica": null,
        "EEZ-Paracel_Islands": null,
        "EEZ-Spratly_Islands": null,
        "EEZ-Southern_Kuriles": null,
        "EEZ-Joint_Regime_Sao_Tome_and_Principe": null,
        "EEZ-Australia-Indonesia": null,
        "EEZ-Japan_-_Korea": null,
        "EEZ-Japan_-_South_Korea_Conflict_Zone": null
    }
}

var current_cumulative;
//all stresors
var stressors;
let base_stressors = {
    "a_fishing": "#E7F2F8",
    "d_fishing": "#cce0eb",
    "bh_fishing": "#b6d0de",
    "bl_fishing": "#a1c0d1",
    "ph_fishing": "#8db1c4",
    "pl_fishing": "#7ba2b8",
    "n_pollution": "#FFA384",
    "og_pollution": "#f29474",
    "i_pollution": "#e68463",
    "human": "#d97452",
    "l_pollution": "#cc6543",
    "temperature": "#EFE7BC",
    "uv": "#e3daa8",
    "acid": "#d6cc94",
    "level": "#c9bf81",
    "oil": "#B5E5CF",
    "shipping": "#a0d9bf",
    "species": "#8dccb0",
    "oc_pollution": "#8dccb0"
}

let diff_stressors = {
    "diff_d_fishing": "#cce0eb",
    "diff_bh_fishing": "#b6d0de",
    "diff_bl_fishing": "#a1c0d1",
    "diff_human": "#d97452",
    "diff_l_pollution": "#cc6543",
    "diff_n_pollution": "#FFA384",
    "diff_oil": "#B5E5CF",
    "diff_og_pollution": "#f29474",
    "diff_ph_fishing": "#8db1c4",
    "diff_pl_fishing": "#7ba2b8",
    "diff_temperature": "#EFE7BC",
    "diff_uv": "#e3daa8"
}

let sort_rules = {
    "area": {
        "name":"EEZ Area size",
        "formatter": areaFormat,
    },
    "gdp2013": {
        "name":"GDP in 2013",
        "formatter": currencyFormat
    },
    "gdp2008": {
        "name":"GDP in 2008",
        "formatter": currencyFormat
    },
    "exp": {
        "name":"Export in 2013",
        "formatter": currencyFormat
    },
    "imp": {
        "name":"Import in 2013",
        "formatter": currencyFormat
    }
}

let stressor_names = {
    "a_fishing": "Artisanal fishing",
    "d_fishing": "Demersal destructive fishing",
    "bh_fishing": "Demersal nondestructive high bycatch fishing",
    "bl_fishing": "Demersal nondestructive low bycatch fishing",
    "ph_fishing": "Pelagic high bycatch fishing",
    "pl_fishing": "Pelagic low bycatch fishing",
    "i_pollution": "Inorganic pollution",
    "l_pollution": "Light pollution",
    "n_pollution": "Nutrient pollution",
    "oc_pollution": "Ocean-based pollution",
    "og_pollution": "Organic pollution",
    "acid": "Ocean acidification",
    "oil": "Oil rigs",
    "shipping": "Shipping",
    "human": "Direct human impact",
    "species": "Invasive species",
    "level": "Sea level rise",
    "temperature": "Sea surface temperature",
    "uv": "UV",
    "diff_d_fishing": "Demersal destructive fishing",
    "diff_bh_fishing": "Demersal nondestructive high bycatch fishing",
    "diff_bl_fishing": "Demersal nondestructive low bycatch fishing",
    "diff_human": "Direct human impact",
    "diff_l_pollution": "Light pollution",
    "diff_n_pollution": "Nutrient pollution",
    "diff_oil": "Organic pollution",
    "diff_og_pollution": "Organic pollution",
    "diff_ph_fishing": "Pelagic high bycatch fishing",
    "diff_pl_fishing": "Pelagic low bycatch fishing",
    "diff_temperature": "Sea surface temperature",
    "diff_uv": "UV"
}
var stressor_keys;
let base_stressor_keys = [
    "a_fishing",
    "d_fishing",
    "bh_fishing",
    "bl_fishing",
    "ph_fishing",
    "pl_fishing",
    "i_pollution",
    "l_pollution",
    "n_pollution",
    "oc_pollution",
    "og_pollution",
    "acid",
    "oil",
    "shipping",
    "human",
    "species",
    "level",
    "temperature",
    "uv"
]
let diff_stressor_keys = [
    "diff_d_fishing",
    "diff_bh_fishing",
    "diff_bl_fishing",
    "diff_human",
    "diff_l_pollution",
    "diff_n_pollution",
    "diff_oil",
    "diff_og_pollution",
    "diff_ph_fishing",
    "diff_pl_fishing",
    "diff_temperature",
    "diff_uv"
]

// let stressor_weights = {
//     "n_pollution": 1.24,
//     "og_pollution": 1.315,
//     "i_pollution": 1.25,
//     "l_pollution": 0.605,
//     "human": 1.65,
//     "d_fishing": 1.92,
//     "bh_fishing": 1.475,
//     "bl_fishing": 1.115,
//     "ph_fishing": 0.775,
//     "pl_fishing": 0.57,
//     "a_fishing": 0.835,
//     "temperature": 1.935,
//     "uv": 0.62,
//     "acid": 1.305,
//     "level": 1.235,
//     "species": 1.49,
//     "oc_pollution": 1.05,
//     "shipping": 0.955,
//     "oil": 1.1
// }

var stressor_categories;
let base_stressor_categories = {
    "fishing": ["a_fishing", "d_fishing", "bh_fishing", "bl_fishing", "ph_fishing", "pl_fishing"],
    "land_based": ["n_pollution", "og_pollution", "i_pollution", "human", "l_pollution"],
    "climate": ["temperature", "uv", "acid", "level"],
    "ocean_based": ["oil", "shipping", "species",  "oc_pollution"]
}
let diff_stressor_categories = {
    "fishing": ["diff_d_fishing", "diff_bh_fishing", "diff_bl_fishing", "diff_ph_fishing", "diff_pl_fishing"],
    "land_based": ["diff_n_pollution", "diff_og_pollution", "diff_human", "diff_l_pollution"],
    "climate": ["diff_temperature", "diff_uv"],
    "ocean_based": ["diff_oil"]
}


var stressor_category_names =  {
    "land_based": "Land-based",
    "fishing": "Fishing",
    "climate": "Climate change",
    "ocean_based": "Ocen-based"
}

function currencyFormat(num) {
    if (num === undefined) return "no data";
    return '$' + String(num).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

function areaFormat(num) {
    if (num === undefined) return "no data";
    return String(num).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + " km<sup>2</sup>";
}

function roundTo5Dec(num) {
    return Math.round(num * 10000) / 10000;
}

function isEezLeaf(node) {
    return node.node !== undefined;
}


function findInHierarchyByEezId(eezId) {
    for (let continent in hierarchy) {
        if (hierarchy[continent][eezId] !== undefined) {
            return [continent,eezId];
        }
    }

    for (let continent in hierarchy) {
        let continentstates = hierarchy[continent];
        for (let state in continentstates) {
            if (continentstates[state] == null) continue;
            if (continentstates[state][eezId] !== undefined) {
                return [continent,state,eezId];
            }
        }
    }
    return null;
}

function walkHierarchy(node, callback) {
    if (isEezLeaf(node)) {
        callback(node);
        return;
    }

    for (let key in node) {
        walkHierarchy(node[key], callback);
    }
}




//////////////////////////////////////////
////////// INITIALIZE ////////////////////
//////////////////////////////////////////


/*Loading data from CSV file and editing the properties to province codes. Unary operator plus is used to save the data as numbers (originally imported as string)*/
d3.csv("./public/eez_stressors_2013.csv")
    .row(function(d) { return {
        id : d.EEZ,
        state : d.Country,
        cumulative : +d["Average cumulative impact score"],
        a_fishing : +d["Artisanal fishing"],
        d_fishing : +d["Demersal destructive fishing"],
        bh_fishing : +d["Demersal nondestructive high bycatch fishing"],
        bl_fishing : +d["Demersal nondestructive low bycatch fishing"],
        human : +d["Direct human impact"],
        i_pollution : +d["Inorganic pollution"],
        species: +d["Invasive species"],
        l_pollution: +d["Light pollution"],
        n_pollution: +d["Nutrient pollution"],
        oil: +d["Oil rigs"],
        acid: +d["Ocean acidification"],
        oc_pollution: +d["Ocean-based pollution"],
        og_pollution: +d["Organic pollution"],
        ph_fishing: +d["Pelagic high bycatch fishing"],
        pl_fishing: +d["Pelagic low bycatch fishing"],
        level: +d["Sea level rise"],
        temperature: +d["Sea surface temperature"],
        shipping: +d["Shipping"],
        uv: +d["UV"],
        notes: d["Notes"],
        area: +d["Area"]
    };
    }).get(function(error, rows) {
    //saving reference to data
    data = rows;

    d3.csv("./public/eez_stressors_diff_2008.csv")
        .row(function(d) { return {
            id : d.EEZ,
            diff_cumulative : +d["Average cumulative impact score"],
            diff_d_fishing : +d["Demersal destructive fishing"],
            diff_bh_fishing : +d["Demersal nondestructive high bycatch fishing"],
            diff_bl_fishing : +d["Demersal nondestructive low bycatch fishing"],
            diff_human : +d["Direct human impact"],
            diff_l_pollution: +d["Light pollution"],
            diff_n_pollution: +d["Nutrient pollution"],
            diff_oil: +d["Oil rigs"],
            diff_og_pollution: +d["Organic pollution"],
            diff_ph_fishing: +d["Pelagic high bycatch fishing"],
            diff_pl_fishing: +d["Pelagic low bycatch fishing"],
            diff_temperature: +d["Sea surface temperature"],
            diff_uv: +d["UV"]
        };
        }).get(function(error, rows) {
            for (const row of rows) {

                for (const saved2013 of data) {

                    if (saved2013.id == row.id) {
                        saved2013.diff_cumulative = computeDiffValue(row.diff_cumulative, saved2013.cumulative);
                        saved2013.diff_d_fishing = computeDiffValue(row.diff_d_fishing, saved2013.d_fishing);
                        saved2013.diff_bh_fishing = computeDiffValue(row.diff_bh_fishing, saved2013.bh_fishing);
                        saved2013.diff_bl_fishing = computeDiffValue(row.diff_bl_fishing, saved2013.bl_fishing);
                        saved2013.diff_human = computeDiffValue(row.diff_human, saved2013.human);
                        saved2013.diff_l_pollution = computeDiffValue(row.diff_l_pollution, saved2013.l_pollution);
                        saved2013.diff_n_pollution = computeDiffValue(row.diff_n_pollution, saved2013.n_pollution);
                        saved2013.diff_oil = computeDiffValue(row.diff_oil, saved2013.oil);
                        saved2013.diff_og_pollution = computeDiffValue(row.diff_og_pollution, saved2013.og_pollution);
                        saved2013.diff_ph_fishing = computeDiffValue(row.diff_ph_fishing, saved2013.ph_fishing);
                        saved2013.diff_pl_fishing = computeDiffValue(row.diff_pl_fishing, saved2013.pl_fishing);
                        saved2013.diff_temperature = computeDiffValue(row.diff_temperature, saved2013.temperature);
                        saved2013.diff_uv = computeDiffValue(row.diff_uv, saved2013.uv);
                        continue;
                    }
                }
            }

        //load map and initialise the views
        init();
    });
});

function computeDiffValue(base, diff) {
    let result = base + diff;
    if (result < 0) return 0;
    return Math.round(result * 10000) / 10000;
}


function init() {

    //setup all static html first
    legend = d3.select("#legend");
    title = d3.select("#title");
    tooltip = d3.select("#tooltip");
    switchMode("base");

    //load all dynamic html/svg
    d3.request("public/territorial_waters.svg")
        .mimeType("image/svg+xml")
        .response(function(xhr) {
            d3.select("#map_div").append(function () {
                return xhr.responseXML.querySelector('svg');
            }).attr("id", "map")
                .attr("width", $("#map_div").width())
                .attr("height", $("#map_div").height())
                .attr("x", 0)
                .attr("y", 0);
        })
        .get(function(n){
            svg = d3.select("body").select("#map_div");
            countriesGroup = svg.select("#world");

            let maxArea = 0;
            for (let i = 0; i < data.length; i++) {
                let item = data[i];

                if (item.id === undefined || !item.id || item.id.length == 0) {
                    continue;
                }

                maxArea = updateMax(maxArea, item.area);

                item.node = svg.select("#" + item.id);
                item.name = item.node.attr("name");
                let keys = findInHierarchyByEezId(item.id);
                if(keys.length == 2) {
                    item.parent_state = d3.select("#" + keys[1].substring(4));
                    if (item.parent_state.empty()) item.parent_state = null;
                    hierarchy[keys[0]][keys[1]] = item;
                } else {
                    item.parent_state = d3.select("#" + keys[1].substring(5));
                    if (item.parent_state.empty()) item.parent_state = null;
                    item.parent_eez = d3.select("#" + keys[1]);
                    hierarchy[keys[0]][keys[1]][keys[2]] = item;
                }
            }
            max_values.area = maxArea;

            filter_area_slider = d3.select("#filter-area-slider")
                .attr("min", 0)
                .attr("max", 500000 /*maxArea*/)
                .attr("value", area_low_limit)
                .on("input", function() {
                    area_low_limit = filter_area_slider.property("value");
                    filter_area_text.html((area_low_limit).toLocaleString('en'));
                }).on("mouseup", function(){
                    currentGraphViz();
                });
            filter_area_text = d3.select("#filter-area-value")
                .html((area_low_limit).toLocaleString('en'));


            d3.csv("./public/gdp.csv")
                .row(function(d) { return {state: d.state, gdp2008: +d.gdp2008, gdp2013: +d.gdp2013};
                }).get(function(error, rows) {
                    let maxGdp2008 = 0,
                        maxGdp2013 = 0;
                    walkHierarchy(hierarchy, node => { //todo iterate data list only, same objects
                        for (const row of rows) {
                            if (row.state == node.state) {
                                if (row.gdp2008 !== undefined) {
                                    node.gdp2008 = Math.round(row.gdp2008);
                                    maxGdp2008 = updateMax(maxGdp2008, node.gdp2008);
                                }
                                if (row.gdp2013 !== undefined) {
                                    node.gdp2013 = Math.round(row.gdp2013);
                                    maxGdp2013 = updateMax(maxGdp2013, node.gdp2013);
                                }
                                break;
                            }
                        }
                        if (node.gdp2008 === undefined) {
                            console.log("UNDEFINED GDP 2008 " + node.state);
                        }
                        if (node.gdp2013 === undefined) {
                            console.log("UNDEFINED GDP 2013 " + node.state);
                        }
                    });
                    max_values.gdp2008 = maxGdp2008;
                    max_values.gdp2013 = maxGdp2013;
            });


            d3.csv("./public/export_import.csv")
                .row(function(d) {
                    return {
                        state: d["Partner Name"],
                        exp: +d["Export"],
                        imp: +d["Import"]
                    };
                }).get(function(error, rows) {
                    let maxExp = 0;
                    let maxImp = 0;
                    walkHierarchy(hierarchy, node => { //todo iterate data list only, same objects
                        for (const row of rows) {
                            if (row.state == node.state) {
                                node.exp = row.exp * 1000;
                                node.imp = row.imp * 1000;
                                maxExp = updateMax(maxExp, node.exp);
                                maxImp = updateMax(maxImp, node.imp);
                            }
                        }

                        if (node.exp === undefined) {
                            console.log("UNDEFINED EXPORT " + node.state);
                        }
                        if (node.imp === undefined) {
                            console.log("UNDEFINED IMPORT " + node.state);
                        }
                    });

                    max_values.exp = maxExp;
                    max_values.imp = maxImp;
            });

            initZoom();
            resetZoom();
            svg.call(zoom);

            buildCallbacks();
            currentGraphViz = showBarChart;
            currentGraphViz();
        });
}

function updateMax(max, newMax) {
    if (newMax === undefined) return max;
    return max < newMax? newMax : max;
}

function buildColorPicker() {
    let picker = d3.select("#color-selection").html("");
    for (let category in stressor_categories) {
        picker.append("span").html(stressor_category_names[category]);
        picker.append("br");
        for (const str of stressor_categories[category]) {
            picker.append("input")
                .attr("type", "color")
                .attr("class", "stressor-color")
                .attr("name", str)
                .attr("value", stressors[str])
                .attr("id", "color-" + str)
                .on("input", function() {
                    stressors[str] = this.value;
                    currentGraphViz();
                });
            picker.append("span")
                .attr("class","text-ellipsis stressor-label")
                .html(stressor_names[str]);
        }
    }
}

function buildStressorSelector() {
    let stressorSelect = d3.select("#stressor-categories").html("");
    for (let strCategory in stressor_categories) {
        stressorSelect.append("input")
            .attr("type", "checkbox")
            .attr("class", "stressors-checkbox")
            .attr("value", strCategory)
            .attr("id", "stressors-checkbox-" + strCategory)
            .attr("checked", true)
            .on("click", function() { currentGraphViz(); });
        let label = stressorSelect.append("label")
            .attr("for", "stressors-checkbox-" + strCategory)
            .html(stressor_category_names[strCategory]);

        let stressorDetails = "";
        for (const str of stressor_categories[strCategory]) {
            stressorDetails = stressorDetails + stressor_names[str] + "<br>";
        }
        doLabelText(label, stressorDetails);
    }
    stressor_checkboxes = d3.selectAll(".stressors-checkbox");
}

//////////////////////////////
////////// DATA MODIFICATION /
//////////////////////////////

function filterStressors() {
    stressors_keys_in_use = [];
    //filter
    stressor_checkboxes.each(function() {
        if (d3.select(this).property("checked")) {
            stressors_keys_in_use = stressors_keys_in_use.concat(stressor_categories[d3.select(this).attr("value")]);
        }
    });
}

function filterNsort() {
    filterStressors();

    inputData = data.filter(item => item.area >= area_low_limit);

    // for (let i in data) { //not for input data, the objects are shared, but input is filtered -> some values are undefined then, here compute for all
    //     data[i].sum = 0;
    //     for (const stressor of stressors_keys_in_use) {
    //         data[i].sum += data[i][stressor];// * stressor_weights[stressor];
    //     }
    //     //data[i].sum = data[i].sum / stressors_keys_in_use.length;
    // }

    let maxSum = 0;
    for (let i in inputData) { //not for input data, the objects are shared, but input is filtered -> some values are undefined then, here compute for all
        inputData[i].sum = 0;
        for (const stressor of stressors_keys_in_use) {
            inputData[i].sum += inputData[i][stressor];// * stressor_weights[stressor];
        }
        maxSum = updateMax(maxSum, inputData[i].sum);
        //data[i].sum = data[i].sum / stressors_keys_in_use.length;
    }
    max_values.sum = maxSum;

    // sort
    inputData = inputData.sort(desc_comparator(sort_comparator_attr));
}

// sort node size evaluator, only for sort attributes (the max is impact - no sense in summing)
var nodeSizeCalculator = updateMax;
var nodeSizeCalculatorType = "max";
function setNodeSizeCalculator(type) {
    nodeSizeCalculatorType = type;
    switch(type) {
        case "sum":
            nodeSizeCalculator = addIfDefined;
            break;
        case "max":
        default:
            nodeSizeCalculator = updateMax;
            break;
    }
}
function filterHierarchical() {  //no order - do not sort
    filterStressors();

    let rootChildren = [];
    inputHierarchicalData = {
        children: rootChildren,
        name: "World"
    };

    inputHierarchicalDataSize = 0;
    let maxSumWorld = 0,
        maxSortWorld = 0;
    for (let continent in hierarchy) {
        let children = [];

        let maxSortContinent = 0,
            maxSumContinent = 0,
            continentObject = {
            name: continent.substring(5),
            children: children,
            parent: inputHierarchicalData
        }

        let continentstates = hierarchy[continent];
        for (let state in continentstates) {
            if (continentstates[state] == null) continue;
            if (isEezLeaf(continentstates[state])) {
                if (continentstates[state].area >= area_low_limit) {
                    inputHierarchicalDataSize++;
                    sumNodeStressors(continentstates[state]);
                    maxSortContinent = nodeSizeCalculator(maxSortContinent, continentstates[state][sort_comparator_attr]);
                    maxSumContinent = updateMax(maxSumContinent, continentstates[state].sum);

                    continentstates[state].parent = continentObject;
                    children.push(continentstates[state]);
                } else { //clear parent... (also recognize this node as unselected)
                    continentstates[state].parent = null;
                }
            } else {
                let maxSortState = 0,
                    maxSumState = 0,
                    eezChildren = [],
                    stateObject = {
                        children: eezChildren,
                        parent: continentObject
                    };

                for (let eezKey in continentstates[state]) {
                    if (continentstates[state][eezKey].area >= area_low_limit) {
                        inputHierarchicalDataSize++;
                        sumNodeStressors(continentstates[state][eezKey]);
                        maxSortState = nodeSizeCalculator(maxSortState, continentstates[state][eezKey][sort_comparator_attr]);
                        maxSumState = updateMax(maxSumState, continentstates[state][eezKey].sum);

                        continentstates[state][eezKey].parent = stateObject;
                        eezChildren.push(continentstates[state][eezKey]);
                    } else { //clear parent... (also recognize this node as unselected)
                        continentstates[state][eezKey].parent = null;
                    }
                }
                if (eezChildren.length > 0) {
                    stateObject.name = eezChildren[0].state;
                    stateObject.maxSort = maxSortState;
                    stateObject.maxSum = maxSumState;
                    maxSortContinent = nodeSizeCalculator(maxSortContinent, maxSortState);
                    maxSumContinent = updateMax(maxSumContinent, maxSumState);
                    children.push(stateObject);
                }
            }
        }
        continentObject.maxSort = maxSortContinent;
        continentObject.maxSum = maxSumContinent;
        maxSortWorld = nodeSizeCalculator(maxSortWorld, maxSortContinent);
        maxSumWorld = updateMax(maxSumWorld, maxSumContinent);
        rootChildren.push(continentObject);
    }
    inputHierarchicalData.maxSort = maxSortWorld;
    inputHierarchicalData.maxSum = maxSumWorld;
    max_values.sum = maxSumWorld;
    max_values.sort = maxSortWorld;
}

function sumNodeStressors(nodeitem) {
    nodeitem.sum = 0;
    for (const stressor of stressors_keys_in_use) {
        nodeitem.sum += nodeitem[stressor];
    }
}

function addIfDefined(base, value) {
    if (value === undefined) return base;
    return base + value;
}


//////////////////////////////
////////// COLORS AND lEGENDS /
//////////////////////////////

var selectedColorSpace;

let cumulativeColors = [
    [0.913 , "#0E4D64"],
    [1.826 , "#137177"],
    [2.739 , "#188977"],
    [3.0593 , "#1D9A6C"],
    [3.3795 , "#39A96B"],
    [3.6998 , "#56B870"],
    [4.02 , "#74C67A"],
    [6.013 , "#99D492"],
    [8.006 , "#BFE1B0"],
    [10 , "#DEEDCF"]
]

function getColorOfSpace(value) {
    var lastColor = "#0E4D64";
    for (const attr of selectedColorSpace) {
        if (attr[0] > value) {
            return lastColor;
        }
        lastColor = attr[1];
    }
    return lastColor;
}

//todo legend title?
function drawLegendMap(colorspace, hint) {
    legend.html(""); //clear
    legend.append("h3").html("Stressors legend");
    legend.append("div")
        .style("max-width", "500px")
        .html(hint);
    legend.append("span")
        .attr("class", "data-href")
        .html("(see detailed data description)")
        .on("click", function() {
           d3.select("#info-container").style("display", "block");
        });
    for (const color of colorspace) {
        legend.append("div")
            .attr("class", "legend-toon-bar")
            .style("background", color[1])
            .append("span")
            .attr("class", "legend-toon-bar-descriptor")
            .html(Math.round(color[0] * 100) / 100);
    }
}

function updateSVGMap() {
    let selectedAttr = current_cumulative,
        prefix = "Cumulative impact: ",
        hint = "High and low impact categories were classified as the top and bottom 25% of values, respectively, with " +
            "all other values categorized as medium. This led to cutoff values of >4.02 (high impact) and <2.739 (low impact).";

    if (stressors_keys_in_use.length != stressor_keys.length) {
        selectedColorSpace = [];
        prefix = "Average impact: ";
        hint = "Selected stressor categories are summed without weights applied (which is true for cumulative impact).";
        let max = max_values.sum,
            step = max / 10,
            value = 0,
            minColor = new Color("#0E4D64"),
            maxColor = new Color("#DEEDCF");
        for (let i = 0; i < 10; i++) {
            selectedColorSpace.push([value,
                LinearColorInterpolator.findColorBetween(minColor, maxColor, Math.round((value / max) * 100)).asRgbCss()]);
            value += step;
        }
        selectedAttr = "sum";
    } else {
        selectedColorSpace = cumulativeColors;
    }

    for (const datanode of data) {
        if (datanode.area >= area_low_limit) {
            datanode.node.style("fill", getColorOfSpace(datanode[selectedAttr]));
            datanode.currentdata = prefix + datanode[selectedAttr] +
                (datanode.notes && datanode.notes.length > 0 ? "<br>Notes about ownership/area data:<br>" + datanode.notes : "");
        } else {
            datanode.node.style("fill", "#2A2C39");
            datanode.currentdata = "Filtered out";
        }
    }

    drawLegendMap(selectedColorSpace, hint);
}

function showBarChart() {
    filterNsort();
    updateSVGMap();
    drawBarChart("#graph-data", compositeBarDrawer);
}

function showBarChartPlain() {
    filterNsort();
    updateSVGMap();
    drawBarChart("#graph-data", simpleBarDrawer);
}

let barchart_size = 30;
function drawBarChart(area, barDrawer) {

    d3.select("#graph-modifiers")
        .html(""); //clear if hierarchical did put some data

    let canvas = d3.select(area);
    canvas.html("");

    var margin = {top: 20, right: 30, bottom: 40, left: 180},
        width = 800 - margin.left - margin.right,
        height = Math.max(inputData.length, 20)*barchart_size - margin.top - margin.bottom;

    var graphsvg = canvas
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, 2 + max_values.sum])
        .range([ 0, width]);

    graphsvg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Y axis
    var y = d3.scaleBand()
        .range([ 0, height ])
        .domain(inputData.map(function(d) { return d.name; }))
        .padding(.05);
    graphsvg.append("g")
        .call(d3.axisLeft(y))


    graphsvg.selectAll("path").attr("stroke", "white");
    graphsvg.selectAll("line").attr("stroke", "white");
    graphsvg.selectAll("text").attr("fill", "white");

    //Bars
    let selection = graphsvg.selectAll("myRect")
        .data(inputData)
        .enter();

    let groups = selection.append("g")
        .attr("class", "pointer")
        .on("click", function(d) {
            zoomAtNodesAndSetTitle([d.node], d.descriptor);
        });

    barDrawer(x, y, selection, groups);
}

function compositeBarDrawer(x, y, selection, groups) {
    let offsets = {}
    selection.each(function(d) {
        offsets[d.id] = 0;
    });
    for (const stressor of stressors_keys_in_use) {
        groups.append("rect")
            .attr("class", stressor)
            .attr("x", function(d) { return x(0) + offsets[d.id]; })
            .attr("y", function(d) { return y(d.name); })
            .attr("width", function(d) {

                let width = x(d[stressor]);
                offsets[d.id] += width;
                return width;
            })
            .attr("height", y.bandwidth() )
            .attr("fill", stressors[stressor])
            .call(function (d) {
                doLabelCumulativeBarchart(d, stressor);
            });
    }
    groups.append("text")
        .attr("fill", "white")
        .attr("x", function(d) { return x(0) + offsets[d.id] + 12; })
        .attr("y", function(d) { return y(d.name) +barchart_size / 2; })
        .html(function(d) {
            return "Cumulative: " + d[current_cumulative] +
                " (sum: " + (Math.round(d.sum * 1000) / 1000) + ")"; })
        .style("font-size", "11px");
}

function simpleBarDrawer(x, y, selection, groups) {
    groups.append("rect")
        .attr("class", current_cumulative)
        .attr("x", function(d) { return x(0); })
        .attr("y", function(d) { return y(d.name); })
        .attr("width", function(d) {return x(d[current_cumulative]);})
        .attr("height", y.bandwidth() )
        .attr("fill", function(d) { return getColorOfSpace(d[current_cumulative]); })
        .call(function (d) {
            doPlainLabelCumulativeBarchart(d);
        });
}

function doLabelCumulativeBarchart(d3node, stressor) {
    d3node.on("mouseover", clickedNode => {
        let ruleset = sort_rules[sort_comparator_attr];

        tooltip.html(stressor_names[stressor] + ":&nbsp;" + clickedNode[stressor] +
            (ruleset !== undefined ? "<br>" + ruleset["name"] + ":&nbsp;" +
                ruleset["formatter"](clickedNode[sort_comparator_attr]) : "") +
            "<br>Ownership:&nbsp;" + clickedNode.state)
            .style("display", "block");
    }).on("mouseout", deselectedNode => {
        tooltip.style("display", "none");
    });
}

function doPlainLabelCumulativeBarchart(d3node) {
    d3node.on("mouseover", clickedNode => {
        let ruleset = sort_rules[sort_comparator_attr];

        tooltip.html("Cumulative impact :&nbsp;" + clickedNode[current_cumulative] +
            (ruleset !== undefined ? "<br>" + ruleset["name"] + ":&nbsp;" +
                ruleset["formatter"](clickedNode[sort_comparator_attr]) : "") +
            "<br>Ownership:&nbsp;" + clickedNode.state)
            .style("display", "block");
    }).on("mouseout", deselectedNode => {
        tooltip.style("display", "none");
    });
}

function showHierarchy() {
    filterHierarchical();
    updateSVGMap();
    drawHierarchicalGraph("#graph-data");
}

function drawHierarchicalGraph(area) {

    // set the dimensions and margins of the graph
    var width = 800;
    var height = inputHierarchicalDataSize * 50;

    let sizeSelector = d3.select("#graph-modifiers")
        .html("")
        .insert("select")
        .on("change", function() {
            setNodeSizeCalculator(d3.select(this).property("value"));
            currentGraphViz();
        });

    let maxSelect = sizeSelector.append("option")
        .property("value", "max");
    let sumSelect = sizeSelector.append("option")
        .property("value", "sum");
    if (nodeSizeCalculatorType == "max") {
        maxSelect.attr("selected", true);
    } else {
        sumSelect.attr("selected", true);
    }
    maxSelect.html("Node size: max");
    sumSelect.html("Node size: sum");


    var canvas = d3.select(area).html("")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(40,0)");  // bit of margin on the left = 40


    var cluster = d3.cluster()
        .size([height, width - 250]);  //250 margin

    var root = d3.hierarchy(inputHierarchicalData, function(d) {
        return d.children;
    });
    cluster(root);


    canvas.selectAll('path')
        .data( root.descendants().slice(1) )
        .enter()
        .append('path')
        .attr("d", function(d) {
            return "M" + d.y + "," + d.x
                + "C" + (d.parent.y + 50) + "," + d.x
                + " " + (d.parent.y + 150) + "," + d.parent.x // 50 and 150 are coordinates of inflexion, play with it to change links shape
                + " " + d.parent.y + "," + d.parent.x;
        })
        .style("fill", 'none')
        .attr("stroke", '#ccc')


    let groups = canvas.selectAll("g")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")"
        });

    groups.append("circle")
        .attr("r", function(d) {
            return graphNodeRadiusEvaluator(isEezLeaf(d.data) ? d.data[sort_comparator_attr] : d.data.maxSort);})
        .style("fill", function(d) {
            return getColorOfSpace(isEezLeaf(d.data) ? d.data.sum : d.data.maxSum);})
        .attr("stroke", "black")
        .style("stroke-width", 2)
        .attr("class", "pointer")
        .on("mouseover", d => {
            let ruleset = sort_rules[sort_comparator_attr];
            if (isEezLeaf(d.data)) {
                tooltip.html("Node: " + d.data.name + "<br>" +
                    "Impact:&nbsp;" + d.data.sum +
                    (ruleset !== undefined ? "<br>" + ruleset["name"] + ":&nbsp;" +
                        ruleset["formatter"](d.data[sort_comparator_attr]) : ""))
                    .style("display", "block");
            } else {
                tooltip.html("Node: " + d.data.name + "<br>" +
                    "Impact (max):&nbsp;" + d.data.maxSum +
                    (ruleset !== undefined ? "<br>" + ruleset["name"] + " (" + nodeSizeCalculatorType + "):&nbsp;" +
                        ruleset["formatter"](d.data.maxSort) :
                            (nodeSizeCalculatorType == "sum" ? "<br>Impact (sum): " + d.data.maxSort : "")
                    ))
                    .style("display", "block");
            }
        }).on("mouseout", d => {
            tooltip.style("display", "none");
        }).on("click", function(d) {
            if (isEezLeaf(d.data)) {
                zoomAtNodesAndSetTitle([d.data.node], d.data.descriptor);
            }
        });

    groups.append("text")
        .attr("fill", "white")
        .attr("y", -3)
        .attr("x", function(d) {
            return 8 + graphNodeRadiusEvaluator(isEezLeaf(d.data) ? d.data[sort_comparator_attr] : d.data.maxSort);})
        .html(function(d) {
            return d.data.id === undefined ? d.data.name: d.data.name ; })
        .style("font-size", "11px");
}

const maxNodeWidth = 50;
const minNodeWidth = 2;
function graphNodeRadiusEvaluator(value, attrType) {
    if (sort_comparator_attr == current_cumulative)
        return Math.max(minNodeWidth, maxNodeWidth * (value / max_values.sort));
    if (value === undefined) return minNodeWidth;
    return Math.max(minNodeWidth, maxNodeWidth * (value / max_values.sort));
}

//////////////////////////////////
//////// CLICK AND HOVER LOGIC ///
//////////////////////////////////

function buildCallbacks() {
    //for each region (continent)

    let list = d3.select("#selector").append("ul").attr("class", "region-list");

    $('#selector').on('click',function(){
        if($(this).attr('data-click-state') == 1) {
            $(this).animate({right: '-500px'});
            $(this).attr('data-click-state', 0);
        }  else {
            $(this).attr('data-click-state', 1);
            $(this).animate({right: '-50px'});
        }
    });

    $('#close-graph').click(function () {
        $("#graph-container").css({display: "none"});
        $("#graph-show").css({left: "-40px", filter: "brightness(0.5)"})
    });

    window.onmousemove = function (e) {
        var x = e.clientX,
            y = e.clientY;
        tooltip.style("top", (y + 20) + 'px');
        tooltip.style("left", (x + 20) + 'px');
    };

    $("#graph-show").on("click", function() {
        $("#graph-container").css({display: "block"});
        $("#graph-show").css({left: "-20px", filter: "brightness(1)"})
    });

    Object.entries(hierarchy).forEach(([continent,states]) => {
        let regionList = list.append("li")
            .attr("class", "continent")
            .html(d3.select("#"+continent).attr("name")).append("ul");

        //for each state
        Object.entries(states).forEach(([state,eezs]) => {
            // either GEEZ-State: [list of states] or EEZ-State: null
            if (state.length < 4) return; //TODO why does this happen...

            if (isEezLeaf(eezs)) {
                let name = eezs.name;
                let stateLi = regionList.append("li").html(name);

                if (eezs.parent_state != null) {
                    onNodeClick(eezs.parent_state, [eezs.parent_state, eezs.node], eezs.state);
                    stateLi.attr('class', 'pointer state');
                    onNodeClick(stateLi, [eezs.parent_state, eezs.node], eezs.state);
                } else {
                    stateLi.attr('class', 'pointer state');
                    onNodeClick(stateLi, [eezs.node], name);
                }
                eezs.descriptor = name;
                doLabelDataNode(eezs.node, eezs, "", "currentdata");

                onNodeClick(eezs.node, [eezs.node], name);
            } else {
                let [firstChild] = Object.keys(eezs);
                let stateName = eezs[firstChild].state;
                let stateLi = regionList.append("li").html(stateName);
                let eezList = stateLi.append("ul");

                let childlist = [];

                var stateNode = d3.select("#" + state.substring(5));

                for (let eezKey in eezs) {
                    let eez = eezs[eezKey].node;
                    let eez_parent = eezs[eezKey].parent_state;
                    childlist.push(eez);
                    let eezLi = eezList.append("li").html(eezs[eezKey].name);
                    let eezName = stateName + ": " + eezs[eezKey].name;
                    eezs[eezKey].descriptor = eezName;

                    doLabelDataNode(eez, eezs[eezKey], "", "currentdata");
                    onNodeClick(eez, [eez], eezName);

                    eezLi.attr('class', 'pointer eez');
                    onNodeClick(eezLi, [eez], eezName);
                }
                if (!stateNode.empty()) {
                    childlist.push(stateNode);
                    onNodeClick(stateNode, childlist, stateName);
                }
                stateLi.attr('class', 'pointer state');
                onNodeClick(stateLi, childlist, stateName);
            }
        });
    });
}

function onNodeClick(d3node, nodesToZoomOn, titleText) {
    d3node.on('click', wrapZoomCallbackEEZ(nodesToZoomOn, titleText));
}

function wrapZoomCallbackEEZ(nodesToZoomOn, titleText) {
    return function() {
        zoomAtNodesAndSetTitle(nodesToZoomOn, titleText);
    }
}

function zoomAtNodesAndSetTitle(nodesToZoomOn, titleText) {
    zoomAtNodes(nodesToZoomOn);
    title.html(titleText);
    d3.event.stopPropagation();
}

function doLabelDataNode(d3node, dataNode, prefixText, attributeToRead) {
    d3node.on("mouseover", clickedNode => {
        let text = dataNode[attributeToRead];
        if (text !== undefined && text != null) {
            tooltip.html(prefixText + text).style("display", "block");
        }
    }).on("mouseout", deselectedNode => {
        tooltip.style("display", "none");
    });
}

function doLabelText(d3node, text) {
    d3node.on("mouseover", clickedNode => {
        tooltip.html(text).style("display", "block");
    }).on("mouseout", deselectedNode => {
        tooltip.style("display", "none");
    });
}

var selection = [];
function clearSelection() {
    while(selection.length) {
        selection.pop().style("stroke-width", "")
            .style("stroke", "");
    }
}
function setSelected(node, isEez) {
    selection.push(node);
    node.style("stroke-width", 0.5)
        .style("stroke", "red");
}

//////////////////////////////////////////
////////// ZOOM //////////////////////////
//////////////////////////////////////////
//https://codepen.io/ssz360/pen/jOPMwme


function initZoom() {
    zoom = d3.zoom().on("zoom", function () {
        countriesGroup.attr("transform", d3.event.transform)
    });
}

// Function that calculates zoom/pan limits and sets zoom to default value 
function resetZoom() {
    // Define a "minzoom" whereby the "Countries" is as small possible without leaving white space at top/bottom or sides

    minZoom = Math.max($("#map_div").width() / w, $("#map_div").height() / h);
    // set max zoom to a suitable factor of this value
    maxZoom = 7 * minZoom;
    // set extent of zoom to chosen values
    // set translate extent so that panning can't cause map to move out of viewport
    zoom
        .scaleExtent([minZoom, maxZoom])
        .translateExtent([[0, 0], [w, h]])
    ;
    // define X and Y offset for centre of map to be shown in centre of holder
    midX = ($("#map_div").width() - minZoom * w) / 2;
    midY = ($("#map_div").height() - minZoom * h) / 2;
    // change zoom transform to min zoom and centre offsets
    svg.call(zoom.transform, d3.zoomIdentity.translate(midX, midY).scale(minZoom));

}

function zoomAtNodes(nodes) {
    clearSelection();
    let box = [Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE];

    for(var i = 0; i < nodes.length; i += 1) {
        setSelected(nodes[i]);
        let nodebox = nodes[i].node().getBBox();
        if (box[0] > nodebox.x) box[0] = nodebox.x;
        if (box[1] > nodebox.y) box[1] = nodebox.y;
        if (box[2] < nodebox.x + nodebox.width) box[2] = nodebox.x + nodebox.width;
        if (box[3] < nodebox.y + nodebox.height) box[3] = nodebox.y + nodebox.height;
    }
    boxZoom({x:box[0], y:box[1], width:box[2]-box[0], height:box[3]-box[1]}, 40);
}

// zoom to show a bounding box, with optional additional padding as percentage of box size
function boxZoom(box, paddingPerc) {

    let centroid = centroidFromBox(box);

    minXY = [box.x, box.y];
    maxXY = [box.x + box.width, box.y + box.height];
    maxXY = [box.x + box.width, box.y + box.height];
    // find size of map area defined
    zoomWidth = Math.abs(minXY[0] - maxXY[0]);
    zoomHeight = Math.abs(minXY[1] - maxXY[1]);
    // find midpoint of map area defined
    zoomMidX = centroid[0];
    zoomMidY = centroid[1];
    // increase map area to include padding
    zoomWidth = zoomWidth * (1 + paddingPerc / 100);
    zoomHeight = zoomHeight * (1 + paddingPerc / 100);
    // find scale required for area to fill svg
    maxXscale = $("svg").width() / zoomWidth;
    maxYscale = $("svg").height() / zoomHeight;
    zoomScale = Math.min(maxXscale, maxYscale);
    // handle some edge cases
    // limit to max zoom (handles tiny countries)
    zoomScale = Math.min(zoomScale, maxZoom);
    // limit to min zoom (handles large countries and countries that span the date line)
    zoomScale = Math.max(zoomScale, minZoom);
    // Find screen pixel equivalent once scaled
    offsetX = zoomScale * zoomMidX;
    offsetY = zoomScale * zoomMidY;
    // Find offset to centre, making sure no gap at left or top of holder


    dleft = Math.min(0, $("svg").width() / 2 - offsetX);
    dtop = Math.min(0, $("svg").height() / 2 - offsetY);
    // Make sure no gap at bottom or right of holder
    dleft = Math.max($("svg").width() - w * zoomScale, dleft);
    dtop = Math.max($("svg").height() - h * zoomScale, dtop);
    // set zoom
    svg
        .transition()
        .duration(500)
        .call(
            zoom.transform,
            d3.zoomIdentity.translate(dleft, dtop).scale(zoomScale)
        );
}

function centroidFromNode(node) {
    return centroidFromBox(node.node().getBBox());
}

function centroidFromBox(bbox) {
    return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
}


// on window resize
$(window).resize(function() {
    // Resize SVG
    svg.select("svg").attr("width", $("#map_div").width()).attr("height", $("#map_div").height());
    resetZoom();
});
