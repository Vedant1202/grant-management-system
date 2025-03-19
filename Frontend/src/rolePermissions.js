export const rolePermissions = {
  'Grant Admin': {
    routes: [
      '/home',
      '/tasklist',
      '/new-grant-proposal-requests',
      '/proposal',
      '/proposal/:id',
      '/admin-dashboard',
      '/grant',
      '/grant/:id',
      '/user-management',
      '/email-list-management',
    ],
    sidebar: [
      {
        title: 'Dashboard',
        icon: 'mdi-view-dashboard',
        to: '/admin-dashboard',
      },
      {
        title: 'New Grant Proposal Requests',
        icon: 'mdi-file-check',
        to: '/new-grant-proposal-requests',
      },
      {
        title: 'User Management',
        icon: 'mdi-account-group',
        to: '/user-management',
      },
      {
        title: 'Email List Management',
        icon: 'mdi-bell-cog',
        to: '/email-list-management',
      },
    ],
  },
  'Grant Manager': {
    routes: [
      '/home',
      '/tasklist',
      '/new-grant-proposal-requests',
      '/proposal',
      '/proposal/:id',
      '/admin-dashboard',
      '/grant',
      '/grant/:id',
    ],
    sidebar: [
      {
        title: 'Dashboard',
        icon: 'mdi-view-dashboard',
        to: '/admin-dashboard',
      },
      {
        title: 'New Grant Proposal Requests',
        icon: 'mdi-file-check',
        to: '/new-grant-proposal-requests',
      },
    ],
  },
  PI: {
    routes: [
      '/home',
      '/tasklist',
      '/new-grant-proposal',
      '/proposal',
      '/proposal/:id',
      '/grant',
      '/grant/:id',
      '/team-management',
    ],
    sidebar: [
      {
        title: 'Dashboard',
        icon: 'mdi-view-dashboard',
        to: '/dashboard',
      },
      {
        title: 'Create New',
        icon: 'mdi-file-document-outline',
        to: '/new-grant-proposal',
      },
      {
        title: 'Team Management',
        icon: 'mdi-account-multiple',
        to: '/team-management',
      },
    ],
  },
  'Proxy PI': {
    routes: [
      '/home',
      '/tasklist',
      '/new-grant-proposal',
      '/proposal',
      '/proposal/:id',
      '/grant',
      '/grant/:id',
    ],
    sidebar: [
      {
        title: 'Dashboard',
        icon: 'mdi-view-dashboard',
        to: '/dashboard',
      },
      {
        title: 'Create New',
        icon: 'mdi-file-document-outline',
        to: '/new-grant-proposal',
      },
    ],
  },
  'Team Member': {
    routes: ['/home', '/tasklist', '/proposal', '/proposal/:id', '/grant', '/grant/:id'],
    sidebar: [
      {
        title: 'Dashboard',
        icon: 'mdi-view-dashboard',
        to: '/dashboard',
      },
    ],
  },
}
