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
          <v-col v-for="header in headers" :key="header.value" cols="12" sm="4">
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
    <v-data-table
      :headers="headers"
      :items="tasklist"
      item-value="formFile"
      dense
      class="elevation-1"
    >
      <template #item.actions="{ item }">
        <!-- Edit Button -->
        <v-btn icon @click="editTask(item)">
          <v-icon color="blue">mdi-pencil</v-icon>
        </v-btn>
        <!-- Delete Button -->
        <v-btn icon @click="removeTask(tasklist.indexOf(item))">
          <v-icon color="red">mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
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

export default {
  props: {
    grantId: {
      type: String,
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

      isEditing: false, // Track if editing a task
      editingIndex: null, // Track index of task being edited

      // Predefined template names
      templateNames: [
        'Default Tasklist',
        'NIH R Tasklist',
        'NIH K Tasklist',
        'NIH T Tasklist',
        'NIH F Tasklist',
        'DOD Tasklist',
        'HRSA Tasklist',
      ],

      selectedTemplate: null, // Selected template
    }
  },
  computed: {
    tasklist() {
      return this.tasklistStore.getTasklist(this.grantId) // Fetch the tasklist for the specific grantId
    },
    tasklistStore() {
      return useTasklistStore() // Access the Pinia store
    },
  },
  watch: {
    selectedTemplate(value) {
      console.log('Selected Template Updated:', value)
      this.applyTemplate()
    },
  },
  methods: {
    loadTasklist() {
      this.tasklistStore.loadTasklist(this.grantId) // Load the tasklist for the specific grantId
    },
    saveTasklist() {
      this.tasklistStore.saveTasklist(this.grantId, this.tasklist) // Save the tasklist
    },
    addOrUpdateTask() {
      if (this.isEditing) {
        this.tasklistStore.updateTask(this.grantId, this.editingIndex, { ...this.currentTask })
      } else {
        this.tasklistStore.addTask(this.grantId, { ...this.currentTask })
      }
      this.resetForm()
    },
    editTask(task) {
      this.currentTask = { ...task }
      this.isEditing = true
      this.editingIndex = this.tasklist.indexOf(task)
    },
    removeTask(index) {
      this.tasklistStore.removeTask(this.grantId, index)
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
      // Clear the current tasklist
      this.tasklistStore.clearTasklist(this.grantId)

      // Determine the selected tasklist
      let selectedTasklist = []
      switch (this.selectedTemplate) {
        case 'Default Tasklist':
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

      // Dynamically update the headers based on the selected tasklist
      if (selectedTasklist.length > 0) {
        this.headers = Object.keys(selectedTasklist[0]).map((key) => ({
          title: key.replace(/([A-Z])/g, ' $1').trim(), // Format key into a readable title
          value: key,
        }))
      }

      this.headers.push({
        title: 'Actions',
        value: 'actions',
        sortable: false,
      })

      // Add each task from the selected template to the store
      selectedTasklist.forEach((task) => {
        this.tasklistStore.addTask(this.grantId, task)
      })
    },

    // Load tasks for the specific grant
    loadTasks() {
      const savedTasks = JSON.parse(localStorage.getItem(this.grantId)) || []
      this.tasklist = savedTasks
    },
    // Save tasks for the specific grant
    saveTasks() {
      localStorage.setItem(this.grantId, JSON.stringify(this.tasklist))
    },
  },
  mounted() {
    this.loadTasklist() // Load the tasklist on component mount
  },
}
</script>
