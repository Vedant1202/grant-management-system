<template>
  <v-container>
    <v-card>
      <!-- Title and Search Bar Row -->
      <v-row align="center" class="px-4 py-3">
        <!-- Title -->
        <v-col cols="6">
          <v-card-title class="text-h6">My grants</v-card-title>
        </v-col>

        <!-- Search Bar -->
        <v-col cols="4" class="text-right">
          <v-text-field v-model="search" label="Search grants" outlined dense clearable>
            <template v-slot:append-inner>
              <v-icon icon="mdi-magnify" />
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <!-- Data Table -->
      <v-data-table :headers="headers" :items="filteredGrants" class="elevation-1" dense>
        <template #item.name="{ item }">
          {{ item.proposedTitle || item.projectTitle || 'Untitled Grant' }}
        </template>
        <template #item.status="{ item }">
          <v-chip
            class="label-status"
            :color="
              item.status === 'accepted' ||
              item.status === 'Accepted' ||
              item.status === 'accepted - pending tasklist and timeline'
                ? 'success'
                : item.status === 'pending'
                  ? 'warning'
                  : 'error'
            "
            dark
          >
            {{ item.status }}
          </v-chip>
        </template>
        <!-- <template #item.completionStatus="{ item }">
          <span
            :class="{
              'green--text': item.completionStatus === 'Completed',
              'orange--text': item.completionStatus === 'In progress',
            }"
          >
            {{ item.completionStatus }}
          </span>
        </template> -->
        <template #item.actions="{ item }">
          <v-btn color="primary" @click="viewGrant(item.id)">View</v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { useGrantProposalsStore } from '@/stores/grantProposals'
import { useUserStore } from '@/stores/user'
import { API_BASE_URL } from '@/config/config'

export default {
  data() {
    return {
      search: '', // Search query input by user
      grants: [], // Store fetched grants
      headers: [
        { text: 'Grant', value: 'name' }, // Table column header for Grant name
        { text: 'Status', value: 'status' }, // Table column header for Grant status
        { text: 'Actions', value: 'actions', sortable: false }, // Actions column
      ],
    }
  },
  computed: {
    filteredGrants() {
      const query = this.search.toLowerCase()
      return this.grants
        .filter((grant) => {
          const grantProposalTitle = grant.proposedTitle || grant.projectTitle
          return (
            (grantProposalTitle || '').toLowerCase().includes(query) ||
            (grant.status || '').toLowerCase().includes(query)
          )
        })
        .reverse()
    },
  },
  methods: {
    viewGrant(id) {
      this.$router.push({ name: 'GrantView', params: { id } })
    },
    async fetchUserGrants() {
      try {
        const userStore = useUserStore()
        const userEmail = userStore.userEmail // ✅ Now using the getter
        const response = await fetch(`${API_BASE_URL}/grants?piEmail=${userEmail}`)
        const grants = await response.json()
        grants.forEach((grant) => {
          grant.id = grant._id
        })
        this.grants = grants
      } catch (error) {
        console.error('Error fetching user grants:', error)
      }
    },
  },
  async mounted() {
    await this.fetchUserGrants()
  },
  watch: {
    'userStore.userEmail': {
      immediate: true,
      handler(newEmail) {
        if (newEmail) {
          this.fetchUserGrants()
        }
      },
    },
    // '$route.path': {
    //   immediate: true, // Run this immediately when component is created
    //   handler(newPath) {
    //     if (newPath === '/proposals') {
    //       this.fetchUserGrants() // Fetch proposals again
    //     }
    //   },
    // },
  },
}
</script>

<style scoped>
.v-card {
  margin-top: 20px;
  border-radius: 8px;
  padding: 16px;
}

.green--text {
  color: #4caf50; /* Green for completed */
}

.orange--text {
  color: #fb8c00; /* Orange for in progress */
}

.label-status {
  text-transform: capitalize !important;
}
</style>
