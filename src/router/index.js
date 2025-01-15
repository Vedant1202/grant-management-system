import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user' // Import the user store
import { rolePermissions } from '../rolePermissions' // Import role permissions

import HomeView from '../views/HomeView.vue'
import NewGrantProposal from '@/components/NewGrantProposal.vue'
import Dashboard from '@/views/Dashboard.vue'
import NewGrantProposalRequests from '@/views/NewGrantProposalRequests.vue'
import ProposalDetail from '@/views/ProposalDetail.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import GrantView from '@/views/GrantView.vue'
import UserManagement from '@/views/UserManagement.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
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
    {
      path: '/admin-dashboard',
      name: 'AdminDashboard',
      component: AdminDashboard,
    },
    {
      path: '/grant/:id',
      name: 'GrantView',
      component: GrantView,
      props: true,
    },
    {
      path: '/user-management',
      name: 'UserManagement',
      component: UserManagement,
    },
    {
      path: '/team-management',
      name: 'TeamManagement',
      component: () => import('@/views/TeamManagement.vue'),
      meta: { requiresPI: true }, // Restrict access to PI and Proxy PI
    },
  ],
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const userRole = userStore.user.role // Get the logged-in user's role
  const allowedRoutes = rolePermissions[userRole]?.routes || [] // Get allowed routes for the role

  // Determine the default page based on role
  const defaultPage = ['Grant Admin', 'Grant Manager'].includes(userRole)
    ? '/admin-dashboard'
    : '/dashboard'

  // Helper function to check dynamic routes
  const isRouteAllowed = (path) => {
    // Check exact match or dynamic route base path
    return allowedRoutes.some(
      (allowedRoute) =>
        allowedRoute === path ||
        (allowedRoute.includes('/:') && path.startsWith(allowedRoute.split('/:')[0])),
    )
  }

  // Check if the route is accessible
  if (!isRouteAllowed(to.path)) {
    if (to.path !== defaultPage) {
      next(defaultPage) // Redirect to the default page based on role
    } else {
      next() // Prevent infinite loop by allowing navigation to the default page
    }
  } else if (to.meta.requiresPI && !['PI', 'Proxy PI'].includes(userRole)) {
    // Additional check for Team Management access
    if (to.path !== defaultPage) {
      next(defaultPage) // Redirect to the default page based on role
    } else {
      next() // Prevent infinite loop by allowing navigation to the default page
    }
  } else {
    next() // Allow navigation
  }
})

export default router
