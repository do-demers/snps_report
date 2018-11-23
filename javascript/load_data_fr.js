"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var dispatch = d3.dispatch("load_choice", "load_table", "update_table", "load_chart", "update_chart");

var start_dept = ["Environnement et Changement climatique Canada"];
var start_Q = ["ADV_05_f"];
var start_label = ["Depuis combien temps travaillez-vous conseiller en dotation FPF (ADV_05)"];
var start_theme = ["Nombre d'années d'expérience des employés"];

var fmt_pct = d3.format(".1%");
var formatPercent = d3.format(".0%");

    // if (typeof window.AudioContext !== "undefined") {
    //
    //     var context = new window.AudioContext;
    //     var oscillator = context.createOscillator();
    //     oscillator.start();
    //
    //  } else if (typeof window.webkitAudioContext !== "undefined") {
    //     var context =  new window.webkitAudioContext;
    //     var oscillator = context.createOscillator();
    //     oscillator.start();
    // } else {
    //
    // }

var z = d3.scaleOrdinal(d3.schemeCategory20);

function test_func(error, var_info, sos_tbl_data, resp_table) {

    var groups = _.groupBy(sos_tbl_data, function (value) {
        return value.question_name + '#' + value.final_dept_f;
    });

    var new_table_data = _.map(groups, function (group) {

        var mapped = _.map(group, function (ans) {
            return _defineProperty({}, ans.question_value, ans.shr_w_resp);
        });


        var ans_keys = _.uniq(_.map(group, function (key) {
            return key.question_value;
        }));

        var newObj2 =  _.extend.apply(null, mapped);

        var newObj3 =  _.extend(newObj2, {
            DEPT: group[0].final_dept_f,
            DEPT_en: group[0].final_dept_e,
            DPTSIZE: group[0].DPTSIZE_f,
            Question: group[0].question_name,
            answer_keys : ans_keys
        });

        return newObj3;
    });

    dispatch.call("load_choice", undefined, new_table_data, var_info, resp_table);
    dispatch.call("load_table", undefined, new_table_data, resp_table);

}
function init() {
    d3.queue()
        .defer(d3.csv, 'csv/VARIABLES_FOR_D3.csv')
        .defer(d3.csv, 'csv/SNPS_REPORT_FINAL_FR.csv')
        .defer(d3.csv, 'csv/survey_response.csv')
        .await(test_func); //only function name is needed
}

init();
