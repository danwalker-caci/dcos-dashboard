<template>
  <div id="TaskerData">
    <div v-if="loading" class="widgetbody"><span class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</span></div>
    <vue-highcharts class="chart" :options="chartOptions" ref="pieCharts"></vue-highcharts>
    <b-modal id="taskertables" ref="taskertable" centered size="lg" title="Tasker Data">
      <div class="container-fluid">
        <table id='tblOverdue' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-taskers'>
          <thead>
            <tr><th class="control">Control</th><th class="suspense">Suspense</th><th>Title</th><th class="tasklead">Leads</th></tr>
          </thead>
          <tbody>
            <tr v-for='due in overdue'>
              <td class="control">{{due.ControlNumber}}</td>
              <td class="suspense">{{formatDate(due.SuspenseDate)}}</td>
              <td><a @click="popup(due.ID, due.TaskerName, due.TaskDeliverables)" class="poplink">{{due.TaskerName}}</a></td>
              <td class="tlead">{{due.TaskerLeads}}</td>
            </tr>
          </tbody>
        </table>
        <table id='tblThirty' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-taskers'>
          <thead>
            <tr><th class="control">Control</th><th class="suspense">Suspense</th><th>Title</th><th class="tasklead">Leads</th></tr>
          </thead>
          <tbody>
            <tr v-for='due in thirty'>
              <td class="control">{{due.ControlNumber}}</td>
              <td class="suspense">{{formatDate(due.SuspenseDate)}}</td>
              <td><a @click="popup(due.ID, due.TaskerName, due.TaskDeliverables)" class="poplink">{{due.TaskerName}}</a></td>
              <td class="tlead">{{due.TaskerLeads}}</td>
            </tr>
          </tbody>
        </table>
        <table id='tblSixty' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-taskers'>
          <thead>
            <tr><th class="control">Control</th><th class="suspense">Suspense</th><th>Title</th><th class="tasklead">Leads</th></tr>
          </thead>
          <tbody>
            <tr v-for='due in sixty'>
              <td class="control">{{due.ControlNumber}}</td>
              <td class="suspense">{{formatDate(due.SuspenseDate)}}</td>
              <td><a @click="popup(due.ID, due.TaskerName, due.TaskDeliverables)" class="poplink">{{due.TaskerName}}</a></td>
              <td class="tlead">{{due.TaskerLeads}}</td>
            </tr>
          </tbody>
        </table>
        <table id='tblNinety' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-taskers'>
          <thead>
            <tr><th class="control">Control</th><th class="suspense">Suspense</th><th>Title</th><th class="tasklead">Leads</th></tr>
          </thead>
          <tbody>
            <tr v-for='due in ninety'>
              <td class="control">{{due.ControlNumber}}</td>
              <td class="suspense">{{formatDate(due.SuspenseDate)}}</td>
              <td><a @click="popup(due.ID, due.TaskerName, due.TaskDeliverables)" class="poplink">{{due.TaskerName}}</a></td>
              <td class="tlead">{{due.TaskerLeads}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </b-modal>
  </div>
</template>
<script>
  import Highcharts from 'highcharts'
  import VueHighcharts from 'vue2-highcharts'
  export default {
    components: {
      VueHighcharts
    },
    name: 'taskers-chart',
    data: function () {
      return {
        chartdata: [],
        chartOptions: {
          colors: ["black", "red", "yellow", "green"],
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
          },
          title: {
            text: 'CATS Taskers By Status'
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
            },
            series: {
              cursor: 'pointer',
              point: {
                events: {
                  click: ({ point }) => {
                    this.showtable(point.name);
                  }
                }
              }
            }
          },
          series: []
        },
        loading: true,
        loaded: false,
        showModal: false,
        overdue: [],
        thirty: [],
        sixty: [],
        ninety: [],
        isdev: true,
        OCount: 0,
        NCount: 0,
        SCount: 0,
        TCount: 0
      }
    },
    created: function () {
      // this.init();
    },
    mounted: function () {
      this.$nextTick(function () {
        // Code that will run only after the
        // entire view has been rendered
        this.init();
      })
    },
    methods: {
      init: function () {
        let location = String(window.location);
        if (location.indexOf('hq.') > 0) {
          this.isdev = false;
        }

        this.getTaskers();
      },
      getTaskers: function () {
        if (!this.isdev) {
          var urlString = "https://hq.tradoc.army.mil/sites/CATS/_vti_bin/listdata.svc/Taskers?$select=Id,ControlNumber,SuspenseDate,TaskerName,TaskDeliverables,TaskerLeads,CompletionStatusValue&$orderby=SuspenseDate&$filter=(CompletionStatusValue eq 'Open')";
          var tasks = this;
          let pieCharts = this.$refs.pieCharts;
          jQuery.ajax({
            url: urlString,
            method: "GET",
            headers: { 'accept': 'application/json; odata=verbose' },
            error: function (jqXHR, textStatus, errorThrown) {
              logit("Error Status: " + textStatus + ":: errorThrown: " + errorThrown);
            },
            success: function (data) {
              tasks.loading = false;
              tasks.loaded = true;
              var j = jQuery.parseJSON(JSON.stringify(data.d.results));
              var o = [];
              var t = [];
              var s = [];
              var n = [];
              for (var i = 0; i < j.length; i++) {
                var a = moment(j[i]["SuspenseDate"]);
                var b = moment();
                var c = a.diff(b, 'days');
                switch (true) {
                  case (c < 0):
                    // overdue
                    o.push({
                      "ID": j[i]["Id"],
                      "ControlNumber": j[i]["ControlNumber"],
                      "SuspenseDate": j[i]["SuspenseDate"],
                      "TaskerName": j[i]["TaskerName"],
                      "TaskDeliverables": j[i]["TaskDeliverables"],
                      "TaskerLeads": j[i]["TaskerLeads"]
                    });
                    break;

                  case (c >= 60 && c < 90):
                    // 90
                    n.push({
                      "ID": j[i]["Id"],
                      "ControlNumber": j[i]["ControlNumber"],
                      "SuspenseDate": j[i]["SuspenseDate"],
                      "TaskerName": j[i]["TaskerName"],
                      "TaskDeliverables": j[i]["TaskDeliverables"],
                      "TaskerLeads": j[i]["TaskerLeads"]
                    });
                    break;

                  case (c >= 30 && c < 60):
                    // 60
                    s.push({
                      "ID": j[i]["Id"],
                      "ControlNumber": j[i]["ControlNumber"],
                      "SuspenseDate": j[i]["SuspenseDate"],
                      "TaskerName": j[i]["TaskerName"],
                      "TaskDeliverables": j[i]["TaskDeliverables"],
                      "TaskerLeads": j[i]["TaskerLeads"]
                    });
                    break;

                  case (c >= 1 && c < 30):
                    // 30
                    t.push({
                      "ID": j[i]["Id"],
                      "ControlNumber": j[i]["ControlNumber"],
                      "SuspenseDate": j[i]["SuspenseDate"],
                      "TaskerName": j[i]["TaskerName"],
                      "TaskDeliverables": j[i]["TaskDeliverables"],
                      "TaskerLeads": j[i]["TaskerLeads"]
                    });
                    break;
                }
              }
              tasks.overdue = o;
              tasks.ninety = n;
              tasks.sixty = s;
              tasks.thirty = t;
              tasks.OCount = o.length;
              tasks.TCount = t.length;
              tasks.SCount = s.length;
              tasks.NCount = n.length;

              tasks.chartdata.push({ 'name': 'Overdue', 'y': tasks.OCount });
              tasks.chartdata.push({ 'name': 'Thirty', 'y': tasks.TCount });
              tasks.chartdata.push({ 'name': 'Sixty', 'y': tasks.SCount });
              tasks.chartdata.push({ 'name': 'Ninety', 'y': tasks.NCount });

              pieCharts.addSeries({
                name: 'Status',
                data: tasks.chartdata
              });
            }
          });
        }
      },
      formatDate: function (d) {
        return d === null ? "" : moment(d).add(8, 'hours').format("MM-DD-YYYY");
      },
      popup: function (id, title, body) {
        
      },
      showtable: function (point) {
        $(".table-taskers").hide();
        $("#tbl" + point).show();
        this.$refs["taskertable"].show();
      },
      closepopup: function () {
        
      },
      FormatTitle: function (z) {
        var title = "";
        switch (z) {
          case "Overdue":
            title = "Overdue (" + this.OCount + ")";
            break;

          case "Thirty":
            title = "Due In 30 Days (" + this.TCount + ")";
            break;

          case "Sixty":
            title = "Due In 60 Days (" + this.SCount + ")";
            break;

          case "Ninety":
            title = "Due In 90 Days (" + this.NCount + ")";
            break;
        }
        return title;
      }
    },
    updated: function () {
      this.loading = false;
      this.loaded = true;
    }
  }

</script>
<style scoped>
  .widgetbody {
    width: 100%;
    min-height: 100px;
    position: relative;
  }
  .loading {
    color: #2df20f;
    font-size: 30px;
    line-height: 30px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .fa-spinner {
    color: #2df20f;
    font-size: 30px;
    line-height: 30px;
  }
  .table td, .table th {
    padding: .2rem;
  }
  .control { width: 80px; }
  .suspense { width: 90px; }
  .tasklead { width: 90px; }
  .tlead { width: 73px; }
  .poplink { cursor: pointer; text-decoration: none !important; }
  tbody {
    display: block;
    height: 400px;
    overflow-y: scroll;
  }
  thead, tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed; 
  }
</style>
