import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import ServiceList from '@/components/ServiceList'
import BusList from '@/components/BusList'
import ServiceCard from "@/components/ServiceCard";

Vue.use(VueRouter)

const routes = [
  {
    path: '/', name: 'home', component: Home,
    children: [
      {
        path: 'stops',
        name: 'bus-list',
        component: BusList,
        props: true,
        children: [
          {
            path: ':bus_stop_name',
            name: 'bus-list',
            component: BusList,
            props: true
          }
        ]
      },
      {
        path: 'services',
        name: 'service-list',
        component: ServiceList,
        props: true,
        children: [
          {
            path: ':service_name',
            name: 'service-card',
            component: ServiceCard,
            props: true
          }
        ]
      }
    ]
  },
  {
    path: '/about',
    component: About
  }
]

const router = new VueRouter({
  routes
})

export default router
