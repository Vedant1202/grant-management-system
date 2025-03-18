<template>
  <v-container>
    <h1>New Grant Proposal Requests</h1>

    <!-- Search Bar -->
    <v-text-field
      v-model="search"
      label="Search Proposals"
      append-icon="mdi-magnify"
      outlined
      dense
      class="mb-4"
    ></v-text-field>

    <!-- Proposals Table -->
    <v-data-table :items="filteredProposals" :headers="headers" dense class="elevation-1">
      <template #item.actions="{ item }">
        <v-btn color="primary" @click="viewProposal(item)">View</v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { API_BASE_URL } from '@/config/config'
import { useGrantProposalsStore } from '@/stores/grantProposals'

export default {
  data() {
    return {
      search: '', // Search query
      proposals: [], // Store fetched proposals
      headers: [
        { title: 'PI Last Name', value: 'piLastName' },
        { title: 'PI First Name', value: 'piFirstName' },
        { title: 'Division', value: 'division' },
        { title: 'Sponsor Due Date', value: 'sponsorDueDate' },
        { title: 'Submission Type', value: 'submissionType' },
        { title: 'Grant Mechanism', value: 'grantMechanism' },
        { title: 'Actions', value: 'actions', sortable: false }, // Add Actions column
      ],
    }
  },
  computed: {
    filteredProposals() {
      // Filter proposals based on search query
      const query = this.search.toLowerCase()
      return this.proposals
        .filter(
          (proposal) =>
            proposal.piLastName.toLowerCase().includes(query) ||
            proposal.piFirstName.toLowerCase().includes(query) ||
            proposal.division.toLowerCase().includes(query) ||
            proposal.sponsorDueDate.toLowerCase().includes(query) ||
            proposal.submissionType.toLowerCase().includes(query) ||
            proposal.grantMechanism.toLowerCase().includes(query),
        )
        .reverse() // Reverse order to show latest additions first
    },
  },
  methods: {
    viewProposal(proposal) {
      // Navigate to the detailed view page with proposal ID
      this.$router.push({ name: 'ProposalDetail', params: { id: proposal.id } })
    },
    async fetchPendingProposals() {
      try {
        const response = await fetch(`${API_BASE_URL}/grants/pending`)
        const data = await response.json()
        data.forEach((proposal) => (proposal.id = proposal._id))
        this.proposals = data // No need to filter here, backend already filters
      } catch (error) {
        console.error('Error fetching pending proposals:', error)
      }
    },
  },
  mounted() {
    this.fetchPendingProposals()
  },
}
</script>
