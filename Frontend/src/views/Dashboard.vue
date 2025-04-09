<template>
  <v-container>
    <h1>My Grant Proposals</h1>

    <!-- Search Input -->
    <v-text-field
      v-model="search"
      label="Search Proposals"
      append-icon="mdi-magnify"
      outlined
      dense
      class="mb-4"
    ></v-text-field>

    <!-- Proposals Table -->
    <v-data-table :items="filteredGrants" :headers="headers" dense class="elevation-1 label-status">
      <template #item.piDivision="{ item }">
        {{ formatDivision(item.piDivision) }}
      </template>

      <!-- Sponsor Due Date Column -->
      <template #item.sponsorDeadlineDate="{ item }">
        {{ formatDate(item.sponsorDeadlineDate) }}
      </template>

      <!-- Status Column -->
      <template #item.status="{ item }">
        <v-chip
          class="label-status"
          :color="
            item.status === 'accepted' || item.status === 'accepted - pending tasklist and timeline'
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

      <!-- Actions Column -->
      <template #item.actions="{ item }">
        <v-btn color="primary" @click="viewGrant(item.id)">View</v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { useUserStore } from '@/stores/user'
import { API_BASE_URL } from '@/config/config'

export default {
  data() {
    return {
      search: '',
      grants: [],
      headers: [
        { title: 'Grant Title', value: 'projectTitle' },
        { title: 'PI Last Name', value: 'piLastName' },
        { title: 'PI First Name', value: 'piFirstName' },
        { title: 'Division', value: 'piDivision' },
        { title: 'Sponsor Due Date', value: 'sponsorDeadlineDate' },
        { title: 'Status', value: 'status', sortable: false },
        { title: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  computed: {
    filteredGrants() {
      const query = this.search.toLowerCase()
      return this.grants
        .filter(
          (grant) =>
            (grant.piLastName || '').toLowerCase().includes(query) ||
            (grant.piFirstName || '').toLowerCase().includes(query) ||
            (grant.piDivision || '').toLowerCase().includes(query),
        )
        .reverse()
    },
  },
  methods: {
    viewGrant(id) {
      this.$router.push({ name: 'GrantView', params: { id } })
    },
    formatDate(dateStr) {
      if (!dateStr) return '—'
      const date = new Date(dateStr)
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },
    formatDivision(raw) {
      const divisionCodeMap = {
        586003: 'Cardiology (586003)',
        586004: 'GI/Hepatology (586004)',
        586006: 'AIM (586006)',
        586008: 'Hem/Onc (586008)',
        586009: 'Infectious Diseases / Pulmonary (586009)', // Could also be Pulmonary—let's disambiguate if needed
        586010: 'Nephrology (586010)',
        586012: 'Rheumatology (586012)',
        586015: 'Endocrinology (586015)',
        586020: 'Institute for Minority Health Research (IMHR) (586020)',
        586030: 'Center for Dissemination & Implementation Science (CDIS) (586030)',
      }
      return divisionCodeMap[raw] || raw || '—'
    },
    async fetchUserGrants() {
      try {
        const userStore = useUserStore()
        const userEmail = userStore.userEmail
        const response = await fetch(`${API_BASE_URL}/grants?piEmail=${userEmail}`)
        const data = await response.json()
        data.forEach((grant) => (grant.id = grant._id))
        this.grants = data
      } catch (err) {
        console.error('Error fetching PI grants:', err)
      }
    },
  },
  async mounted() {
    await this.fetchUserGrants()
  },
}
</script>

<style scoped>
.label-status {
  text-transform: capitalize !important;
}
</style>
