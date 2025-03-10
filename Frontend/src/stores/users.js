import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [
      { id: 1, email: 'alice@example.com', role: 'Grant Manager', grants: [], piId: null },
      { id: 2, email: 'bob@example.com', role: 'PI', grants: [1, 2], piId: null },
      { id: 3, email: 'charlie@example.com', role: 'Proxy PI', grants: [1], piId: 2 },
      { id: 4, email: 'dana@example.com', role: 'Team Member', grants: [1], piId: 2 },
    ],
    grants: [
      { id: 1, title: 'Cancer Research' },
      { id: 2, title: 'Genetics Study' },
      { id: 3, title: 'Immunology Initiative' },
    ],
    pis: [{ id: 2, email: 'bob@example.com' }],
  }),
  getters: {
    // Get users associated with a specific PI
    getUsersByPI: (state) => (piId) => state.users.filter((user) => user.piId === piId),

    // Get grants accessible to a specific PI
    getGrantsByPI: (state) => (piId) => {
      const pi = state.users.find((user) => user.id === piId && user.role === 'PI')
      return pi ? state.grants.filter((grant) => pi.grants.includes(grant.id)) : []
    },

    // Get team members (Team Member and Proxy PI) for a specific PI
    getTeamByPI: (state) => (piId) =>
      state.users.filter(
        (user) => user.piId === piId && ['Team Member', 'Proxy PI'].includes(user.role),
      ),
  },
  actions: {
    // Add a new user
    // Add a new user
    addUser(user) {
      user.id = this.users.length + 1 // Assign a unique ID
      this.users.push(user)
    },

    // Update an existing user
    updateUser(updatedUser) {
      const index = this.users.findIndex((user) => user.id === updatedUser.id)
      if (index !== -1) {
        this.users[index] = { ...updatedUser }
      }
    },

    // Delete a user
    deleteUser(id) {
      this.users = this.users.filter((user) => user.id !== id)
    },
  },
})
