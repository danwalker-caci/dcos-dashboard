<template>
  <div class='panel panel-black'>
    <div v-if="addlink" class='panel-heading'>
      {{widget.title}}
      &nbsp;<!--<b-btn :v-b-modal="'widget.dlgid'" variant="success" size="sm" :data-link="widget.link" :data-type="widget.type">Add Effort/Issue</b-btn>-->
      <a class="btn btn-success btn-sm" @click="popup(widget.site, widget.list, widget.action, widget.dlgid, widget.dlgbody)" :data-link="widget.link" :data-type="widget.type" :data-target="widget.dlgid">Add Effort/Issue</a>
    </div>
    <div v-else class='panel-heading'>{{widget.title}}</div>
    <div v-if="hasComponents" class='panel-body childcomponents'>
      <slot name="components"></slot>
    </div>
    <div v-else class='panel-body'>
      <div v-if="loading" :id="widget.id" class="widgetbody"><span class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</span></div>
      <div v-if="loaded">
        <table cellspacing='0' cellpadding='0' class='table table-bordered table-hover'>
          <thead>
            <tr><th></th><th>Title</th><th>Date</th></tr>
          </thead>
          <tbody>
            <tr v-for='item in items'>
              <td class="status"><span :class="item.StatusValue" class="fas fa-circle"></span></td>
              <td class="title"><a class="hovertitle" href="#" data-toggle="tooltip" :title="item.Description">{{item.Title}}</a></td>
              <td class="suspense">{{formatDate(item.Suspense)}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <b-modal :id="widget.dlgid" :ref="widget.dlgid" centered size="lg" :title="widget.dlgtitle" @shown="popupshown" @ok="popupsave">
      <div :id="widget.dlgbody" :ref="widget.dlgbody" class="container-fluid">
        <div class="form-horizontal">
          <div class="form-group row">
            <label class="col-sm-2 col-form-label">Title<span title="This is a required field." class="ms-formvalidation"> *</span></label>
            <div class="col-sm-10">
              <input type="text" class="form-control form-control-sm" :id="'txtTitle_' + widget.dlgid" placeholder="Enter Title Here.." />
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-2 col-form-label">Description<span title="This is a required field." class="ms-formvalidation"> *</span></label>
            <div class="col-sm-10">
              <textarea class="form-control" :id="'taDescription_' + widget.dlgid" rows="6"></textarea>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-2 col-form-label">Suspense<span title="This is a required field." class="ms-formvalidation"> *</span></label>
            <div class="col-sm-10">
              <el-date-picker v-model="suspense" class="form-control form-control-sm" type="date" :id="'txtSuspense_' + widget.dlgid" placeholder="Pick a Suspense Date">
              </el-date-picker>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-2 col-form-label">Status</label>
            <div class="col-sm-10">
              <select :id="'ddStatus_' + widget.dlgid" class="form-control form-control-sm">
                <option selected="selected" value="None">None</option>
                <option value="Green">Green</option>
                <option value="Yellow">Yellow</option>
                <option value="Red">Red</option>
                <option value="Black">Black</option>
              </select>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-2 col-form-label">Report Required</label>
            <div class="col-sm-10">
              <select :id="'ddReport_' + widget.dlgid" class="form-control form-control-sm">
                <option selected="selected" value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
  export default {
    name: 'dynamic-widget',
    props: {
      hascomponents: {
        type: Boolean,
        default: false
      },
      addlink: {
        type: Boolean,
        default: false
      },
      widget: {
        type: Object,
        default: () => {
          return {
            id: '',
            title: '',
            site: '',
            list: '',
            action: '',
            dlgid: '',
            dlgbody: '',
            dlgtitle: 'Title',
            kpi: false
          }
        }
      }
    },
    computed: {
      hasComponents() {
        return this.hascomponents === true
      }
    },
    data: function () {
      return {
        items: [],
        suspense: '',
        site: '',
        list: '',
        action: '',
        dlgid: '',
        dlgbody: '',
        loading: true,
        loaded: false,
        isdev: true,
        showsave: false,
        timer: ''
      }
    },
    created: function () {
      this.init();
      this.timer = setInterval(this.getData, 10000);  //rem to load data only once
    },
    methods: {
      init: function () {
        let location = String(window.location);
        if (location.indexOf('hq.') > 0) {
          this.isdev = false;
        }

        this.getData();
      },
      popup: function (site, list, action, dlgid, dlgbody) {
        this.$refs[dlgid].show();
        this.site = site;
        this.list = list;
        this.action = action;
        this.dlgid = dlgid;
        this.dlgbody = dlgbody;
      },
      popupshown: function () {
        // $('#txtSuspense' + this.dlgid).datepicker();
      },
      closepopup: function () {
        this.$refs[this.dlgid].hide();
      },
      popupsave: function () {
        // take popup form elements and save them back to the SharePoint list
        var itemprops = {
          Title: $("#txtTitle_" + this.dlgid).val(),
          Description: $("#taDescription_" + this.dlgid).val(),
          Suspense: moment($("#txtSuspense_" + this.dlgid).val()).format("YYYY-MM-DD"),
          StatusValue: $("#ddStatus_" + this.dlgid + " option:selected").val(),
          ReportRequiredValue: $("#ddReport_" + this.dlgid + " option:selected").val()
        };
        this.addItem(itemprops).done(this.addItemSucceeded).fail(this.addItemFailed);
      },
      addItem: function (itemprops) {
        var url = this.site + "/_vti_bin/listdata.svc/" + this.list;
        itemprops = JSON.stringify(itemprops);
        logit("ADD URL: " + url);
        logit("Properties: " + itemprops);
        return $.ajax({
          type: 'POST',
          url: url,
          contentType: 'application/json; charset=utf-8',
          processData: false,
          headers: {
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": $('#__REQUESTDIGEST').val()
          },
          data: itemprops
        });
      },
      addItemSucceeded: function () {
        this.$refs[this.dlgid].hide();
      },
      addItemFailed: function (jqXHR, textStatus, errorThrown) {
        alert(textStatus + ", " + errorThrown);
      },
      getData: function () {
        if (!this.isdev) {
          //logit("widget site: " + this.widget.site);
          if (this.widget.site !== '') {
            var urlString = this.widget.site + "/_vti_bin/listdata.svc/DCOSData?$select=Id,Title,Suspense,Description,StatusValue,ReportRequiredValue&$filter=(ReportRequiredValue eq 'Yes')&$orderby=Suspense";
            // logit("urlString: " + urlString);
            var dw = this;  // to set this to the Vue object
            jQuery.ajax({
              url: urlString,
              method: "GET",
              headers: { 'accept': 'application/json; odata=verbose' },
              error: function (jqXHR, textStatus, errorThrown) {
                logit("Error Status: " + textStatus + ":: errorThrown: " + errorThrown);
              },
              success: function (data) {
                dw.items = jQuery.parseJSON(JSON.stringify(data.d.results));
                dw.loading = false;
                dw.loaded = true;
              }
            });
          }
          else {
            // hide loading for unconfigured widgets
            this.loading = false;
          }
        }
      },
      formatDate: function (d) {
        return d === null ? "" : moment(d).add(8, 'hours').format("MM-DD-YYYY");
      }
    },
    beforeDestroy() {
      clearInterval(this.timer);
    },
    updated: function () {
      this.loading = false;
      this.loaded = true;
    }
  }

</script>
<style scoped>
  .panel-body { min-height: 100px; }
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
  .status { width: 30px; }
  .suspense { width: 100px; }
  .Green { color: green; font-size: 16px; }
  .Yellow { color: yellow; font-size: 16px; }
  .Red { color: red; font-size: 16px; }
  .Black { color: black; font-size: 16px; }

  .table td, .table th {
    padding: .5rem;
  }

  .hovertitle { text-decoration: none !important; color: black !important; cursor: pointer; }

  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .modal-dialog {
    max-width: 800px;
    width: 800px;
  }

  .modal-body {
    max-height: 500px;
    overflow-y: scroll;
    overflow-x: auto;
  }
</style>
