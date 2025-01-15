<template>
  <v-container>
    <!-- Page Title -->

    <!-- Add/Edit Timeline Form -->
    <v-card class="pa-4 mb-4">
      <v-row align="center" justify="space-between" class="mb-4">
        <v-col>
          <h1>Timeline</h1>
        </v-col>
        <v-col class="text-right">
          <v-btn color="primary" outlined @click="toggleTimeline">
            {{ showTimeline ? 'Hide Timeline' : 'View Timeline' }}
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="mb-4">
        <v-col cols="12" sm="6">
          <v-select
            v-model="selectedTemplate"
            :items="templateOptions"
            label="Select Template"
            outlined
            dense
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6">
          <v-btn color="primary" outlined @click="applyTemplate"> Apply Template </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="showTimeline ? 8 : 12">
          <v-form @submit.prevent="addOrUpdateItem">
            <v-row>
              <!-- Date Field -->
              <v-col cols="12" sm="4">
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  :persistent="false"
                  transition="scale-transition"
                  offset-y
                  attach="body"
                >
                  <template #activator="{ props }">
                    <v-text-field
                      v-model="formattedDate"
                      label="Completion Date"
                      readonly
                      v-bind="props"
                      outlined
                      dense
                      required
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="currentItem.date"
                    :allowed-dates="allowedDates"
                    @input="handleDateSelect"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <!-- Description Field -->
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Description"
                  v-model="currentItem.description"
                  outlined
                  dense
                  required
                ></v-text-field>
              </v-col>

              <!-- Responsible Party -->
              <v-col cols="12" sm="4">
                <v-text-field
                  label="Responsible Party"
                  v-model="currentItem.responsibleParty"
                  outlined
                  dense
                  required
                ></v-text-field>
              </v-col>

              <!-- Major Item Checkbox -->
              <v-col cols="12" sm="4">
                <v-checkbox v-model="currentItem.isMajor" label="Major Item" dense></v-checkbox>
              </v-col>

              <!-- Submit Buttons -->
              <v-col cols="12" sm="12">
                <v-btn type="submit" color="primary" class="mr-2">
                  {{ isEditing ? 'Update Item' : 'Add Item' }}
                </v-btn>
                <v-btn color="grey" @click="resetForm">Reset</v-btn>
              </v-col>
            </v-row>
          </v-form>
          <v-data-table
            :headers="headers"
            :items="timeline"
            item-value="date"
            dense
            class="elevation-1"
          >
            <!-- Custom styling for rows -->
            <template v-slot:body="{ items }">
              <tr
                v-for="item in items"
                :key="item.date"
                :class="{ 'completed-row': item.completed }"
              >
                <!-- Date Column -->
                <td>
                  <span>{{ formatDate(item.date) }}</span>
                </td>

                <!-- Description Column -->
                <td :class="{ 'strikethrough-text': item.completed }">
                  {{ item.description }}
                </td>

                <!-- Responsible Party Column -->
                <td>
                  {{ item.responsibleParty }}
                </td>

                <!-- Major Item Icon Column -->
                <td>
                  <v-icon :color="item.isMajor ? 'red' : ''">
                    {{ item.isMajor ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                  </v-icon>
                </td>

                <!-- Actions Column -->
                <td>
                  <!-- Edit Button -->
                  <v-btn icon @click="editItem(item)">
                    <v-icon color="blue">mdi-pencil</v-icon>
                  </v-btn>
                  <!-- Delete Button -->
                  <v-btn icon @click="removeItem(item)">
                    <v-icon color="red">mdi-delete</v-icon>
                  </v-btn>
                  <!-- Toggle Complete/Incomplete Button -->
                  <v-btn icon @click="markComplete(item)">
                    <v-icon :color="item.completed ? 'orange' : 'green'">
                      {{ item.completed ? 'mdi-undo' : 'mdi-check' }}
                    </v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-col>
        <!-- Timeline Section -->
        <v-col v-if="showTimeline" cols="4" class="timeline-section">
          <v-card class="pa-4">
            <h3>Timeline</h3>
            <v-timeline align="start" side="end">
              <v-timeline-item
                v-for="item in sortedTimeline"
                :key="item.date"
                :dot-color="getDotColor(item)"
                size="small"
                class="timeline-item"
              >
                <!-- <v-tooltip top>
                  <template #activator="{ props }">
                    <span
                      class="timeline-dot"
                      v-bind="props"
                      :style="{ backgroundColor: getDotColor(item) }"
                    ></span>
                  </template>
                  <span>{{ getDotTooltip(item) }}</span>
                </v-tooltip> -->

                <div :class="['d-flex', item.isMajor ? 'major-item' : '']">
                  <strong class="me-4">{{ formatTime(item.date) }}</strong>
                  <div>
                    <strong>{{ item.description }}</strong>
                    <div class="text-caption">{{ item.responsibleParty }}</div>
                  </div>
                </div>
              </v-timeline-item>
            </v-timeline>

            <!-- Legend -->
            <v-card class="mt-4 legend pa-3">
              <p class="mb-3"><strong>Legend</strong></p>
              <ul>
                <li><span class="dot completed"></span> Completed (Green)</li>
                <li><span class="dot past-due"></span> Past Due (Red)</li>
                <li><span class="dot approaching-soon"></span> Approaching Soon (Orange)</li>
                <li><span class="dot future"></span> Future (Blue)</li>
              </ul>
            </v-card>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import moment from 'moment'

import { useTimelineStore } from '@/stores/timeline'
import { useGrantProposalsStore } from '@/stores/grantProposals'

export default {
  props: {
    grantId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      //   timeline: [], // List of timeline items
      headers: [
        { title: 'Date', value: 'date' },
        { title: 'Description', value: 'description' },
        { title: 'Responsible Party', value: 'responsibleParty' },
        { title: 'Major Item', value: 'isMajor', align: 'center' },
        { title: 'Actions', value: 'actions', sortable: false },
      ],
      currentItem: {
        date: this.getTomorrowDate(), // Default to tomorrow's date
        description: '',
        responsibleParty: '',
        isMajor: false,
        completed: false,
      },
      templateOptions: ['DOM Default Timeline'], // Add template names
      selectedTemplate: null,
      isEditing: false,
      editingIndex: null,
      menu: false, // Controls date picker menu
      showTimeline: true, // Controls the visibility of the timeline
    }
  },
  computed: {
    sortedTimeline() {
      return [...this.timeline].sort((a, b) => new Date(a.date) - new Date(b.date))
    },
    timeline() {
      return this.timelineStore.getTimeline(this.grantId) // Fetch the timeline for the specific grantId
    },
    formattedDate() {
      if (!this.currentItem.date) return 'N/A'
      return this.formatDate(this.currentItem.date) // Use the formatDate method
    },
    timelineStore() {
      return useTimelineStore() // Access the Pinia store
    },
    grantProposalsStore() {
      return useGrantProposalsStore() // Access the grant proposals store
    },
    sponsorDueDate() {
      const proposal = this.grantProposalsStore.proposals.find((p) => p.id === this.grantId)
      return proposal ? moment(proposal.sponsorDueDate) : null // Parse sponsorDueDate as a moment object
    },
  },
  methods: {
    applyTemplate() {
      if (!this.selectedTemplate) {
        alert('Please select a template.')
        return
      }

      const sponsorDate = this.sponsorDueDate // Ensure this is a Date object
      if (!sponsorDate) {
        alert('Sponsor due date not found for the current grant.')
        return
      }

      this.loadTemplateData(this.selectedTemplate).then((templateData) => {
        const newItems = templateData.map((item) => {
          const calculatedDate = this.calculateDueDate(item.Date, sponsorDate)
          return {
            date: calculatedDate,
            description: item.Description,
            responsibleParty: item['Responsible Party'],
            isMajor: item['Major Item'] || false,
            completed: false,
          }
        })

        // Append new items to the store's timeline for this grant
        newItems.forEach((item) => {
          this.timelineStore.addTimelineItem(this.grantId, item)
        })
      })
    },
    calculateDueDate(dateDescription, sponsorDate) {
      const matches = dateDescription.match(/(\d+)\s+business days before sponsor deadline/)
      if (!matches) return null

      let daysToSubtract = parseInt(matches[1], 10)
      let currentDate = new Date(sponsorDate) // Start from the sponsor date

      // Subtract business days
      while (daysToSubtract > 0) {
        currentDate.setDate(currentDate.getDate() - 1) // Move one day back
        const dayOfWeek = currentDate.getDay()
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          // Only decrement on weekdays (Monday-Friday)
          daysToSubtract--
        }
      }

      return currentDate
    },
    loadTemplateData(templateName) {
      return new Promise((resolve) => {
        // Template-specific logic (currently only one template is available)
        if (templateName === 'DOM Default Timeline') {
          const templateData = [
            {
              Date: '5 business days before sponsor deadline',
              Description: 'NIH Sponsor deadline',
              'Responsible Party': 'OSP',
            },
            {
              Date: '7 business days before sponsor deadline',
              Description: 'UIC OSP deadline',
              'Responsible Party': 'Research Admin',
            },
            {
              Date: '7 business days before sponsor deadline',
              Description: 'Final review of submission in ASSIST',
              'Responsible Party': 'PI',
            },
            {
              Date: '7 business days before sponsor deadline',
              Description: 'All documents uploaded in ASSIST',
              'Responsible Party': 'Research Admin',
            },
            {
              Date: '15 business days before sponsor deadline',
              Description: 'EPAF routed',
              'Responsible Party': 'Research Admin',
            },
            {
              Date: '15 business days before sponsor deadline',
              Description: 'FINAL Budget',
              'Responsible Party': 'Research Admin',
            },
            {
              Date: '15 business days before sponsor deadline',
              Description: 'ALL FINAL subaward documents due to UIC',
              'Responsible Party': 'Subawardee (if subaward indicated on Intent to submit form)',
            },
            {
              Date: '25 business days before sponsor deadline',
              Description: 'Subaward first budget draft Internal deadline',
              'Responsible Party': 'Subawardee (if subaward indicated on Intent to submit form)',
            },
            {
              Date: '30 business days before sponsor deadline',
              Description: 'UIC Subrecipient request email',
              'Responsible Party':
                'Research Admin (if subaward indicated on Intent to submit form)',
            },
          ]
          resolve(templateData)
        } else {
          resolve([]) // Fallback for unknown templates
        }
      })
    },
    loadTimeline() {
      this.timelineStore.loadTimeline(this.grantId) // Load the timeline for the specific grantId
    },
    saveTimeline() {
      this.timelineStore.saveTimeline(this.grantId, this.timeline) // Save the current timeline
    },

    addOrUpdateItem() {
      if (this.isEditing) {
        this.timelineStore.updateTimelineItem(this.grantId, this.editingIndex, {
          ...this.currentItem,
        })
      } else {
        this.timelineStore.addTimelineItem(this.grantId, { ...this.currentItem })
      }
      this.resetForm()
    },
    editItem(item) {
      this.currentItem = { ...item }
      this.isEditing = true
      this.editingIndex = this.timeline.indexOf(item)
      this.formattedDate = this.formatDate(item.date)
    },
    removeItem(index) {
      this.timelineStore.removeTimelineItem(this.grantId, index)
    },
    resetForm() {
      this.currentItem = {
        date: this.getTomorrowDate(),
        description: '',
        responsibleParty: '',
        isMajor: false,
        completed: false,
      }
      this.formattedDate = ''
      this.isEditing = false
      this.editingIndex = null
    },

    // addOrUpdateItem() {
    //   if (this.isEditing) {
    //     this.timeline.splice(this.editingIndex, 1, { ...this.currentItem })
    //   } else {
    //     this.timeline.push({ ...this.currentItem })
    //   }
    //   this.saveTimeline()
    //   this.resetForm()
    // },
    // editItem(item) {
    //   this.currentItem = { ...item }
    //   this.isEditing = true
    //   this.editingIndex = this.timeline.indexOf(item)
    //   this.formattedDate = moment(item.date).format('MMMM Do, YYYY')
    // },
    // removeItem(item) {
    //   this.timeline = this.timeline.filter((i) => i !== item)
    //   this.saveTimeline()
    // },
    markComplete(item) {
      item.completed = !item.completed // Toggle the completion status
      this.saveTimeline() // Save the updated timeline to the store
    },
    resetForm() {
      this.currentItem = {
        date: this.getTomorrowDate(),
        description: '',
        responsibleParty: '',
        isMajor: false,
        completed: false,
      }
      this.formattedDate = ''
      this.isEditing = false
      this.editingIndex = null
    },

    getDotColor(item) {
      const today = new Date()
      const itemDate = new Date(item.date)
      if (item.completed) return 'green'
      if (itemDate < today) return 'red' // Past dates
      if (itemDate - today < 7 * 24 * 60 * 60 * 1000) return 'orange' // Approaching soon
      return 'blue' // Future dates
    },
    getDotTooltip(item) {
      if (item.completed) return 'Completed'
      const today = new Date()
      const itemDate = new Date(item.date)
      if (itemDate < today) return 'Past Due'
      if (itemDate - today < 7 * 24 * 60 * 60 * 1000) return 'Approaching Soon'
      return 'Future'
    },

    allowedDates(date) {
      const today = new Date()
      const comparingDate = new Date(date) // Ensure input is a Date object
      return comparingDate >= today // Allow only future dates
    },
    loadTimeline() {
      const savedTimelines = JSON.parse(localStorage.getItem('timelines')) || {}
      const savedTimeline = savedTimelines[this.grantId] || [] // Load the timeline for the specific grantId
      this.timeline = savedTimeline.map((item) => ({
        ...item,
        date: new Date(item.date), // Convert saved date strings back to Date objects
      }))
    },
    saveTimeline() {
      const savedTimelines = JSON.parse(localStorage.getItem('timelines')) || {}
      savedTimelines[this.grantId] = this.timeline.map((item) => ({
        ...item,
        date: item.date.toISOString(), // Save date as ISO strings for consistency
      }))
      localStorage.setItem('timelines', JSON.stringify(savedTimelines))
    },

    getTomorrowDate() {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1) // Increment the date by 1
      return tomorrow
    },
    formatDate(date) {
      if (!date) return 'N/A'
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
    handleDateSelect(date) {
      this.currentItem.date = new Date(date) // Ensure it's saved as a Date object
      this.formattedDate = this.formatDate(this.currentItem.date) // Update the human-readable date
      this.menu = false // Close the menu after selection
    },

    formatTime(date) {
      if (!date) return 'N/A' // Handle empty or invalid dates
      const parsedDate = new Date(date) // Ensure date is a valid Date object
      return parsedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },

    toggleTimeline() {
      this.showTimeline = !this.showTimeline // Toggle the timeline visibility
    },
  },
  mounted() {
    this.formattedDate = this.formatDate(this.currentItem.date) // Format tomorrow's date for display

    this.loadTimeline()
  },
}
</script>

<style scoped>
.v-data-table {
  margin-top: 20px;
}
.v-card {
  margin-bottom: 20px;
}
.v-navigation-drawer {
  max-width: none; /* Ensure no max width restricts the drawer */
}

.v-timeline-item div {
  white-space: normal; /* Allow text wrapping */
}

/* Timeline Section */
.timeline-section {
  border-left: 1px solid #e0e0e0;
  padding-left: 16px;
}

/* Major Item Styling */
.major-item {
  background-color: #ffebee; /* Grayscale-red background */
  font-weight: bold;
  padding: 8px;
  border-radius: 4px;
}

/* Dot Styling */
.timeline-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

/* Legend */
.legend {
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;
}

.legend ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.legend li {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.legend .dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.legend .dot.completed {
  background-color: green;
}

.legend .dot.past-due {
  background-color: red;
}

.legend .dot.approaching-soon {
  background-color: orange;
}

.legend .dot.future {
  background-color: blue;
}

.completed-row {
  background-color: #e0e0e0; /* Grey background for completed rows */
}

.strikethrough-text {
  text-decoration: line-through; /* Strikethrough text for completed items */
  color: #6c757d; /* Muted text color */
}
</style>
