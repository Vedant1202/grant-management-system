<template>
  <v-container>
    <h1>Team Management</h1>

    <!-- Add New Team Member Button -->
    <v-btn color="primary" @click="openAddDialog" class="mb-4">Add Team Member</v-btn>

    <!-- Team Members Table -->
    <v-data-table :headers="headers" :items="teamUsers" item-key="id" class="elevation-1">
      <template #item.actions="{ item }">
        <v-btn color="primary" @click="openEditDialog(item)">Edit</v-btn>
        <v-btn color="error" @click="removeTeamMember(item)">Remove</v-btn>
      </template>
    </v-data-table>

    <!-- Edit/Add Team Member Dialog -->
    <v-dialog v-model="showDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ isEditing ? 'Edit Team Member' : 'Add New Team Member' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="editForm">
            <!-- Email -->
            <v-text-field
              v-model="editData.email"
              label="Email"
              :disabled="isEditing"
              required
            ></v-text-field>

            <!-- Role Selection -->
            <v-select
              v-model="editData.role"
              :items="['Team Member', 'Proxy PI']"
              label="Role"
              required
            ></v-select>

            <!-- Grant Proposals Multi-Select -->
            <v-select
              v-model="editData.grants"
              :items="grantProposals"
              item-title="proposedTitle"
              item-value="id"
              label="Associated Grant Proposals"
              multiple
              chips
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveChanges">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user' // Current logged-in user
import { useUsersStore } from '@/stores/users' // User data store
import { useGrantProposalsStore } from '@/stores/grantproposals' // Grant proposals store

// Store Instances
const userStore = useUserStore()
const usersStore = useUsersStore()
const grantProposalsStore = useGrantProposalsStore()

// Current PI (logged-in user)
const currentPI = userStore.user

// Computed Properties
const teamUsers = computed(() =>
  usersStore.users.filter(
    (user) =>
      user.piId === currentPI.id && // Users associated with the PI
      ['Team Member', 'Proxy PI'].includes(user.role), // Only Team Member and Proxy PI roles
  ),
)

// Grant Proposals for Multi-Select
const grantProposals = computed(() =>
  grantProposalsStore.proposals.filter((proposal) => proposal.status === 'accepted'),
)

// Dialog Data
const showDialog = ref(false)
const isEditing = ref(false)
const editData = ref({
  email: '',
  role: '',
  grants: [],
})

// Table Headers
const headers = [
  { text: 'Email', value: 'email' },
  { text: 'Role', value: 'role' },
  { text: 'Actions', value: 'actions', sortable: false },
]

// Methods
function openAddDialog() {
  isEditing.value = false
  editData.value = {
    email: '',
    role: 'Team Member', // Default role
    grants: [],
  }
  showDialog.value = true
}

function openEditDialog(user) {
  isEditing.value = true
  editData.value = { ...user } // Clone user data for editing
  showDialog.value = true
}

function closeDialog() {
  showDialog.value = false
  editData.value = {
    email: '',
    role: '',
    grants: [],
  }
}

function saveChanges() {
  if (editData.value.email === '') {
    alert('Please provide a valid email.')
    return
  }

  if (!editData.value.grants.length) {
    alert('Please associate at least one grant proposal.')
    return
  }

  if (isEditing.value) {
    // Update an existing team member
    usersStore.updateUser(editData.value)
  } else {
    // Add a new team member
    editData.value.piId = currentPI.id // Assign the current PI as the user's manager
    usersStore.addUser(editData.value)
  }

  closeDialog()
}

function removeTeamMember(user) {
  if (confirm(`Are you sure you want to remove ${user.email} from the team?`)) {
    usersStore.deleteUser(user.id) // Remove the user from the store
  }
}
</script>

<style scoped>
.font-weight-bold {
  font-weight: bold;
}
</style>
