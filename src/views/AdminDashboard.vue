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

    <v-data-table :items="filteredProposals" :headers="headers" dense class="elevation-1">
      <template #item.status="{ item }">
        <v-chip :color="item.status === 'accepted' ? 'success' : 'error'" dark>
          {{ item.status }}
        </v-chip>
        <v-btn color="primary" @click="viewProposal(item)">View</v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { useGrantProposalsStore } from '@/stores/grantProposals'

export default {
  data() {
    return {
      search: '', // Search query
      headers: [
        { text: 'PI Last Name', value: 'piLastName' },
        { text: 'PI First Name', value: 'piFirstName' },
        { text: 'Division', value: 'division' },
        { text: 'Sponsor Due Date', value: 'sponsorDueDate' },
        { text: 'Status', value: 'status', sortable: false },
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
      return this.proposals.filter(
        (proposal) =>
          proposal.piLastName.toLowerCase().includes(query) ||
          proposal.piFirstName.toLowerCase().includes(query) ||
          proposal.division.toLowerCase().includes(query),
      )
    },
  },
  methods: {
    viewProposal(proposal) {
      this.$router.push({ name: 'ProposalDetail', params: { id: proposal.id } })
    },
  },
}
</script>
