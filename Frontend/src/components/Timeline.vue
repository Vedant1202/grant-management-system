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
            @update:modelValue="onTemplateChange"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <v-menu
            v-model="projectDeadlineMenu"
            :nudge-right="40"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            attach="body"
          >
            <template #activator="{ props }">
              <v-text-field
                v-model="formattedProjectDate"
                label="Project Completion Date"
                readonly
                v-bind="props"
                outlined
                dense
                required
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="projectCompletionDate"
              @update:model-value="handleProjectDateChange"
            ></v-date-picker>
          </v-menu>
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
                    @update:model-value="handleDateSelect"
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
                <td class="pa-2">
                  <!-- Edit Button -->
                  <v-btn size="x-small" icon @click="editItem(item)">
                    <v-icon color="blue">mdi-pencil</v-icon>
                  </v-btn>
                  <!-- Delete Button -->
                  <v-btn size="x-small" class="mt-1" icon @click="removeItem(item)">
                    <v-icon color="red">mdi-delete</v-icon>
                  </v-btn>
                  <!-- Toggle Complete/Incomplete Button -->
                  <v-btn size="x-small" class="mt-1" icon @click="markComplete(item)">
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
      <v-row class="mt-4">
        <v-col>
          <v-btn color="success" :disabled="!hasChanges" @click="saveChanges"> Save Changes </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import moment from 'moment'

import { useTimelineStore } from '@/stores/timeline'
import { useGrantProposalsStore } from '@/stores/grantProposals'
import { API_BASE_URL } from '@/config/config'

