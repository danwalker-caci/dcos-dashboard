<template>
  <div class='container-fluid dashboard'>
    <div class='row'>
      <column>
        <template slot-scope="props" slot="widgets">
          <dynamic-widget hascomponents :widget="{title: 'CATS', site: '', list: '', id: 'widget08'}">
            <template slot="components">
              <taskers-chart></taskers-chart>
            </template>
          </dynamic-widget>
          <dynamic-widget hascomponents :widget="{title: 'FMO Work Orders', site: '', list: '', id: 'widget28'}">
            <template slot="components">
              <workorders-chart></workorders-chart>
            </template>
          </dynamic-widget>
          <dynamic-widget hascomponents :widget="{title: 'TRADOC Reform Initiative Portal', site: '', list: '', id: 'widget09'}">
            <template slot="components">
              <recommendations-by-status></recommendations-by-status>
            </template>
          </dynamic-widget>
          <dynamic-widget :widget="{title: 'Actions for Completion', site: '', list: '', id: 'widget10'}"></dynamic-widget>
        </template>
      </column>
      <column>
        <template slot-scope="props" slot="widgets">
          <dynamic-widget addlink :widget="{title: 'Main Effort / Hot Issues', site: 'https://hq.tradoc.army.mil/sites/dcos/dashboard', list: 'DCOSData', id: 'widget11', action: 'add', dlgid: 'mainissuedlg', dlgbody: 'mainissuebody', dlgtitle: 'Add Effort/Issue'}"></dynamic-widget>
          <dynamic-widget :widget="{title: 'Supplemental / Future Issues', site: 'https://hq.tradoc.army.mil/sites/dcos/dashboard', list: '', id: 'widget12'}"></dynamic-widget>
          <dynamic-widget :widget="{title: 'Routine Tasks / Actions', site: '', list: '', id: 'widget13'}"></dynamic-widget>
        </template>
      </column>
      <column>
        <template slot-scope="props" slot="widgets">
          <dynamic-widget :widget="{title: 'Secretary to the General Staff', site: '', list: '', id: 'widget01'}"></dynamic-widget>
          <dynamic-widget :widget="{title: 'Executive Services Office', site: '', list: '', id: 'widget02'}"></dynamic-widget>
          <dynamic-widget :widget="{title: 'Internal Review Audit Compliance', site: '', list: '', id: 'widget03'}"></dynamic-widget>
          <dynamic-widget hascomponents :widget="{title: 'Chief Knowledge Office', site: '', list: '', fields: [], id: 'widget04'}">
            <template slot="components">
              <chief-knowledge-office></chief-knowledge-office>
            </template>
          </dynamic-widget>
          <dynamic-widget :widget="{title: 'Quality Assurance', site: '', list: '', id: 'widget05'}"></dynamic-widget>
          <dynamic-widget :widget="{title: '80th Training Command', site: '', list: '', id: 'widget06'}"></dynamic-widget>
          <dynamic-widget :widget="{title: '108th Training Command', site: '', list: '', id: 'widget07'}"></dynamic-widget>
        </template>
      </column>
    </div>
  </div>
</template>
<script>
  import Column from './Column.vue'
  import DynamicWidget from './DynamicWidget.vue'
  import ChiefKnowledgeOffice from './ChiefKnowledgeOffice.vue'
  import WorkordersChart from './WorkordersChart.vue'
  import TaskersChart from './TaskersChart.vue'
  import RecommendationsByStatus from './RecommendationsByStatus.vue'

  export default {
    components: {
      Column,
      DynamicWidget,
      ChiefKnowledgeOffice,
      WorkordersChart,
      TaskersChart,
      RecommendationsByStatus
    }
  }
</script>
<style>

</style>
