<template>
  <div id="rbsChartContainer">
    <div v-if="loading" class="widgetbody"><span class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</span></div>
    <vue-highcharts class="chart" :options="chartOptions" ref="pieCharts"></vue-highcharts>
  </div>
</template>
<script>
  import Highcharts from 'highcharts'
  import VueHighcharts from 'vue2-highcharts'
  export default {
    components: {
      VueHighcharts
    },
    name: 'recommendations-by-status',
    data: function () {
      return {
        recommendations: [],
        chartdata: [],
        chartOptions: {
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
          series: []
        },
        loading: true,
        loaded: false,
        isdev: true,
        timer: ''
      }
    },
    created: function () {
      //this.init();
      //this.timer = setInterval(this.getData, 10000);
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
        this.getData();
      },
      getData: function () {
        if (!this.isdev) {
          var urlString = "https://hq.tradoc.army.mil/sites/trip/_vti_bin/listdata.svc/Recommendations?$select=Id,RecommendationStatusValue&$filter=(not substringof('Implemented', RecommendationStatusValue))";
          // logit("urlString: " + urlString);
          var rbs = this;
          let pieCharts = this.$refs.pieCharts;
          pieCharts.delegateMethod('showLoading', 'Loading...');
          jQuery.ajax({
            url: urlString,
            method: "GET",
            headers: { 'accept': 'application/json; odata=verbose' },
            error: function (jqXHR, textStatus, errorThrown) {
              logit("Error Status: " + textStatus + ":: errorThrown: " + errorThrown);
            },
            success: function (data) {
              var recs = jQuery.parseJSON(JSON.stringify(data.d.results));
              rbs.loading = false;
              rbs.loaded = true;
              // draw pie chart
              var stats = ['New', 'Initial Review', 'Task Order', 'Pending Final Review', 'Pending Implementation'];
              var bacon = [];
              for (var i = 0; i < stats.length; i++) {
                bacon.push({
                  'name': stats[i],
                  'y': 0
                });
              }
              for (i = 0; i < recs.length; i++) {
                var status = recs[i]["RecommendationStatusValue"];
                status = status.split(":")[0];
                for (var k = 0; k < bacon.length; k++) {
                  if (bacon[k].name === status) {
                    bacon[k]['y'] += 1;
                  }
                }
              }
              pieCharts.addSeries({
                name: 'Status',
                colorByPoint: true,
                data: bacon
              });
              pieCharts.hideLoading();
            }
          });
        }
      },
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
</style>
