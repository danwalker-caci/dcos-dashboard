<template>
  <div id='WorkOrderData'>
    <div v-if='loading' class='widgetbody'><span class='loading'><i class='fas fa-spinner fa-spin'></i> Loading...</span></div>
    <vue-highcharts class='chart' :options='chartOptions' ref='pieCharts'></vue-highcharts>
    <div id='Total' centered size='lg'>All FMO Work Orders {{total}} / Completed FMO Work Orders {{CCount}} </div>
    <b-modal id='workordertables' ref='workordertable' centered size='lg' title='FMO Work Orders by Request Date and Status'>
      <div class='container-fluid'>
        <table id='tblOverNinetyDays' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-workorders'>
          <thead>
            <tr><th class='from'>From</th><th class='dor'>Date of Request</th><th>Building</th><th class='status'>Status</th></tr>
          </thead>
          <tbody>
            <tr v-for='workorders in overninety'>
              <td class='from'>{{workorders.from}}</td>
              <td class='dor'>{{formatDate(workorders.dor)}}</td>
              <td><a @click='popup(workorders.id, workorders.from, workorders.building)' class='poplink'>{{workorders.building}}</a></td>
              <td class='status'>{{workorders.status}}</td>
            </tr>
          </tbody>
        </table>
        <table id='tblThirtyDays' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-workorders'>
          <thead>
            <tr><th class='from'>From</th><th class='dor'>DateOfRequest</th><th>Building</th><th class='status'>Status</th></tr>
          </thead>
          <tbody>
            <tr v-for='workorders in thirty'>
              <td class='from'>{{workorders.from}}</td>
              <td class='dor'>{{formatDate(workorders.dor)}}</td>
              <td><a @click='popup(workorders.id, workorders.from, workorders.building)' class='poplink'>{{workorders.building}}</a></td>
              <td class='status'>{{workorders.status}}</td>
            </tr>
          </tbody>
        </table>
        <table id='tblSixtyDays' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-workorders'>
          <thead>
            <tr><th class='from'>From</th><th class='dor'>DateOfRequest</th><th>Building</th><th class='status'>Status</th></tr>
          </thead>
          <tbody>
            <tr v-for='workorders in sixty'>
              <td class='from'>{{workorders.from}}</td>
              <td class='dor'>{{formatDate(workorders.dor)}}</td>
              <td><a @click='popup(workorders.id, workorders.from, workorders.building)' class='poplink'>{{workorders.building}}</a></td>
              <td class='status'>{{workorders.status}}</td>
            </tr>
          </tbody>
        </table>
        <table id='tblNinetyDays' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-workorders'>
          <thead>
            <tr><th class='from'>From</th><th class='dor'>DateOfRequest</th><th>Building</th><th class='status'>Status</th></tr>
          </thead>
          <tbody>
            <tr v-for='workorders in ninety'>
              <td class='from'>{{workorders.from}}</td>
              <td class='dor'>{{formatDate(workorders.dor)}}</td>
              <td><a @click='popup(workorders.id, workorders.from, workorders.building)' class='poplink'>{{workorders.building}}</a></td>
              <td class='status'>{{workorders.status}}</td>
            </tr>
          </tbody>
        </table>
        <table id='tblCompletedDays' cellspacing='0' cellpadding='0' class='table table-bordered table-hover table-workorders'>
          <thead>
            <tr><th class='from'>From</th><th class='dor'>DateOfRequest</th><th>Building</th><th class='status'>Status</th></tr>
          </thead>
          <tbody>
            <tr v-for='workorders in completed'>
              <td class='from'>{{workorders.from}}</td>
              <td class='dor'>{{formatDate(workorders.dor)}}</td>
              <td><a @click='popup(workorders.id, workorders.from, workorders.building)' class='poplink'>{{workorders.building}}</a></td>
              <td class='status'>{{workorders.status}}</td>
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
    name: 'workorders-chart',
    data: function () {
      return {
        chartdata: [],
        chartOptions: {
          colors: ['blue', "black", "red", "yellow", "green"],
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
          },
          title: {
            text: 'FMO Work Orders by Days Since Request'
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
        completed: [],
        overninety: [],
        thirty: [],
        sixty: [],
        ninety: [],
        //isdev: true,
        CCount: 0,
        OCount: 0,
        NCount: 0,
        SCount: 0,
        TCount: 0,
        total: 0
      }
    },     // end function data()
    created: function () {
      // this.init();
    },  // end function created()
    mounted: function () {    // **MCN** Why is this different than the one in "TaskersChart.vue"?
        // console.log('mounted')
      this.$nextTick(function () {
        // Code that will run only after the
        // entire view has been rendered
        this.init();
      })
    },  // end function mounted()
    updated: function () {
      this.loading = false;
      this.loaded = true;
    },  // end function updated()
    methods: {
      init: function () {
        // let location = String(window.location)
        // if (location.indexOf('hq.') > 0) {
        //  this.isdev = false;
        //}
        this.getWorkorders()
        console.log('Really POST query')
      },
      getWorkorders: function () {
        var pieCharts = this.$refs.pieCharts 
        var siteurl = 'https://hq.tradoc.army.mil/sites/fmo'
        var woquery = '<Query><OrderBy><FieldRef Name=\'DateOfRequest\' Ascending=\'False\' /></OrderBy></Query>'
        var wofields = '<ViewFields><FieldRef Name=\'ID\' /><FieldRef Name=\'Title\' /><FieldRef Name=\'DateOfRequest\' /><FieldRef Name=\'Building\' /><FieldRef Name=\'Status\' /></ViewFields>' //Add the internal names of required fields
        var workorders = {}
        console.log('SPServices')
        $().SPServices({
          operation: 'GetListItems',
          async: false,				      // This means the call will gather all data and block the process while it does so
          webURL: siteurl,          // Site collection URL which has the required List data
          listName: 'WorkOrders',   
          CAMLViewFields: wofields,
          CAMLQuery: woquery,       //Include filters to the query
          CAMLRowLimit: 5000,       //Row limit for the list querying
          CAMLQueryOptions: '<QueryOptions><ViewAttributes Scope=\'Recursive\'/></QueryOptions>', //Query options
          completefunc: function (xData, Status) {
            // console.log('Title: ' + $(this).attr('ows_Title'))
            // console.log('XML: ' + xData.responseXML)
            // var count = parsefloat($(xData.responseXML).SPFilterNode('rs:data').attr('ItemCount'))
            workorders = $(xData.responseXML).SPFilterNode('z:row').SPXmlToJson({
              mapping: {
                ows_ID: { mappedName: 'id', objectType: 'Counter' },
                ows_Title: { mappedName: 'from', objectType: 'Text' },
                ows_Building: { mappedName: 'building', objectType: 'Lookup' },
                ows_DateOfRequest: { mappedName: 'dor', objectType: 'DateTime' },
                ows_Status: { mappedName: 'status', objectType: 'Text' }
              },
              includeAllAttrs: false,
              removeOws: false
            })
		      }
		    }) 
		    console.log("SPServices query returned ", workorders.length, " items") 
        var tasks = this
        tasks.completed = []
        tasks.overninety = []
        tasks.thirty = []
        tasks.sixty = []
        tasks.ninety = []
            //var j = jQuery.parseJSON(JSON.stringify(workorders))
        tasks.total = workorders.length
        for (var i = 0; i < workorders.length; i++) {
            // format non standard date
            // console.log('Find this:' + i, JSON.stringify(j[i]))
            // var chimp = workorders[i]['dor'].toString().split('T')
            // ++ New stuff...
          var today = new Date()                                // Date now
          var tdor = workorders[i]['dor']                       // Date of request
          var tms = tdor.getTime() - today.getTime()            // time difference in milliseconds
          var tdays = (Math.ceil(tms / (1000 * 60 * 60 * 24)))  // time differenece in days
            // if (i < 100) { console.log(today, tdor, tms, tdays) }
            // --
            // get rid of the zeros
            // var a = moment(chimp[0])
            // var b = moment()
            // var dif = a.diff(moment(), 'days')
          var ct = {}
          try {
            ct = {
              'id': workorders[i]['id'],
              'from': workorders[i]['from'],
              'building': workorders[i]['building']['lookupValue'],
              'dor': workorders[i]['dor'],
              'status': workorders[i]['status']
            }
          }
          catch (err) {
            console.log(err.message)
            console.log("Failed i = ", i, ", JSON = ", JSON.stringify(workorders[i]))
            console.log(JSON.stringify(err))
          }
          if (ct.length === 0) {
            console.log("CT dictionary empty, i = ", i, ", entry JSON = ", JSON.stringify(workorders[i]))
          } else {
            if (ct['status'] === 'Complete') {  // Completed cases
              // c.push(ct)
              tasks.completed.push(ct)
            } else if (tdays < -90) {
              // o.push(ct)
              tasks.overninety.push(ct)
            } else if (tdays >= -90 && tdays < -60) {
              tasks.ninety.push(ct)
            } else if (tdays >= -60 && tdays < -30) {
              tasks.sixty.push(ct)
            } else {
              tasks.thirty.push(ct)
              // console.log(ct, JSON.stringify(ct))
            }
          }
        }

        tasks.OCount = tasks.overninety.length // o.length
        tasks.TCount = tasks.thirty.length
        tasks.SCount = tasks.sixty.length
        tasks.NCount = tasks.ninety.length
        tasks.CCount = tasks.completed.length // c.length

        console.log("ocount = ", tasks.OCount)
        console.log("tcount = ", tasks.TCount)
        console.log("scount = ", tasks.SCount)
        console.log("ncount = ", tasks.NCount)
        console.log("ccount = ", tasks.CCount)

        tasks.chartdata.push({ 'name': 'OverNinety', 'y': tasks.OCount })
        tasks.chartdata.push({ 'name': 'Thirty', 'y': tasks.TCount })
        tasks.chartdata.push({ 'name': 'Sixty', 'y': tasks.SCount })
        tasks.chartdata.push({ 'name': 'Ninety', 'y': tasks.NCount })
        tasks.chartdata.push({ 'name': 'Completed', 'y': tasks.CCount })
        console.log("Chart data", JSON.stringify(tasks.chartdata))

        pieCharts.addSeries({
          name: 'FMOWorkOrders',
          data: tasks.chartdata
        })

      },  // ends function GetWorkorders()
      formatDate: function (d) {
        return d === null ? "" : moment(d).add(8, 'hours').format("MM-DD-YYYY");
      },
      popup: function (id, title, body) {

      },
      showtable: function (point) {
        // console.log('point: ' + point)
        jQuery('.table-workorders').hide()
        jQuery('#tbl' + point + 'Days').show()
        this.$refs['workordertable'].show()
      },
      closepopup: function () {

      },
      FormatTitle: function (z) {
        var title = ""
        switch (z) {

          case "Completed":
            title = "Completed (" + this.CCount + ")"
            break

          case "OverNinety":
            title = "Requested Over Ninety Days ago (" + this.OCount + ")"
            break

          case "Thirty":
            title = "Requested over 30 Days ago (" + this.TCount + ")"
            break

          case "Sixty":
            title = "Requested over 60 Days ago (" + this.SCount + ")"
            break

          case "Ninety":
            title = "Requested over 90 Days ago (" + this.NCount + ")"
            break
        }
        return title
      } // ends function FormatTitle()
    }   // ends methods
  }     // ends export default
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
