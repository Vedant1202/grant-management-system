import { defineStore } from 'pinia'

export const useTimelineStore = defineStore('timeline', {
  state: () => ({
    timelines: {}, // Object to hold timelines, keyed by grantId
  }),
  getters: {
    getTimeline: (state) => (grantId) => {
      return state.timelines[grantId] || [] // Return timeline for a specific grantId or an empty array
    },
  },
  actions: {
    loadTimeline(grantId) {
      const savedTimelines = JSON.parse(localStorage.getItem('timelines')) || {}
      this.timelines = savedTimelines // Load all timelines from localStorage
      return this.getTimeline(grantId)
    },
    saveTimeline(grantId, timeline) {
      this.timelines[grantId] = timeline // Update the timeline for the specific grantId
      localStorage.setItem('timelines', JSON.stringify(this.timelines)) // Save timelines to localStorage
    },
    addTimelineItem(grantId, item) {
      const timeline = this.getTimeline(grantId)
      timeline.push(item) // Add the new item to the timeline
      this.saveTimeline(grantId, timeline) // Save the updated timeline
    },
    updateTimelineItem(grantId, index, updatedItem) {
      const timeline = this.getTimeline(grantId)
      timeline.splice(index, 1, updatedItem) // Update the specific item
      this.saveTimeline(grantId, timeline) // Save the updated timeline
    },
    removeTimelineItem(grantId, index) {
      const timeline = this.getTimeline(grantId)
      timeline.splice(index, 1) // Remove the item
      this.saveTimeline(grantId, timeline) // Save the updated timeline
    },
  },
})
