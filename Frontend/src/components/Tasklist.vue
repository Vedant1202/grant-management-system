<template>
  <v-container>
    <!-- Page Title -->
    <v-row>
      <v-col>
        <h1>Tasklist</h1>
      </v-col>
    </v-row>

    <!-- Template Selection -->
    <v-card class="pa-4 mb-4">
      <!-- <h3>Tasklist Template</h3> -->
      <v-select
        v-model="selectedTemplate"
        :items="templateNames"
        label="Select an existing Tasklist Template"
        outlined
        dense
        @update:modelValue="applyTemplate"
      ></v-select>
    </v-card>

    <!-- Add/Edit Task Form -->
    <v-card class="pa-4 mb-4">
      <h3>{{ isEditing ? 'Edit Task' : 'Add New Task' }}</h3>
      <v-form @submit.prevent="addOrUpdateTask">
        <!-- <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              label="Form/File"
              v-model="currentTask.formFile"
              outlined
              dense
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              label="Section"
              v-model="currentTask.section"
              outlined
              dense
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              label="Component"
              v-model="currentTask.component"
              outlined
              dense
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              label="Person Responsible"
              v-model="currentTask.personResponsible"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              label="Status/Comments"
              v-model="currentTask.status"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              label="Final File Location"
              v-model="currentTask.finalFileLocation"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-btn type="submit" color="primary" class="mr-2">
              {{ isEditing ? 'Update Task' : 'Add Task' }}
            </v-btn>
            <v-btn color="grey" @click="resetForm">Reset</v-btn>
          </v-col>
        </v-row> -->
        <v-row>
          <v-col
            v-for="header in headers.filter((h) => h.value !== 'completed')"
            :key="header.value"
            cols="12"
            sm="4"
          >
            <v-text-field
              :label="header.title"
              v-model="currentTask[header.value]"
              outlined
              dense
              :required="true"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-btn type="submit" color="primary" class="mr-2">
              {{ isEditing ? 'Update Task' : 'Add Task' }}
            </v-btn>
            <v-btn color="grey" @click="resetForm">Reset</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>

    <!-- Tasklist Table -->
    <v-row class="mt-4">
      <v-col class="text-left">
        <strong>Remaining Tasks: {{ remainingTasks }}</strong>
      </v-col>
    </v-row>

    <!-- Table -->
    <v-data-table
      :headers="headers"
      :items="tasklist"
      :item-value="(item) => item.id"
      dense
      class="elevation-1"
    >
      <template #item="{ item }">
        <tr>
          <!-- Checkbox Column -->
          <td>
            <v-checkbox
              :model-value="isTaskCompleted(item)"
              @update:model-value="toggleTaskCompletion(item)"
              dense
            ></v-checkbox>
          </td>

          <!-- Task Data with Strikethrough -->
          <td v-for="header in headers.slice(1, -1)" :key="header.value">
            <span :class="{ 'task-completed': isTaskCompleted(item) }">
              {{ item[header.value] }}
            </span>
          </td>

          <!-- Actions Column -->
          <td class="pa-2">
            <!-- Edit Button -->
            <v-btn size="x-small" icon @click="editTask(item)">
              <v-icon color="blue">mdi-pencil</v-icon>
            </v-btn>
            <!-- Delete Button -->
            <v-btn class="mt-1" size="x-small" icon @click="removeTask(tasklist.indexOf(item))">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-row class="mt-4">
      <v-col>
        <v-btn
          color="success"
          :disabled="!hasChanges || !grant.additionalData.ackPi"
          @click="saveChanges"
        >
          Save Changes
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defaultTasklist } from '@/templates/defaultTasklist'
import { Tasklist_NIH_R } from '@/templates/Tasklist_NIH_R'
import { Tasklist_NIH_K } from '@/templates/Tasklist_NIH_K'
import { Tasklist_NIH_T } from '@/templates/Tasklist_NIH_T'
import { Tasklist_NIH_F } from '@/templates/Tasklist_NIH_F'
import { Tasklist_DOD } from '@/templates/Tasklist_DOD'
import { Tasklist_HRSA } from '@/templates/Tasklist_HRSA'

