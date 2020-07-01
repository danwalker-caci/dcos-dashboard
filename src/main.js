import Vue from 'vue'
import App from './App'
import router from './router'
import Highcharts from 'highcharts'
import BootstrapVue from 'bootstrap-vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'

// only needed during dev. Hide for build
// import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'element-ui/lib/theme-chalk/index.css'

import './assets/css/dcos.css'

Vue.config.productionTip = false
Vue.use(Highcharts)
Vue.use(BootstrapVue)
Vue.use(ElementUI, { locale })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
