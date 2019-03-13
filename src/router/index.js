import Login from '../components/Login'
import Admin from '../components/Admin'
/* import Index from '../components/Index'
import Task from '../components/Task'
import ClientRecord from '../components/ClientRecord'
import Client from '../components/Client'
import Setting from '../components/Setting' */

/* eslint-disable */
export default new VueRouter({
  routes: [
    {
      path: '/',
      component: Login,
      name: 'Login'
    },
    {
      path: '/admin',
      component: Admin,
      name: 'Admin',
      meta: { requiresAuth: true },
      children: [
        {
          path: '/index',
          // component: Index,
          component: () => import(/* webpackChunkName: "index" */ '../components/Index'),
          name: 'Index'
        },
        {
          path: '/task',
          // component: Task,
          component: () => import(/* webpackChunkName: "task" */ '../components/Task'),
          name: 'Task'
        },
        {
          path: '/record',
          // component: ClientRecord,
          component: () => import(/* webpackChunkName: "clientRecord" */ '../components/ClientRecord'),
          name: 'ClientRecord'
        },
        {
          path: '/client',
          // component: Client,
          component: () => import(/* webpackChunkName: "client" */ '../components/Client'),
          name: 'Client'
        },
        {
          path: '/setting',
          // component: Setting,
          component: () => import(/* webpackChunkName: "setting" */ '../components/Setting'),
          name: 'Setting'
        }
      ]
    }
  ]
})
