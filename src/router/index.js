import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NewGrantProposal from '@/components/NewGrantProposal.vue'
import Dashboard from '@/views/Dashboard.vue'
import NewGrantProposalRequests from '@/views/NewGrantProposalRequests.vue'
import ProposalDetail from '@/views/ProposalDetail.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import GrantView from '@/views/GrantView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/new-grant-proposal',
      name: 'NewGrantProposal',
      component: NewGrantProposal,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
    },
    {
      path: '/tasklist',
      name: 'DynamicTasklist',
      component: () => import('@/components/Tasklist.vue'),
    },
    {
      path: '/new-grant-proposal-requests',
      name: 'NewGrantProposalRequests',
      component: NewGrantProposalRequests,
    },
    {
      path: '/proposal/:id',
      name: 'ProposalDetail',
      component: ProposalDetail,
    },
    { path: '/admin-dashboard', name: 'AdminDashboard', component: AdminDashboard },
    { path: '/grant/:id', name: 'GrantView', component: GrantView, props: true },
  ],
})

// router.beforeEach((to, from, next) => {
//   const isAdmin = true // Replace this with your actual admin check logic
//   if (to.name === 'AdminDashboard' && !isAdmin) {
//     next({ name: 'Dashboard' }) // Redirect non-admins
//   } else {
//     next() // Allow navigation
//   }
// })

export default router
