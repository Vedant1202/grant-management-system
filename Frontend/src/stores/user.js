import { defineStore } from 'pinia'
import { rolePermissions } from '../rolePermissions'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      email: 'pi@example.com', // Mock user email
      role: 'PI', // Mock role: 'Grant Admin', 'Grant Manager', 'PI', 'Proxy PI', 'Team Member'.
    },
  }),
  getters: {
    allowedRoutes: (state) => rolePermissions[state.user.role]?.routes || [],
    allowedSidebarItems: (state) => rolePermissions[state.user.role]?.sidebar || [],
    userEmail: (state) => state.user.email, // ✅ New getter for user email
  },
  actions: {
    setUser(email, role) {
      this.user.email = email
      this.user.role = role
    },
  },
})
