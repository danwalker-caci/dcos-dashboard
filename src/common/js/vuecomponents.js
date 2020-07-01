var SLASH = "/";
var tp1 = new String(window.location.protocol);
var tp2 = new String(window.location.host);
var site = tp1 + SLASH + SLASH + tp2 + _spPageContextInfo.webServerRelativeUrl;
//var recommendations = [];
// #region DashboardLayoutTemplate
var DashboardLayoutTemplate = "";
DashboardLayoutTemplate += "<div class='container-fluid dashboard'>";
DashboardLayoutTemplate += "    <div class='row'>";
DashboardLayoutTemplate += "    	<div class='col-xs-12 col-sm-12 col-md-4 col-lg-4 padlr5'>";

DashboardLayoutTemplate += "    	<\/div>";
DashboardLayoutTemplate += "    	<div class='col-xs-12 col-sm-12 col-md-4 col-lg-4 padlr5'>";

DashboardLayoutTemplate += "    	<\/div>";
DashboardLayoutTemplate += "    	<div class='col-xs-12 col-sm-12 col-md-4 col-lg-4 padlr5'>";
DashboardLayoutTemplate += "            <div class='panel panel-black' id='pnlCKOData'>";
DashboardLayoutTemplate += "                <div class='panel-heading'>CKO</div>";
DashboardLayoutTemplate += "                <div class='panel-body'>";
DashboardLayoutTemplate += "                    <cko-widget></cko-widget>";
DashboardLayoutTemplate += "    	        <\/div>";
DashboardLayoutTemplate += "    	    <\/div>";
DashboardLayoutTemplate += "    	<\/div>";
DashboardLayoutTemplate += "    <\/div>";
DashboardLayoutTemplate += "<\/div>";
// #endregion

// #region RecommendationsTableTemplate
var CKOWidgetTemplate = "";
CKOWidgetTemplate += "<table id='tblCKOData' class='ckodatatable' cellspacing='0' cellpadding='0' class='table table-bordered table-hover'>"
CKOWidgetTemplate += "<thead><tr><th>Title</th><th>Date</th></tr></thead>";
CKOWidgetTemplate += "<tbody>";
CKOWidgetTemplate += "<tr id='CKOLoadingRow'><td colspan='2'>";
CKOWidgetTemplate += "<table style='height:100%;width:100%;'>";
CKOWidgetTemplate += "<tr><td align='center'><img src='/_layouts/images/gears_an.gif' /></td></tr>";
CKOWidgetTemplate += "<tr><td align='center'><div style='margin-top: 10px; font-size: 16px;'>Getting Data...Please wait.</div></td></tr>";
CKOWidgetTemplate += "</table>";
CKOWidgetTemplate += "</td></tr>";
CKOWidgetTemplate += "<tr v-for='item in items'>";
CKOWidgetTemplate += "<td><a class='titlelink' @click='ViewItem(item.Id)'>{{item.Title}}</a></td>";
CKOWidgetTemplate += "<td>{{formatDate(item.Date)}}</td></tr>";
CKOWidgetTemplate += "</tbody></table>";
// #endregion
// #region ImplementedByOrgTemplate
var ImplementedByOrgTemplate = "";
ImplementedByOrgTemplate += "<div id=\"IBOChart\">";
ImplementedByOrgTemplate += "    <table style=\"height:100%;width:100%;\">";
ImplementedByOrgTemplate += "        <tr><td align='center'><img src='\/_layouts\/images\/gears_an.gif' \/><\/td><\/tr>";
ImplementedByOrgTemplate += "        <tr><td align='center'><div style='margin-top: 10px; font-size: 16px;'>Getting Data...Please wait.<\/div><\/td><\/tr>";
ImplementedByOrgTemplate += "    <\/table>";
ImplementedByOrgTemplate += "<\/div>";
// #endregion
// #region AI2Options
var AI2Options = "<option></option>";
AI2Options += "<option>Acquisition</option>";
AI2Options += "<option>Communications</option>";
AI2Options += "<option>Cyber</option>";
AI2Options += "<option>Equipping</option>";
AI2Options += "<option>Finance</option>";
AI2Options += "<option>Intelligence</option>";
AI2Options += "<option>Leader Development</option>";
AI2Options += "<option>Logistics</option>";
AI2Options += "<option>Military and Civilian Manning</option>";
AI2Options += "<option>Medical</option>";
AI2Options += "<option>Network</option>";
AI2Options += "<option>Readiness</option>";
AI2Options += "<option>Research / Development / Engineering</option>";
AI2Options += "<option>Security</option>";
AI2Options += "<option>Training</option>";
AI2Options += "<option>Warfighting</option>";
AI2Options += "<option>Z – Other</option>";
AI2Options += "</select>";
// #endregion

