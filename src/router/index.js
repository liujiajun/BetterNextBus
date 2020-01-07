import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import BusList from '@/components/BusList'

Vue.use(VueRouter);

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
                component: () => import('@/components/ServiceList'),
                props: true,
                children: [
                    {
                        path: ':service_name',
                        name: 'service-card',
                        component: () => import('@/components/ServiceCard'),
                        props: true
                    }
                ]
            },
            {
                path: 'favorites',
                name: 'favorite-list',
                component: () => import('@/components/FavoriteList')
            }
        ]
    },
    {
        path: '/about',
        component: () => import('../views/About.vue')
    }
];

const router = new VueRouter({
    routes: routes,
    // eslint-disable-next-line no-unused-vars
    scrollBehavior(to, from, savedPosition) {
        return {x: 0, y: 0}
    }
});

export default router
