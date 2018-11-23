"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

dispatch.on("load_table", function (tbl_data, resp_table) {


   d3.select("#pdf_div")
        .attr("href", "pdf/" + start_dept[0].toLowerCase().replace(/\s/g, '-') + "_en.pdf")

    d3.select("#org_th").text(_.uniq(_.pluck(_.where(resp_table, {dept_en: start_dept[0]}),"dept_en")));
    d3.select("#tbl_emp").text(_.pluck(_.where(resp_table, {dept_en: start_dept[0], respondent: "Number of employees" }),"n" ));
    d3.select("#tbl_resp").text(_.pluck(_.where(resp_table, {dept_en: start_dept[0], respondent: "Number of respondents" }),"n" ));
    d3.select("#tbl_stf").text(_.pluck(_.where(resp_table, {dept_en: start_dept[0], respondent: "Number of staffing advisors" }),"n" ));
    d3.select("#tbl_man").text(_.pluck(_.where(resp_table, {dept_en: start_dept[0], respondent: "Number of managers or supervisors" }),"n" ));
    d3.select("#tbl_man_2").text(_.pluck(_.where(resp_table, {dept_en: start_dept[0], respondent: "Number of managers who hired or attempted to hire an indeterminate or term employee between January 1 and December 31, 2017" }),"n"));

     var dept_size =  _.uniq(_.pluck(_.filter(tbl_data, function (row) {
        return _.contains(start_dept, row.DEPT) ;
    }), 'DPTSIZE'))

    var filt_SOS_data = _.filter(tbl_data, function (row) {
        return (_.contains(start_dept, row.DEPT)  || _.contains(dept_size, row.DEPT) || _.contains(["All organisations"], row.DEPT)) && _.contains(start_Q, row.Question);
    });

    var order = {};
    order[start_dept] = 1;
    order[dept_size] = 2;
    order["All organisations"] = 3

    filt_SOS_data.sort(function (a, b) {
        return order[a.DEPT] - order[b.DEPT];
    });

    var new_answer_keys = _.uniq(_.flatten(_.pluck(filt_SOS_data, 'answer_keys')));

    var columns = ["DEPT"].concat(_toConsumableArray(new_answer_keys));

    var table = d3.select("#adv_tbl");
    // table
    //     .append("caption")
    //     .text("Staffing and Non-Partisanship Survey - Results")

    var thead = table.append('thead');
    var tbody = table.append('tbody');

    thead
        .append('tr')
        .attr("class", "active")
        .selectAll('th')
        .data(columns)
        .enter()
        .append('th')
        .attr("scope","col")
        .text(function (label) {
            return label === "DEPT" ? "Organisation" : label;
        });

    var rows_grp = tbody.selectAll('tr').data(filt_SOS_data);

    var rows_grp_enter = rows_grp.enter().append('tr');

    rows_grp_enter.merge(rows_grp);

    rows_grp_enter.selectAll('td').data(function (row) {
        return columns.map(function (column) {
            return { column: column, value: row[column], dept: row.DEPT };
        });
    }).enter().append('td')
        .attr("scope",function (d,i) {
            return i === 0 ? "row" : undefined;
        })
        .html(function (d) {
            return isNaN(d.value) ? d.value : d.column === "total" ? d.value : fmt_pct(d.value);
    })


    dispatch.on("update_table", function (d) {

        var answer_keys_2 = _.uniq(_.flatten(_.pluck(d, 'answer_keys')));

        var new_columns = ["DEPT"].concat(_toConsumableArray(answer_keys_2));

        var table_u = d3.select('table');

        var tbody_u = table_u.select('tbody');

        var thead_u = table_u.select('thead').select('tr');

        var thead_u_th = thead_u.selectAll('th').data(new_columns);

        thead_u_th.exit().remove();

        var thead_u_th_enter = thead_u_th.enter().append('th');

        thead_u_th.merge(thead_u_th_enter).text(function (label) {
            return label === "DEPT" ? "Organisation" : label;
        });

        var rows_grp_u = tbody_u.selectAll('tr').data(d);

        rows_grp_u.exit().remove();

        var rows_grp_enter_u = rows_grp_u.enter().append('tr');

        var new_tds = rows_grp_u.merge(rows_grp_enter_u).selectAll('td').data(function (row) {
            return new_columns.map(function (column) {
                return { column: column, value: row[column], dept: row.DEPT };
            });
        });
        new_tds.exit().remove();

        new_tds
            .attr("scope",function (d,i) {
                return i === 0 ? "row" : undefined;
            })
            .html(function (d) {
                return isNaN(d.value) ? d.value : d.column === "total" ? d.value : fmt_pct(d.value);
            });

        new_tds.enter().append('td')
            .attr("scope",function (d,i) {
                return i === 0 ? "row" : undefined;
            })
            .html(function (d) {
                return isNaN(d.value) ? d.value : d.column === "total" ? d.value : fmt_pct(d.value);
        });
    });
});
