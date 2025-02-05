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
      <!-- Status Column -->
      <template #item.status="{ item }">
        <v-chip
          :color="
            item.status === 'accepted' ||
            item.status === 'Accepted - Pending Timeline/Tasklist Confirmation'
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

export default {
  data() {
    return {
      search: '', // Search query
      headers: [
        { title: 'PI Last Name', value: 'piLastName' },
        { title: 'PI First Name', value: 'piFirstName' },
        { title: 'Division', value: 'division' },
        { title: 'Sponsor Due Date', value: 'sponsorDueDate' },
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
      this.$router.push({ name: 'GrantView', params: { id: proposal.id } })
    },
  },
}
</script>
