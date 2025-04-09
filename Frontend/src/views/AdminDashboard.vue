<template>
  <v-container>
    <h1>Admin Dashboard</h1>

    <v-text-field
      v-model="search"
      label="Search Proposals"
      append-icon="mdi-magnify"
      outlined
      dense
      class="mb-4"
    ></v-text-field>

    <v-data-table
      :items="filteredProposals"
      :headers="headers"
      dense
      class="elevation-1 label-status"
    >
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
              : 'error'
          "
          dark
        >
          {{ item.status }}
        </v-chip>
      </template>

      <!-- Actions Column -->
      <template #item.actions="{ item }">
        <v-btn color="primary" @click="viewProposal(item)">View</v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { useGrantProposalsStore } from '@/stores/grantProposals'
import { API_BASE_URL } from '@/config/config'

export default {
  data() {
    return {
      search: '', // Search query
      proposals: [], // Store fetched proposals
      headers: [
        { title: 'Grant Title', value: 'projectTitle' },
        { title: 'PI Last Name', value: 'piLastName' },
        { title: 'PI First Name', value: 'piFirstName' },
        { title: 'Division', value: 'piDivision' },
        { title: 'Sponsor Due Date', value: 'sponsorDeadlineDate' },
        { title: 'Status', value: 'status', sortable: false },
        { title: 'Actions', value: 'actions', sortable: false }, // Explicit Actions column
      ],
    }
  },
  computed: {
    proposals() {
      const store = useGrantProposalsStore()
      return store.getAdminProposals() // Show only accepted/rejected proposals
    },
    filteredProposals() {
      const query = this.search.toLowerCase()
      return this.proposals
        .filter(
          (proposal) =>
            proposal.piLastName.toLowerCase().includes(query) ||
            proposal.piFirstName.toLowerCase().includes(query) ||
            proposal.division.toLowerCase().includes(query),
        )
        .reverse() // Show latest first
    },
  },
  methods: {
    viewProposal(proposal) {
      this.$router.push({ name: 'GrantView', params: { id: proposal.id } })
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
    async fetchAdminProposals() {
      try {
        const response = await fetch(`${API_BASE_URL}/grants`)
        const data = await response.json()
        this.proposals = data.filter((proposal) => proposal.status !== 'pending') // Exclude pending
        this.proposals.forEach((proposal) => {
          proposal.id = proposal._id
        })
      } catch (error) {
        console.error('Error fetching proposals:', error)
      }
    },
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler(newPath) {
        if (newPath === '/admin-dashboard') {
          this.fetchAdminProposals()
        }
      },
    },
  },
}
</script>

<style scoped>
.label-status {
  text-transform: capitalize !important;
}
</style>