export default {
  props: {
    grantId: {
      type: String,
      required: true,
    },
    grant: {
      type: Object,
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
      projectCompletionDate: new Date(this.grant.sponsorDeadlineDate) || new Date(), // Default to sponsor deadline
      formattedProjectDate: '',
      timeline: [], // Store fetched timeline
      templateOptions: ['DOM Default Timeline'], // Add template names
      selectedTemplate: null,
      isEditing: false,
      editingIndex: null,
      menu: false, // Controls date picker menu
      projectDeadlineMenu: false, // Controls date picker menu
      showTimeline: true, // Controls the visibility of the timeline
    }
  },
  computed: {
    computed: {
      // formattedProjectDate() {
      //   console.log('format proj- ', this.formatDate(this.projectCompletionDate))
      //   return this.formatDate(this.projectCompletionDate)
      // },
      sponsorDueDate() {
        if (!this.grant) {
          console.error('Grant data is not available.')
          return null
        }

        // Prioritize saved date in additionalData, fallback to sponsorDeadlineDate
        const savedDate = this.grant.additionalData?.customSponsorDeadlineDate
        const deadlineDate = savedDate || this.grant.sponsorDeadlineDate

        if (!deadlineDate) {
          console.error('No valid sponsor deadline date found.')
          return null
        }

        const parsedDate = new Date(deadlineDate)

        if (isNaN(parsedDate.getTime())) {
          console.error('Invalid sponsor deadline date format:', deadlineDate)
          return null
        }

        return parsedDate
      },
    },
    sortedTimeline() {
      return [...this.timeline].sort((a, b) => new Date(a.date) - new Date(b.date))
    },
    // timeline() {
    //   return this.timelineStore.getTimeline(this.grantId) // Always fetch from store
    // },
    formattedDate() {
      if (!this.currentItem.date) return 'N/A'
      return this.formatDate(this.currentItem.date) // Use the formatDate method
    },
    // timelineStore() {
    //   return useTimelineStore() // Access the Pinia store
    // },

    grantProposalsStore() {
      return useGrantProposalsStore() // Access the grant proposals store
    },

    sponsorDueDate() {
      if (!this.grant) {
        console.error('Grant data is not available.')
        return null
      }

      // Prioritize customSponsorDeadlineDate from additionalData
      const savedDate = this.grant.additionalData?.customSponsorDeadlineDate
      const deadlineDate = savedDate || this.grant.sponsorDeadlineDate

      if (!deadlineDate) {
        console.error('No valid sponsor deadline date found.')
        return null
      }

      const parsedDate = new Date(deadlineDate)

      if (isNaN(parsedDate.getTime())) {
        console.error('Invalid sponsor deadline date format:', deadlineDate)
        return null
      }

      console.log('✅ Parsed Sponsor Due Date:', parsedDate.toISOString())

      return parsedDate
    },

    hasChanges() {
      // return (
      //   JSON.stringify(this.timeline) !==
      //   JSON.stringify(this.timelineStore.getTimeline(this.grantId))
      // )
      return true
    },
  },
  methods: {
    handleProjectDateChange(newDate) {
      this.projectCompletionDate = newDate
      console.log('Project Completion Date updated:', newDate)

      this.formattedProjectDate = this.formatDate(this.projectCompletionDate)

      this.projectDeadlineMenu = false
      // Apply template when the project completion date is changed
      // this.applyTemplate();
    },
    async fetchTimeline() {
      if (this.grant && this.grant.additionalData) {
        this.timeline = [...(this.grant.additionalData.timeline || [])] // Load timeline if available
        this.selectedTemplate = this.grant.additionalData.selectedTemplateTimeline || null // Load saved template
      } else {
        this.timeline = [] // Default to empty array if no saved timeline
        this.selectedTemplate = null
      }

      // ✅ Set project completion date from sponsorDeadlineDate
      if (this.grant.sponsorDeadlineDate) {
        console.log('date-', this.grant.sponsorDeadlineDate)
        this.handleProjectDateChange(new Date(this.grant.sponsorDeadlineDate))
        // this.projectCompletionDate = new Date(this.grant.sponsorDeadlineDate)
      }
    },

    onTemplateChange(newTemplate) {
      this.selectedTemplate = newTemplate // Ensure it's updated in the component state
      console.log('Template updated:', this.selectedTemplate)
    },

    getValidDate(date) {
      if (!date) return null // Handle undefined/null values

      // Check if date is a valid Date object already
      if (date instanceof Date && !isNaN(date.getTime())) {
        return date
      }

      // Try parsing if it's a string (handles "YYYY-MM-DD" format)
      const parsedDate = new Date(date)
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate
      }

      console.error('Invalid date format:', date)
      return null
    },

    async applyTemplate() {
      if (!this.selectedTemplate) {
        alert('Please select a template.')
        return
      }

      // Use computed sponsorDueDate, ensuring it prioritizes additionalData
      const sponsorDate = this.sponsorDueDate

      if (!sponsorDate || isNaN(sponsorDate.getTime())) {
        alert('Sponsor due date is invalid.')
        console.error('❌ Sponsor Date is invalid:', sponsorDate)
        return
      }

      console.log('🚀 Applying template with sponsor date:', sponsorDate.toISOString())

      this.loadTemplateData(this.selectedTemplate).then((templateData) => {
        const newItems = templateData.map((item) => {
          const calculatedDate = this.calculateDueDate(item.Date, this.projectCompletionDate)
          console.log('📌 Calculated Date for', item.Description, '->', calculatedDate)

          return {
            date: calculatedDate,
            description: item.Description,
            responsibleParty: item['Responsible Party'],
            isMajor: item['Major Item'] || false,
            completed: false,
          }
        })

        // ✅ Instead of appending, REPLACE the existing timeline
        this.timeline = [...newItems]

        console.log('✅ Timeline successfully replaced with template data')
      })
    },

    calculateDueDate(dateDescription, sponsorDate) {
      if (!sponsorDate || isNaN(sponsorDate.getTime())) {
        console.error('❌ Invalid sponsorDate:', sponsorDate)
        return null
      }

      console.log('📌 Calculating Due Date from:', sponsorDate.toISOString())

      const matches = dateDescription.match(/(\d+)\s+business days before sponsor deadline/)
      if (!matches) {
        console.error('❌ Invalid date description format:', dateDescription)
        return null
      }

      let daysToSubtract = parseInt(matches[1], 10)
      let currentDate = new Date(sponsorDate) // Clone date to avoid modifying original

      // Ensure we're working in UTC to avoid timezone issues
      currentDate.setUTCHours(12, 0, 0, 0) // Set noon UTC to avoid timezone shifts

      // Subtract business days
      while (daysToSubtract > 0) {
        currentDate.setUTCDate(currentDate.getUTCDate() - 1)
        const dayOfWeek = currentDate.getUTCDay()
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          daysToSubtract--
        }
      }

      console.log('✅ Final Calculated Date:', currentDate.toISOString().split('T')[0])

      return currentDate.toISOString().split('T')[0] // Return YYYY-MM-DD format
    },

    loadTemplateData(templateName) {
      return new Promise((resolve) => {
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

    async saveChanges() {
      try {
        console.log('🚀 Saving timeline data:', this.timeline)

        const response = await fetch(`${API_BASE_URL}/grants/${this.grantId}/additionalData`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timeline: this.timeline, // ✅ Ensure it includes updated dates
            selectedTemplateTimeline: this.selectedTemplate, // ✅ Save template selection
          }),
        })

        if (!response.ok) throw new Error('❌ Failed to save timeline')

        alert('✅ Timeline and template selection saved successfully!')
      } catch (error) {
        console.error('❌ Error saving timeline:', error)
      }
    },

    addOrUpdateItem() {
      if (this.isEditing) {
        // Update the existing item in the local array
        this.timeline[this.editingIndex] = { ...this.currentItem }
      } else {
        // Add a new item to the local array
        this.timeline.push({ ...this.currentItem })
      }
      this.resetForm()
    },

    editItem(item) {
      this.currentItem = { ...item }
      this.currentItem.date = new Date(item.date)
      this.isEditing = true
      this.editingIndex = this.timeline.indexOf(item)
      this.formattedDate = this.formatDate(item.date)
    },

    removeItem(index) {
      this.timeline.splice(index, 1) // Remove item from local array
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
    markComplete(item) {
      item.completed = !item.completed // Toggle the completion status
      this.saveChanges() // Save the updated timeline to the store
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

    getTomorrowDate() {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1) // Increment the date by 1
      return tomorrow
    },
    formatDate(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
    handleDateSelect(date) {
      console.log('📅 Date selected:', date)

      const newDate = new Date(date) // Ensure it's a Date object
      if (isNaN(newDate.getTime())) {
        console.error('❌ Invalid date:', date)
        return
      }

      // Update the currently editing item in the timeline
      if (this.isEditing && this.editingIndex !== null) {
        this.timeline[this.editingIndex].date = newDate // Ensure consistent format
      } else {
        this.currentItem.date = newDate
      }

      this.formattedDate = this.formatDate(newDate) // Update human-readable display
      this.menu = false // Close the date picker

      console.log('✅ Updated item date:', this.currentItem.date)
    },

    formatTime(date) {
      if (!date) return 'N/A' // Handle empty or invalid dates
      const parsedDate = new Date(date) // Ensure date is a valid Date object
      return new Date(parsedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },

    toggleTimeline() {
      this.showTimeline = !this.showTimeline // Toggle the timeline visibility
    },
  },
  async mounted() {
    console.log('timeline mounted called')
    await this.fetchTimeline()
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
