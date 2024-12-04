<template>
  <v-container>
    <v-btn text color="primary" @click="$router.go(-1)">Back</v-btn>

    <v-card class="mt-4">
      <v-card-title>Proposal Details</v-card-title>
      <v-card-text>
        <v-row>
          <!-- PI Information -->
          <v-col cols="12" sm="6"> <strong>PI Last Name:</strong> {{ proposal.piLastName }} </v-col>
          <v-col cols="12" sm="6">
            <strong>PI First Name:</strong> {{ proposal.piFirstName }}
          </v-col>
          <v-col cols="12" sm="6"> <strong>x500:</strong> {{ proposal.x500 }} </v-col>
          <v-col cols="12" sm="6"> <strong>Division:</strong> {{ proposal.division }} </v-col>

          <!-- Grant Details -->
          <v-col cols="12" sm="6"> <strong>RFA/PA Announcement:</strong> {{ proposal.rfa }} </v-col>
          <v-col cols="12" sm="6">
            <strong>Grant Mechanism:</strong> {{ proposal.grantMechanism }}
          </v-col>
          <v-col cols="12" sm="6">
            <strong>Career Development Award:</strong>
            {{ proposal.careerAward === 'yes' ? 'Yes' : 'No' }}
          </v-col>
          <v-col cols="12" sm="6">
            <strong>Submission Type:</strong> {{ proposal.submissionType }}
          </v-col>

          <!-- Sponsor Information -->
          <v-col cols="12" sm="6"> <strong>Sponsor:</strong> {{ proposal.sponsor }} </v-col>
          <v-col cols="12" sm="6">
            <strong>Sponsor Due Date:</strong>
            {{ formattedSponsorDueDate }}
          </v-col>
          <v-col cols="12" sm="12">
            <strong>Proposed Title:</strong> {{ proposal.proposedTitle }}
          </v-col>
          <v-col cols="12" sm="6">
            <strong>Continuous Submission:</strong>
            {{ proposal.continuousSubmission === 'yes' ? 'Yes' : 'No' }}
          </v-col>

          <!-- Personnel -->
          <v-col cols="12">
            <strong>Known Personnel:</strong>
            {{ proposal.knownPersonnel }}
          </v-col>

          <!-- Subcontracts -->
          <v-col cols="12" sm="6">
            <strong>Outgoing Subcontracts:</strong>
            {{ proposal.outgoingSubcontracts === 'yes' ? 'Yes' : 'No' }}
          </v-col>

          <!-- Human and Animal Subjects -->
          <v-col cols="12" sm="6">
            <strong>Human Subjects Involved:</strong>
            {{ proposal.humanSubjects === 'yes' ? 'Yes' : 'No' }}
          </v-col>
          <v-col cols="12" sm="6">
            <strong>Animals Involved:</strong>
            {{ proposal.animalSubjects === 'yes' ? 'Yes' : 'No' }}
          </v-col>

          <!-- Pre-submission Review -->
          <v-col cols="12" sm="6">
            <strong>Pre-submission Review:</strong> {{ proposal.preSubmissionReview }}
          </v-col>
          <v-col cols="12" sm="6">
            <strong>Review Content:</strong> {{ proposal.reviewContent }}
          </v-col>

          <!-- Sharing Application -->
          <v-col cols="12" sm="6">
            <strong>Share Complete Application:</strong>
            {{ proposal.shareApplication === 'yes' ? 'Yes' : 'No' }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-row class="mt-4">
      <v-col cols="12"> <strong>Status:</strong> {{ proposal.status }} </v-col>
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
        proposal.status = 'accepted' // Update status
        proposal.rejectionNote = '' // Clear rejection note if any
        localStorage.setItem('proposals', JSON.stringify(store.proposals)) // Persist changes
      }
      this.isAcceptDialogOpen = false // Close dialog
      this.$router.push('/admin-dashboard') // Redirect to admin dashboard
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
