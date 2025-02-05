<template>
  <v-container>
    <v-btn text color="primary" @click="$router.go(-1)">Back</v-btn>

    <v-card class="mt-4" outlined>
      <v-card-title>Proposal Details</v-card-title>
      <v-card-text>
        <v-row>
          <!-- PI Information -->
          <v-col cols="12" sm="6">
            <strong>PI First Name:</strong> {{ proposal.piFirstName }}
          </v-col>
          <v-col cols="12" sm="6"> <strong>PI Last Name:</strong> {{ proposal.piLastName }} </v-col>
          <v-col cols="12" sm="6"> <strong>Email:</strong> {{ proposal.piEmail }} </v-col>
          <v-col cols="12" sm="6"> <strong>Division:</strong> {{ proposal.piDivision }} </v-col>

          <!-- Sponsor Information -->
          <v-col cols="12" sm="6">
            <strong>Funding Agency:</strong> {{ proposal.fundingAgency }}
          </v-col>
          <v-col cols="12" sm="6">
            <strong>Sponsor Deadline Date:</strong> {{ formattedSponsorDeadline }}
          </v-col>
          <v-col cols="12" sm="6">
            <strong>Sponsor Deadline Time:</strong> {{ proposal.sponsorDeadlineTime }}
          </v-col>
          <v-col cols="12" sm="6">
            <strong>Proposal Type:</strong> {{ proposal.proposalType }}
          </v-col>
          <v-col cols="12" sm="6">
            <strong>Submission By:</strong> {{ proposal.submissionBy }}
          </v-col>
          <v-col cols="12" sm="6">
            <strong>Submission Type:</strong> {{ proposal.submissionType }}
          </v-col>

          <!-- Project Details -->
          <v-col cols="12" sm="6">
            <strong>Project Title:</strong> {{ proposal.projectTitle }}
          </v-col>
          <v-col cols="12" sm="6">
            <strong>Project Start Date:</strong> {{ proposal.projectStartDate }}
          </v-col>
          <v-col cols="12" sm="6">
            <strong>Project End Date:</strong> {{ proposal.projectEndDate }}
          </v-col>
          <v-col cols="12" sm="6">
            <strong>Activity Type:</strong> {{ proposal.activityType }}
          </v-col>

          <!-- Key Personnel -->
          <v-col cols="12">
            <strong>Key Personnel:</strong>
            <ul>
              <li v-for="person in proposal.keyPersonnel" :key="person.email">
                {{ person.name }} ({{ person.email }}) - {{ person.institution }}
              </li>
            </ul>
          </v-col>

          <!-- Subcontracts -->
          <v-col cols="12">
            <strong>Subcontracts:</strong>
            <ul>
              <li v-for="sub in proposal.subcontracts" :key="sub.subcontractContactEmail">
                {{ sub.subcontractInstitution }} - PI: {{ sub.subcontractSitePI }}, Contact:
                {{ sub.subcontractContactName }} ({{ sub.subcontractContactEmail }})
              </li>
            </ul>
          </v-col>

          <!-- Additional Requirements -->
          <v-col cols="12">
            <strong>Additional Requirements:</strong>
            <ul>
              <li v-for="requirement in proposal.additionalRequirements" :key="requirement">
                {{ requirement }}
              </li>
            </ul>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-row class="mt-4">
      <v-col cols="12">
        <strong>Status:</strong>
        <v-chip
          :color="
            proposal.status === 'accepted'
              ? 'green'
              : proposal.status === 'rejected'
                ? 'red'
                : 'blue'
          "
          dark
        >
          {{ proposal.status }}
        </v-chip>
      </v-col>
      <v-col cols="12" v-if="proposal.status === 'rejected'">
        <strong>Rejection Note:</strong> {{ proposal.rejectionNote }}
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <!-- Accept Button -->
      <v-col>
        <v-btn color="success" @click="openAcceptDialog" :disabled="proposal.status === 'accepted'">
          Mark as Accepted
        </v-btn>
      </v-col>

      <!-- Reject Button -->
      <v-col>
        <v-btn color="error" @click="openRejectDialog" :disabled="proposal.status === 'rejected'">
          Mark as Rejected
        </v-btn>
      </v-col>
    </v-row>
  </v-container>

  <!-- Accept Confirmation Dialog -->
  <v-dialog v-model="isAcceptDialogOpen" max-width="500px">
    <v-card>
      <v-card-title>Accept Proposal</v-card-title>
      <v-card-text>
        Are you sure you want to accept this proposal? This action cannot be undone.
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="isAcceptDialogOpen = false">Go Back</v-btn>
        <v-btn color="success" @click="confirmAcceptProposal">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Reject Dialog -->
  <v-dialog v-model="isRejectDialogOpen" max-width="500px">
    <v-card>
      <v-card-title>Reject Proposal</v-card-title>
      <v-card-text>
        <v-textarea
          v-model="rejectionNote"
          label="Specify the reason for rejection and how to correct"
          rows="4"
          outlined
          required
        ></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="isRejectDialogOpen = false">Cancel</v-btn>
        <v-btn color="error" @click="rejectProposal">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment'
