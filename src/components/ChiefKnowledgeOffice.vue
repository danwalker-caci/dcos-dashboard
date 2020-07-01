<template>
  <div id="CKOData">
    <table id='tblCKO' cellspacing='0' cellpadding='0' class='table table-bordered table-hover'>
      <thead>
        <tr><th>Title</th><th>Date</th></tr>
      </thead>
      <tbody>
        <tr id='LoadingRow'><td colspan="2"><span class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</span></td></tr>
        <tr v-for='directive in directives'>
          <td>{{directive.Directive}}</td>
          <td>{{formatDate(directive.SuspenseDate)}}</td>
        </tr>
        <tr v-for='event in events'>
          <td>{{event.Title}}</td>
          <td>{{formatDate(event.StartTime)}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  export default {
    name: 'chief-knowledge-office',
    data: function () {
      return {
        directives: [],
        events: [],
        isdev: true
      }
    },
    created: function () {
      this.init();
    },
    methods: {
      init: function () {
        let location = String(window.location);
        if (location.indexOf('hq.') > 0) {
          this.isdev = false;
        }
        this.getDirectives();
      },
      getDirectives: function () {
        if (!this.isdev) {
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
              cko.directives = jQuery.parseJSON(JSON.stringify(data.d.results));
              cko.getEvents();
            }
          });
        }
      },
      getEvents: function (url) {
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
            cko.events = jQuery.parseJSON(JSON.stringify(data.d.results));
          }
        });
      },
      formatDate: function (d) {
        return d === null ? "" : moment(d).add(8, 'hours').format("MM-DD-YYYY");
      }
    },
    updated: function () {
      $("#LoadingRow").remove();
    }
  }

</script>
<style scoped>
  #CKOData { width: 100%; min-height: 150px; position: relative; }
  .loading {
    color: #2df20f;
    font-size: 30px;
    line-height: 30px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .fa-spinner { color: #2df20f; font-size: 30px; line-height: 30px; }
  .table td, .table th {
    padding: .5rem;
  }
</style>
