<template>
  <v-container>
    <h1>My Team</h1>

    <!-- Save Team Button -->
    <v-row class="mt-6 justify-end">
      <v-btn color="success" @click="savePITeamToBackend"> Save Changes </v-btn>
    </v-row>

    <!-- Co-PIs Section -->
    <h2 class="mt-4 mb-2">Co-PIs</h2>
    <v-btn color="primary" class="mb-2" @click="openAddDialog('Co-PI')">+ Add Co-PI</v-btn>
    <v-data-table :headers="headers" :items="coPIs" item-key="id" class="elevation-1 mb-4">
      <template #item.actions="{ item }">
        <v-btn color="primary" @click="openEditDialog(item)">Edit</v-btn>
        <v-btn color="error" @click="removeTeamMember(item)">Remove</v-btn>
      </template>
    </v-data-table>

    <!-- Team Members Section -->
    <h2 class="mt-4 mb-2">Team Members</h2>
    <v-btn color="primary" class="mb-2" @click="openAddDialog('Team Member')"
      >+ Add Team Member</v-btn
    >
    <v-data-table :headers="headers" :items="teamMembers" item-key="id" class="elevation-1">
      <template #item.actions="{ item }">
        <v-btn color="primary" @click="openEditDialog(item)">Edit</v-btn>
        <v-btn color="error" @click="removeTeamMember(item)">Remove</v-btn>
      </template>
    </v-data-table>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="showDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ isEditing ? 'Edit' : 'Add' }} {{ editData.role }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="editForm">
            <!-- Email -->
            <v-text-field
              v-model="editData.email"
              label="Email"
              :disabled="false"
              required
            ></v-text-field>
            <!-- isEditing -->

            <!-- Grant Proposals -->
            <!-- <v-select
              v-model="editData.grants"
              :items="grantProposals"
              item-title="proposedTitle"
              item-value="id"
              label="Associated Grant Proposals"
              multiple
              chips
            ></v-select> -->
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn text @click="saveChanges">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { API_BASE_URL } from '@/config/config'

// Store access
const userStore = useUserStore()
const currentPI = userStore.user

// Local state for team data
const piTeam = ref({
  division: '',
  piName: '',
  coPIs: [],
  teamMembers: [],
})

// Computed items for each section
const coPIs = computed(() => piTeam.value.coPIs)
const teamMembers = computed(() => piTeam.value.teamMembers)

// Dialog state
const showDialog = ref(false)
const isEditing = ref(false)
const editData = ref({
  id: null,
  email: '',
  role: '',
})

// Table headers
const headers = [
  { text: 'Email', value: 'email' },
  { text: 'Role', value: 'role' },
  { text: 'Actions', value: 'actions', sortable: false },
]

// Fetch PI team using Fetch API
async function fetchPITeam() {
  try {
    const res = await fetch(
      `${API_BASE_URL}/email-lists/pi-team?email=${encodeURIComponent(currentPI.email)}`,
    )
    if (!res.ok) throw new Error('Failed to fetch team')
    const data = await res.json()
    piTeam.value = data
  } catch (err) {
    console.error('Error loading PI team:', err)
    alert('Failed to load your team information.')
  }
}

// Save PI team using PUT
async function savePITeamToBackend() {
  try {
    console.log('Saving team for PI:', currentPI.email)
    console.log('data', {
      email: currentPI.email,
      coPIs: piTeam.value.coPIs,
      teamMembers: piTeam.value.teamMembers,
    })
    const res = await fetch(`${API_BASE_URL}/email-lists/pi-team`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: currentPI.email,
        coPIs: piTeam.value.coPIs,
        teamMembers: piTeam.value.teamMembers,
      }),
    })

    if (!res.ok) throw new Error('Failed to save team')
  } catch (err) {
    console.error('Error saving PI team:', err)
    alert('Failed to save your team.')
  }
}

// Lifecycle: load team on mount
onMounted(() => {
  fetchPITeam()
})

// Dialog handlers
function openAddDialog(role) {
  isEditing.value = false
  editData.value = {
    id: null,
    email: '',
    role,
  }
  showDialog.value = true
}

function openEditDialog(item) {
  isEditing.value = true
  editData.value = { ...item }
  showDialog.value = true
}

function closeDialog() {
  showDialog.value = false
  editData.value = { id: null, email: '', role: '' }
}

// Save (Add or Edit)
async function saveChanges() {
  if (!editData.value.email) {
    alert('Please enter an email.')
    return
  }

  const list = editData.value.role === 'Co-PI' ? piTeam.value.coPIs : piTeam.value.teamMembers

  if (isEditing.value) {
    const index = list.findIndex(
      (u) => u.id === editData.value.id || u.email === editData.value.email,
    )
    if (index !== -1) list[index] = { ...editData.value }
  } else {
    editData.value.id = Date.now().toString()
    list.push({ ...editData.value })
  }

  // await savePITeamToBackend()
  closeDialog()
}

// Remove user from role list
async function removeTeamMember(user, role) {
  if (!confirm(`Are you sure you want to remove ${user.email}?`)) return

  if (role === 'Co-PI') {
    piTeam.value.coPIs = piTeam.value.coPIs.filter((u) => u.id !== user.id)
  } else {
    piTeam.value.teamMembers = piTeam.value.teamMembers.filter((u) => u.id !== user.id)
  }

  await savePITeamToBackend()
}
</script>

<style scoped>
h1 {
  font-weight: bold;
}
h2 {
  font-weight: 500;
}
</style>
