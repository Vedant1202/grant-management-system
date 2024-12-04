import { defineStore } from 'pinia'

export const useTasklistStore = defineStore('tasklist', {
  state: () => ({
    tasklists: {}, // Object to store tasklists keyed by grantId
  }),
  getters: {
    getTasklist: (state) => (grantId) => {
      return state.tasklists[grantId] || [] // Return the tasklist for a specific grantId or an empty array
    },
  },
  actions: {
    loadTasklist(grantId) {
      const savedTasklists = JSON.parse(localStorage.getItem('tasklists')) || {}
      this.tasklists = savedTasklists // Load all tasklists from localStorage
      return this.getTasklist(grantId)
    },
    saveTasklist(grantId, tasklist) {
      this.tasklists[grantId] = tasklist // Update the tasklist for the specific grantId
      localStorage.setItem('tasklists', JSON.stringify(this.tasklists)) // Save tasklists to localStorage
    },
    addTask(grantId, task) {
      const tasklist = this.getTasklist(grantId)
      tasklist.push(task) // Add the new task
      this.saveTasklist(grantId, tasklist) // Save the updated tasklist
    },
    updateTask(grantId, index, updatedTask) {
      const tasklist = this.getTasklist(grantId)
      tasklist.splice(index, 1, updatedTask) // Update the specific task
      this.saveTasklist(grantId, tasklist) // Save the updated tasklist
    },
    removeTask(grantId, index) {
      const tasklist = this.getTasklist(grantId)
      tasklist.splice(index, 1) // Remove the task
      this.saveTasklist(grantId, tasklist) // Save the updated tasklist
    },
  },
})