var CKOWidget = {
    template: CKOWidgetTemplate,
    data: function () {
        return {
            data: [],
            items: []
        }
    },
    created: function () {
        this.getDirectives(null);
    },
    methods: {
        getDirectives: function (zurl) {
            var urlString = "https://hq.tradoc.army.mil/sites/OCKO/PMT/_vti_bin/listdata.svc/Directives?$select=Id,Directive,SuspenseDate,DirectiveStatusValue,ReportRequiredValue&$filter=(ReportRequiredValue eq 'Yes') and (DirectiveStatusValue eq 'InProgress')&$orderby=SuspenseDate";
            var cko = this;
            jQuery.ajax({
                url: urlString,
                method: "GET",
                headers: { 'accept': 'application/json; odata=verbose' },
                error: function (jqXHR, textStatus, errorThrown) {
                    logit("Error Status: " + textStatus + ":: errorThrown: " + errorThrown);
                },
                success: function (data) {
                    var results = data.d.results;
                    var j = jQuery.parseJSON(JSON.stringify(results));
                    for (i = 0; i < j.length; i++) {
                        cko.data.push({
                            Title: j[i]["Directive"],
                            Url: "https://hq.tradoc.army.mil/sites/OCKO/PMT/Directives/DispForm.aspx?ID=" + j[i]["Id"],
                            Date: j[i]["SuspenseDate"]
                        })
                    }
                    cko.getEvents();
                }
            });
        },
        getEvents: function (zurl) {
            var urlString = "https://hq.tradoc.army.mil/sites/OCKO/cko/_vti_bin/listdata.svc/CalendarEvents?$select=Id,Title,ReportRequiredValue,StartTime,EndTime&$filter=(ReportRequiredValue eq 'Yes') and (EndTime ge datetime'" + moment().format('YYYY-MM-DD[T]HH:MM:[00Z]') + "')&$orderby=EndTime";
            var cko = this;
            jQuery.ajax({
                url: urlString,
                method: "GET",
                headers: { 'accept': 'application/json; odata=verbose' },
                error: function (jqXHR, textStatus, errorThrown) {
                    logit("Error Status: " + textStatus + ":: errorThrown: " + errorThrown);
                },
                success: function (data) {
                    var results = data.d.results;
                    var j = jQuery.parseJSON(JSON.stringify(results));
                    for (i = 0; i < j.length; i++) {
                        cko.data.push({
                            Title: j[i]["Title"],
                            Url: "https://hq.tradoc.army.mil/sites/OCKO/cko/CalendarEvents/DispForm.aspx?ID=" + j[i]["Id"],
                            Date: j[i]["StartTime"]
                        })
                    }
                    cko.items = cko.data;
                    return cko.items;
                }
            });
        },
        formatDate: function (d) {
            return d === null ? "" : moment(d).format("MM-DD-YYYY");
        },
        ViewItem: function (url) {
            CKODialog(url, 'Item Information', '1100', '800', 'NotificationCallback');
        }
    },
    updated: function () {
        this.$nextTick(function () {
            $("#LoadingRow").remove();

            $('#tblRecommendations thead th').each(function () {
                var title = $('#tblRecommendations thead th').eq($(this).index()).text();
                if (title.indexOf("AI2") >= 0) {
                    $(this).html(title + '<br/><select style="width: 85%;">' + AI2Options + '</select>');
                }
                else {
                    $(this).html(title + '<br/><input type="text" placeholder="Search" style="width: 85%;" />');
                }
            });

            var rectable = $("#tblRecommendations").DataTable({
                scrollY: "300px",
                "order": [[1, "asc"]]
            });

            rectable.columns().eq(0).each(function (colIdx) {
                var zhtml = $(this).html();
                $('input', rectable.column(colIdx).header()).on('keyup change', function () {
                    rectable
                        .column(colIdx)
                        .search(this.value)
                        .draw();
                });

                $('select', rectable.column(colIdx).header()).on('change', function () {
                    rectable
                        .column(colIdx)
                        .search(this.value)
                        .draw();
                });

                $('input', rectable.column(colIdx).header()).on('click', function (e) {
                    e.stopPropagation();
                });

                $('select', rectable.column(colIdx).header()).on('click', function (e) {
                    e.stopPropagation();
                });
            });
        });
    }
}

