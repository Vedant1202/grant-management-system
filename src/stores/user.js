import { defineStore } from 'pinia'
import { rolePermissions } from '../rolePermissions'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      email: 'admin@example.com', // Mock user email
      role: 'PI', // Mock role: 'Grant Admin', 'PI', 'Proxy PI', 'Team Member'.
    },
  }),
  getters: {
    allowedRoutes: (state) => rolePermissions[state.user.role]?.routes || [],
    allowedSidebarItems: (state) => rolePermissions[state.user.role]?.sidebar || [],
  },
  actions: {
    setUser(email, role) {
      this.user.email = email
      this.user.role = role
    },
  },
})