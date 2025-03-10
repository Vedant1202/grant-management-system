<template>
  <v-container>
    <h1>User Management</h1>
    <v-btn color="primary" @click="openAddDialog">Add User</v-btn>

    <!-- Users Table -->
    <v-data-table :headers="headers" :items="users" item-key="id" class="elevation-1">
      <template #item.actions="{ item }">
        <v-btn color="primary" @click="openEditDialog(item)">Edit</v-btn>
        <v-btn color="error" @click="deleteUser(item.id)">Delete</v-btn>
      </template>
    </v-data-table>

    <!-- User Dialog -->
    <v-dialog v-model="showDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ editMode ? 'Edit User' : 'Add User' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="formData.email" label="Email ID" required></v-text-field>
            <v-select v-model="formData.role" :items="roles" label="Role" required></v-select>
            <v-select
              v-if="formData.role === 'Proxy PI' || formData.role === 'Team Member'"
              v-model="formData.piId"
              :items="pis"
              item-title="email"
              item-value="id"
              label="Assigned PI"
              required
            ></v-select>
            <div v-if="formData.role === 'Proxy PI' || formData.role === 'Team Member'">
              <span class="font-weight-bold">Accessible Grants</span>
              <v-checkbox
                v-for="grant in grants"
                :key="grant.id"
                v-model="formData.grants"
                :label="grant.title"
                :value="grant.id"
              ></v-checkbox>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveUser">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useUsersStore } from '../stores/users'

const { users, grants, pis, addUser, updateUser, deleteUser } = useUsersStore()

const headers = [
  { text: 'Email', value: 'email' },
  { text: 'Role', value: 'role' },
  { text: 'Actions', value: 'actions', sortable: false },
]

const showDialog = ref(false)
const editMode = ref(false)
const formData = ref({
  id: null,
  email: '',
  role: '',
  piId: null,
  grants: [],
})
const roles = ['Grant Manager', 'Grant Admin', 'PI', 'Proxy PI', 'Team Member']

function openAddDialog() {
  editMode.value = false
  resetForm()
  showDialog.value = true
}

function openEditDialog(user) {
  editMode.value = true
  formData.value = { ...user }
  showDialog.value = true
}

function closeDialog() {
  showDialog.value = false
  resetForm()
}

function resetForm() {
  formData.value = {
    id: null,
    email: '',
    role: '',
    piId: null,
    grants: [],
  }
}

function saveUser() {
  if (editMode.value) {
    updateUser(formData.value)
  } else {
    addUser(formData.value)
  }
  closeDialog()
}
</script>
