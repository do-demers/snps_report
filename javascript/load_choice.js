"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

dispatch.on("load_choice", function (load_data, question_info, resp_table) {

    var drop_box = function drop_box(id_name, variable, start_val) {
        var select_list;

        if (variable === "Question") {

            var question_infox = _.where(question_info, { label_en: start_val[0] })[0].theme_en;
            var questions_for_theme = _.where(question_info, { theme_en: question_infox });

            select_list = _.uniq(_.pluck(questions_for_theme, "label_en")).sort();

        } else if (variable === "theme_en") {
            select_list = _.uniq(_.pluck(question_info, "theme_en")).sort();
        } else {
            select_list = _.without(_.uniq(_.pluck(load_data, variable)), 'All organisations', 'Large (>= 2, 000)', 'Medium (500 to 1,999)', 'Small (100 to 499)', 'Very small (<100)', 'Not stated').sort();
        }

        var sel_var = d3.select(id_name).selectAll("option").data(select_list);

        sel_var.exit().remove();

        var sel_dept_enter = sel_var.enter().append("option");

        sel_dept_enter.merge(sel_var).attr("value", function (d) {
            return d;
        }).text(function (d) {
            return d;
        });

        d3.select(id_name).property("value", start_val).on("change", function () {

            var selectedDeptArray = new Array();
            var selObj = document.getElementById('sel_dept');
            var i;
            var count = 0;
            for (i=0; i<selObj.options.length; i++) {
                if (selObj.options[i].selected) {
                    selectedDeptArray[count] = selObj.options[i].value;
                    count++;
                }
            }

            var current_depts = selectedDeptArray;

            d3.select("#org_th").text(_.uniq(_.pluck(_.where(resp_table, {dept_en: current_depts[0]}),"dept_en")));
            d3.select("#tbl_emp").text(_.pluck(_.where(resp_table, {dept_en: current_depts[0], respondent: "Number of employees" }),"n" ));
            d3.select("#tbl_resp").text(_.pluck(_.where(resp_table, {dept_en: current_depts[0], respondent: "Number of respondents" }),"n" ));
            d3.select("#tbl_stf").text(_.pluck(_.where(resp_table, {dept_en: current_depts[0], respondent: "Number of staffing advisors" }),"n" ));
            d3.select("#tbl_man").text(_.pluck(_.where(resp_table, {dept_en: current_depts[0], respondent: "Number of managers or supervisors" }),"n" ));
            d3.select("#tbl_man_2").text(_.pluck(_.where(resp_table, {dept_en: current_depts[0], respondent: "Number of managers who hired or attempted to hire an indeterminate or term employee between January 1 and December 31, 2017" }),"n"));

            d3.select("#pdf_div")
                // .attr("href", "pdf/" + current_depts + "_en.pdf")
                .attr("href", "pdf/" + current_depts[0].toLowerCase().replace(/\s/g, '-') + "_en.pdf")

            if (this.id === "sel_theme") {

                var current_theme = d3.select("#sel_theme").property("value");

                var current_label = _.filter(question_info, function (row) {
                    return _.contains([current_theme], row.theme_en);
                })[0]["label_en"];

                var current_q_num = _.filter(question_info, function (row) {
                    return _.contains([current_theme], row.theme_en);
                })[0]["var_name_e"];

                var current_question = _.uniq(_.pluck(_.filter(load_data, function (row) {
                    return _.contains([current_q_num], row.Question);
                }), "Question"))[0];

                drop_box("#sel_question", "Question", [current_label]);

            } else {

                var current_label = d3.select("#sel_question").property("value");

                var current_q_num = _.filter(question_info, function (row) {
                    return _.contains([current_label], row.label_en);
                })[0]["var_name_e"];

                var current_question = _.uniq(_.pluck(_.filter(load_data, function (row) {
                    return _.contains([current_q_num], row.Question);
                }), "Question"))[0];
            }

            var dept_size =  _.uniq(_.pluck(_.filter(load_data, function (row) {
                return _.contains(current_depts, row.DEPT) ;
            }), 'DPTSIZE'))


            var new_TBL_data = _.filter(load_data, function (row) {
                return ( _.contains(current_depts, row.DEPT)  || _.contains(dept_size, row.DEPT) || _.contains(["All organisations"], row.DEPT)) && _.contains([current_question], row.Question) ;
            });

            var order = {};
            order[current_depts] = 1;
            order[dept_size] = 2;
            order["All organisations"] = 3

            new_TBL_data.sort(function (a, b) {
                return order[a.DEPT] - order[b.DEPT];
            });

            var current_q_long = _.filter(question_info, function (row) {
                return _.contains([current_question], row.var_name_e);
            })[0]["full_variable_question"];

            debugger;
            d3.select("#quest_div").text(current_q_long);

            dispatch.call("update_table", this, new_TBL_data);

        });
    };

    debugger;
    var start_q_long = _.filter(question_info, function (row) {
        debugger;
        return _.contains(start_label, row.label_en);
    })[0]["full_variable_question"];

    d3.select("#quest_div").text(start_q_long);
    drop_box("#sel_theme", "theme_en", start_theme);
    drop_box("#sel_dept", "DEPT", start_dept);
    drop_box("#sel_question", "Question", start_label);

});