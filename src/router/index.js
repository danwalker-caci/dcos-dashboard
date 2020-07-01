import Vue from 'vue'
import Router from 'vue-router'

import DashboardLayout from '@/components/DashboardLayout'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'DashboardLayout',
      component: DashboardLayout
    }
  ]
})