var RecSummaryTable = {
    template: RECSummaryTemplate,
    data: function () {
        return {
            recommendations: [],
        }
    },
    created: function () {
        this.getTableData(null);
    },
    methods: {
        getTableData: function (zurl) {
            if (zurl === null) {
                zurl = site + "/_vti_bin/listdata.svc/Recommendations?";
                zurl += "$select=Id,Created,RecommendationStatusValue";
            }
            logit("SUMMARY URL: " + zurl);
            var rs = this;
            jQuery.ajax({
                url: zurl,
                method: "GET",
                headers: { 'accept': 'application/json; odata=verbose' },
                error: function (jqXHR, textStatus, errorThrown) {
                    logit("Error Status: " + textStatus + ":: errorThrown: " + errorThrown);
                },
                success: function (data) {
                    rs.recommendations = rs.recommendations.concat(data.d.results);
                    if (data.d.__next) {
                        zurl = data.d.__next;
                        rs.getTableData(zurl);
                    }
                    else {
                        rs.recommendations = jQuery.parseJSON(JSON.stringify(rs.recommendations));
                        rs.drawTable(rs.recommendations);
                    }
                }
            });
        },
        drawTable: function (recs) {
            var total = 0, active = 0, imp = 0, notimp = 0;
            for (i = 0; i < recs.length; i++) {
                var status = recs[i]["RecommendationStatusValue"];
                status = status.split(":")[0];
                switch (status) {
                    case "Implemented":
                        imp += 1;
                        total += 1;
                        break;

                    case "Not Implemented":
                        notimp += 1;
                        total += 1;
                        break;

                    default:
                        active += 1;
                        total += 1;
                        break;
                }
            }
            var html = "<div class='container-fluid'>";
            html += "<div class='row summaryrow'><div class='col-xs-6 summarytext'>Active:</div><div class='col-xs-6'><span class='summaryvalue'>";
            html += active;
            html += "</span></div></div>";
            html += "<div class='row summaryrow'><div class='col-xs-6 summarytext'>Implemented:</div><div class='col-xs-6'><span class='summaryvalue'>";
            html += imp;
            html += "</span></div></div>";
            html += "<div class='row summaryrow'><div class='col-xs-6 summarytext'>Not Implemented:</div><div class='col-xs-6'><span class='summaryvalue'>";
            html += notimp;
            html += "</span></div></div>";
            html += "<div class='row summaryrow'><div class='col-xs-6 summarytext'>Total:</div><div class='col-xs-6'><span class='summaryvalue'>";
            html += total;
            html += "</span></div></div>";
            html += "</div>"
            $("#RecSummary").html("").append(html);
        }
    }
}

var RecommendationsByStatus = {
    template: RecommendationsByStatusTemplate,
    data: function () {
        return {
            recommendations: []
        }
    },
    created: function () {
        this.getTableData(null);
    },
    methods: {
        getTableData: function (zurl) {
            if (zurl === null) {
                zurl = site + "/_vti_bin/listdata.svc/Recommendations?";
                zurl += "$select=Id,RecommendationStatusValue";
                zurl += "&$filter=(not substringof('Implemented', RecommendationStatusValue))";
            }
            logit("RBS URL: " + zurl);
            var rbs = this;
            jQuery.ajax({
                url: zurl,
                method: "GET",
                headers: { 'accept': 'application/json; odata=verbose' },
                error: function (jqXHR, textStatus, errorThrown) {
                    logit("Error Status: " + textStatus + ":: errorThrown: " + errorThrown);
                },
                success: function (data) {
                    rbs.recommendations = rbs.recommendations.concat(data.d.results);
                    if (data.d.__next) {
                        zurl = data.d.__next;
                        rbs.getTableData(zurl);
                    }
                    else {
                        rbs.recommendations = jQuery.parseJSON(JSON.stringify(rbs.recommendations));
                        rbs.drawPieChart(rbs.recommendations);
                    }
                }
            });
        },
        drawPieChart: function (recs) {
            var stats = ['New', 'Initial Review', 'Task Order', 'Pending Final Review', 'Pending Implementation'];
            var chartdata = [];
            for (i = 0; i < stats.length; i++) {
                chartdata.push({
                    'name': stats[i],
                    'y': 0
                });
            }
            for (i = 0; i < recs.length; i++) {
                var status = recs[i]["RecommendationStatusValue"];
                status = status.split(":")[0];
                for (k = 0; k < chartdata.length; k++) {
                    if (chartdata[k].name === status) {
                        chartdata[k]['y'] += 1;
                    }
                }
            }
            Highcharts.chart('RBSChart', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Active Recommendations By Status'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.y}</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.y}',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                series: [{
                    name: 'Status',
                    colorByPoint: true,
                    data: chartdata
                }]
            });
        }
    },
    updated: function () {
        this.$nextTick(function () {
            
        })
    }
}

var DashboardLayout = {
    template: DashboardLayoutTemplate,
    data: function () {
        return {
            msg: 'component loaded'
        }
    },
    components: {
        'cko-widget': CKOWidget
        //'recommendations-by-status': RecommendationsByStatus,
        //'recommendations-by-org': RecommendationsByOrg,
        //'recommendations-implemented-by-org': ImplementedByOrg,
        //'recommendations-summary': RecSummaryTable
    }
}
