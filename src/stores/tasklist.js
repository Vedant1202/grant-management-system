import { defineStore } from 'pinia'

export const useTasklistStore = defineStore('tasklist', {
  state: () => ({
    tasklists: {}, // Stores tasklists keyed by grantId
    completedTasks: {}, // Stores completed task IDs keyed by grantId
  }),
  getters: {
    getTasklist: (state) => (grantId) => {
      return state.tasklists[grantId] || [] // Return tasklist or empty array
    },
    getCompletedTasks: (state) => (grantId) => {
      return new Set(state.completedTasks[grantId] || []) // Return completed task set
    },
  },
  actions: {
    loadTasklist(grantId) {
      return this.getTasklist(grantId)
    },
    saveTasklist(grantId, tasklist) {
      this.tasklists[grantId] = tasklist
    },
    addTask(grantId, task) {
      const tasklist = this.getTasklist(grantId)
      tasklist.push(task)
      this.saveTasklist(grantId, tasklist)
    },
    updateTask(grantId, index, updatedTask) {
      const tasklist = this.getTasklist(grantId)
      tasklist.splice(index, 1, updatedTask)
      this.saveTasklist(grantId, tasklist)
    },
    removeTask(grantId, index) {
      const tasklist = this.getTasklist(grantId)
      tasklist.splice(index, 1)
      this.saveTasklist(grantId, tasklist)
    },
    clearTasklist(grantId) {
      this.tasklists[grantId] = []
    },

    // ✅ Manage Completed Task State in Store
    toggleTaskCompletion(grantId, taskId) {
      if (!this.completedTasks[grantId]) {
        this.completedTasks[grantId] = []
      }

      if (this.completedTasks[grantId].includes(taskId)) {
        this.completedTasks[grantId] = this.completedTasks[grantId].filter((id) => id !== taskId)
      } else {
        this.completedTasks[grantId].push(taskId)
      }
    },
  },
})