import { useTasklistStore } from '@/stores/tasklist'
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
      // Tasklist (Initially Empty)
      // tasklist: [],
      defaultTasklist,
      // Headers for the table
      headers: [
        // { title: 'Form/File', value: 'formFile' },
        // { title: 'Section', value: 'section' },
        // { title: 'Component', value: 'component' },
        // { title: 'Person Responsible', value: 'personResponsible' },
        // { title: 'Status/Comments', value: 'status' },
        // { title: 'Final File Location', value: 'finalFileLocation' },
        // { title: 'Actions', value: 'actions', sortable: false },
      ],

      // Current Task (for adding/editing)
      currentTask: {
        formFile: '',
        section: '',
        component: '',
        personResponsible: '',
        status: '',
        finalFileLocation: '',
      },

      // completedTasks: new Set(),

      isEditing: false, // Track if editing a task
      editingIndex: null, // Track index of task being edited

      // Predefined template names
      templateNames: [
        'NIH R Tasklist',
        'NIH K Tasklist',
        'NIH T Tasklist',
        'NIH F Tasklist',
        'DOD Tasklist',
        'HRSA Tasklist',
        'Custom Tasklist',
      ],

      selectedTemplate: null, // Selected template
      firstLoad: true, // Tracks whether the first load has already happened
      selectedTemplate: null, // Selected template
      tasklist: [], // ✅ Store fetched tasklist locally
    }
  },
  computed: {
    // tasklist() {
    //   return this.tasklistStore.getTasklist(this.grantId) // Fetch the tasklist for the specific grantId
    // },
    tasklistStore() {
      return useTasklistStore() // Access the Pinia store
    },
    completedTasks() {
      return this.tasklistStore.getCompletedTasks(this.grantId)
    },
    remainingTasks() {
      return this.tasklist.length - this.completedTasks.size
    },
    hasChanges() {
      // return (
      //   JSON.stringify(this.tasklist) !==
      //   JSON.stringify(this.tasklistStore.getTasklist(this.grantId))
      // )
      return true
    },
  },
  watch: {
    selectedTemplate(value) {
      if (this.firstLoad) {
        console.log('Tasklist already exists. Skipping template application on first load.')
        this.firstLoad = false // Prevent overwriting existing tasklist
        return
      }

      console.log('Applying template:', value)
      this.applyTemplate()
    },
  },

  methods: {
    fetchTasklist() {
      try {
        if (!this.grant) {
          console.error('Grant data is missing')
          this.tasklist = []
          this.selectedTemplate = null
          return
        }

        console.log('Grant additionalData:', this.grant.additionalData)

        // Extract tasklist and template from the grant's additionalData
        this.tasklist = this.grant.additionalData?.tasklist || []
        this.selectedTemplate = this.grant.additionalData?.selectedTemplateTaskList || null

        console.log('Loaded Tasklist:', this.tasklist)
        console.log('Selected Tasklist Template:', this.selectedTemplate)

        // ✅ Ensure headers are updated based on the tasklist structure
        if (this.tasklist.length > 0) {
          this.setTableHeaders(this.tasklist)
        }

        // ✅ Prevent auto-overwriting with template when tasklist already exists
        this.firstLoad = !!this.tasklist.length
      } catch (error) {
        console.error('Error loading tasklist data from grant prop:', error)
        this.tasklist = [] // Default to empty array
        this.selectedTemplate = null
      }
    },

    setTableHeaders(tasklist) {
      if (!tasklist.length) return

      this.headers = Object.keys(tasklist[0])
        .filter((key) => key !== 'id') // <-- 🚫 Exclude 'id' from table headers
        .map((key) => ({
          title: key.replace(/([A-Z])/g, ' $1').trim(),
          value: key,
        }))

      // ✅ Ensure checkboxes and actions columns are always present
      this.headers.unshift({ title: 'Done?', value: 'completed', sortable: false })
      this.headers.push({ title: 'Actions', value: 'actions', sortable: false })

      console.log('Updated Table Headers:', this.headers)
    },

    async saveChanges() {
      try {
        const response = await fetch(`${API_BASE_URL}/grants/${this.grantId}/additionalData`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tasklist: this.tasklist, // Save tasklist
            selectedTemplateTaskList: this.selectedTemplate, // Save selected dropdown template
          }),
        })

        if (!response.ok) throw new Error('Failed to save tasklist')

        alert('Tasklist and template selection saved successfully!')
      } catch (error) {
        console.error('Error saving tasklist:', error)
      }
    },

    // loadTasklist() {
    //   this.tasklistStore.loadTasklist(this.grantId) // Load the tasklist for the specific grantId
    // },
    // saveChanges() {
    //   this.tasklistStore.saveTasklist(this.grantId, this.tasklist) // Save tasklist to store
    //   this.$nextTick(() => alert('Tasklist changes saved successfully!')) // Optional feedback
    // },
    addOrUpdateTask() {
      if (this.isEditing) {
        this.tasklist[this.editingIndex] = { ...this.currentTask }
      } else {
        this.tasklist.push({ ...this.currentTask, id: Date.now() })
      }
      this.resetForm()
    },

    editTask(task) {
      this.currentTask = { ...task }
      this.isEditing = true
      this.editingIndex = this.tasklist.indexOf(task)
    },
    removeTask(index) {
      this.tasklist.splice(index, 1) // Remove from local tasklist
    },
    resetForm() {
      this.currentTask = {
        formFile: '',
        section: '',
        component: '',
        personResponsible: '',
        status: '',
        finalFileLocation: '',
      }
      this.isEditing = false
      this.editingIndex = null
    },

    applyTemplate() {
      if (!this.selectedTemplate) return

      console.log('Applying template:', this.selectedTemplate)

      let selectedTasklist = []
      switch (this.selectedTemplate) {
        case 'Custom Tasklist':
          selectedTasklist = this.defaultTasklist
          break
        case 'NIH R Tasklist':
          selectedTasklist = Tasklist_NIH_R
          break
        case 'NIH K Tasklist':
          selectedTasklist = Tasklist_NIH_K
          break
        case 'NIH T Tasklist':
          selectedTasklist = Tasklist_NIH_T
          break
        case 'NIH F Tasklist':
          selectedTasklist = Tasklist_NIH_F
          break
        case 'DOD Tasklist':
          selectedTasklist = Tasklist_DOD
          break
        case 'HRSA Tasklist':
          selectedTasklist = Tasklist_HRSA
          break
        default:
          console.error('Unknown template selected:', this.selectedTemplate)
          return
      }

      // ✅ Set headers dynamically based on template structure
      if (selectedTasklist.length > 0) {
        this.setTableHeaders(selectedTasklist)
      }

      // ✅ Generate unique IDs and update local tasklist
      this.tasklist = selectedTasklist.map((task) => ({
        ...task,
        id: Date.now() + Math.floor(Math.random() * 1000),
      }))

      console.log('Tasklist updated from template:', this.tasklist)
    },

    getTaskKey(task) {
      return `${task.formFile}_${task.section}` // Ensure unique keys
    },

    toggleTaskCompletion(task) {
      this.tasklistStore.toggleTaskCompletion(this.grantId, task.id)
    },

    isTaskCompleted(task) {
      return this.completedTasks.has(task.id)
    },
  },
  async mounted() {
    console.log('Tasklist component mounted')
    await this.fetchTasklist()
  },
}
</script>

<style scoped>
.task-completed {
  text-decoration: line-through;
  color: grey;
  opacity: 0.6;
}
</style>