import { useGrantProposalsStore } from '@/stores/grantProposals'

export default {
  computed: {
    proposal() {
      const store = useGrantProposalsStore()
      const id = this.$route.params.id // Get proposal ID from the route params
      return store.proposals.find((p) => p.id === id)
    },
    formattedSponsorDueDate() {
      if (this.proposal && this.proposal.sponsorDueDate) {
        return moment(this.proposal.sponsorDueDate).format('MMMM Do, YYYY')
      }
      return 'N/A'
    },
  },
  data() {
    return {
      isAcceptDialogOpen: false, // Controls the accept confirmation dialog
      isRejectDialogOpen: false, // Controls the reject dialog
      rejectionNote: '', // Stores the rejection reason
    }
  },
  methods: {
    openAcceptDialog() {
      this.isAcceptDialogOpen = true // Open the accept confirmation dialog
    },
    confirmAcceptProposal() {
      const store = useGrantProposalsStore()
      const id = this.$route.params.id
      const proposal = store.proposals.find((p) => p.id === id)
      if (proposal) {
        proposal.status = 'Accepted - Pending Timeline/Tasklist Confirmation' // Updated status
        proposal.rejectionNote = '' // Clear rejection note if any
        localStorage.setItem('proposals', JSON.stringify(store.proposals)) // Persist changes
      }
      this.isAcceptDialogOpen = false // Close dialog
      this.$router.push(`/grant/${id}`) // Redirect to grant details page
    },
    openRejectDialog() {
      this.isRejectDialogOpen = true // Open the rejection dialog
    },
    rejectProposal() {
      if (!this.rejectionNote.trim()) {
        alert('Please specify the reason for rejection and corrections.')
        return
      }
      const store = useGrantProposalsStore()
      const id = this.$route.params.id
      const proposal = store.proposals.find((p) => p.id === id)
      if (proposal) {
        proposal.status = 'rejected' // Update status
        proposal.rejectionNote = this.rejectionNote // Save rejection note
        localStorage.setItem('proposals', JSON.stringify(store.proposals)) // Persist changes
      }
      this.isRejectDialogOpen = false // Close dialog
      this.$router.push('/admin-dashboard') // Redirect to admin dashboard
    },
  },
}
</script>

<style scoped>
.v-card {
  border-left: 4px solid #d50032; /* UIC Red */
}

.v-btn {
  font-weight: bold;
  text-transform: uppercase;
}

.v-chip {
  font-weight: bold;
  text-transform: capitalize;
}

.v-chip[color='green'] {
  background-color: #00843d !important; /* UIC Green */
}

.v-chip[color='red'] {
  background-color: #d50032 !important; /* UIC Red */
}

.v-chip[color='blue'] {
  background-color: #003da5 !important; /* UIC Blue */
}
</style>
