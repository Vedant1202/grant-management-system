<template>
  <v-container>
    <h1>New Grant Proposal Requests</h1>

    <!-- Search Input -->
    <v-text-field
      v-model="search"
      label="Search Proposals"
      append-icon="mdi-magnify"
      outlined
      dense
      class="mb-4"
    ></v-text-field>

    <!-- Proposal Table -->
    <v-data-table
      :items="filteredProposals"
      :headers="headers"
      dense
      class="elevation-1 label-status"
    >
      <!-- Division Formatting -->
      <template #item.piDivision="{ item }">
        {{ formatDivision(item.piDivision) }}
      </template>

      <!-- Sponsor Due Date Formatting -->
      <template #item.sponsorDeadlineDate="{ item }">
        {{ formatDate(item.sponsorDeadlineDate) }}
      </template>

      <!-- Actions Column -->
      <template #item.actions="{ item }">
        <v-btn color="primary" @click="viewProposal(item)">View</v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { API_BASE_URL } from '@/config/config'
import { useUserStore } from '@/stores/user' // if not already imported

const divisionCodeMap = {
  586003: 'Cardiology (586003)',
  586004: 'GI/Hepatology (586004)',
  586006: 'AIM (586006)',
  586008: 'Hem/Onc (586008)',
  586009: 'Infectious Diseases (586009)',
  586010: 'Nephrology (586010)',
  586012: 'Rheumatology (586012)',
  586015: 'Endocrinology (586015)',
  586020: 'Institute for Minority Health Research (IMHR) (586020)',
  586030: 'Center for Dissemination & Implementation Science (CDIS) (586030)',
}

export default {
  data() {
    return {
      search: '',
      proposals: [],
      headers: [
        { title: 'Grant Title', value: 'projectTitle' },
        { title: 'PI Last Name', value: 'piLastName' },
        { title: 'PI First Name', value: 'piFirstName' },
        { title: 'Division', value: 'piDivision' },
        { title: 'Sponsor Due Date', value: 'sponsorDeadlineDate' },
        { title: 'Submission Type', value: 'submissionType' },
        { title: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  computed: {
    filteredProposals() {
      const query = this.search.toLowerCase()
      return this.proposals
        .filter(
          (p) =>
            (p.piLastName || '').toLowerCase().includes(query) ||
            (p.piFirstName || '').toLowerCase().includes(query) ||
            (p.projectTitle || '').toLowerCase().includes(query) ||
            (p.division || '').toLowerCase().includes(query),
        )
        .reverse()
    },
  },
  methods: {
    viewProposal(proposal) {
      this.$router.push({ name: 'ProposalDetail', params: { id: proposal.id } })
    },
    formatDivision(code) {
      return divisionCodeMap[code] || code || '—'
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
    async fetchPendingProposals() {
      const userStore = useUserStore()
      const { role, division } = userStore.user

      try {
        let response

        if (role === 'Grant Manager' && division) {
          // Hit new backend route with division filter
          response = await fetch(`${API_BASE_URL}/grants/pending/department/${division}`)
        } else {
          // Default for Grant Admin or others
          response = await fetch(`${API_BASE_URL}/grants/pending`)
        }

        const data = await response.json()
        data.forEach((p) => (p.id = p._id))
        this.proposals = data
      } catch (err) {
        console.error('Error fetching proposals:', err)
      }
    },
  },
  mounted() {
    this.fetchPendingProposals()
  },
}
</script>

<style scoped>
.label-status {
  text-transform: capitalize !important;
}
</style>
