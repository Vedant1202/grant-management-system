<template>
  <v-container>
    <v-btn text color="primary" @click="$router.go(-1)">Back</v-btn>

    <v-card class="mt-4" outlined>
      <v-card-title>Proposal Details</v-card-title>
      <v-card-text>
        <v-row v-if="proposal">
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
        <v-row v-else> Proposal not found </v-row>
      </v-card-text>
    </v-card>

    <v-row v-if="proposal" class="mt-4">
      <v-col cols="12">
        <strong>Status:</strong>
        <v-chip
          :color="
            proposal.status === 'accepted'
              ? 'green'
              : proposal.status === 'needs modification'
                ? 'red'
                : 'blue'
          "
          dark
        >
          {{ proposal.status }}
        </v-chip>
      </v-col>
      <v-col cols="12" v-if="proposal.status === 'needs modification'">
        <strong>Grant Manager note for needing modification:</strong> {{ proposal.rejectionNote }}
      </v-col>
    </v-row>

    <v-row v-if="proposal" class="mt-4">
      <!-- Accept Button -->
      <v-col>
        <v-btn color="success" @click="openAcceptDialog" :disabled="proposal.status === 'accepted'">
          Mark as Accepted
        </v-btn>
      </v-col>

      <!-- Reject Button -->
      <v-col>
        <v-btn color="error" @click="openRejectDialog" :disabled="proposal.status === 'rejected'">
          Mark as 'Needs Modifications'
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
      <v-card-title>Mark as Needs Modifications to Proposal</v-card-title>
      <v-card-text>
        <v-textarea
          v-model="rejectionNote"
          label="Specify the reason for needing modifications and how to correct"
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
import { API_BASE_URL } from '@/config/config'
import { useGrantProposalsStore } from '@/stores/grantProposals'

export default {
  computed: {
    formattedSponsorDueDate() {
      return this.proposal?.sponsorDueDate
        ? moment(this.proposal.sponsorDueDate).format('MMMM Do, YYYY')
        : 'N/A'
    },
  },
  data() {
    return {
      isAcceptDialogOpen: false, // Controls the accept confirmation dialog
      isRejectDialogOpen: false, // Controls the reject dialog
      rejectionNote: '', // Stores the rejection reason
      proposal: null, // Store fetched proposal
    }
  },
  methods: {
    async fetchProposalById(id) {
      try {
        const response = await fetch(`${API_BASE_URL}/grants/${id}`)
        this.proposal = await response.json()
      } catch (error) {
        console.error('Error fetching proposal:', error)
      }
    },
    openAcceptDialog() {
      this.isAcceptDialogOpen = true // Open the accept confirmation dialog
    },
    async confirmAcceptProposal() {
      try {
        const id = this.$route.params.id
        await fetch(`${API_BASE_URL}/grants/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'accepted' }),
        })
        this.proposal.status = 'accepted' // Update UI
        this.isAcceptDialogOpen = false
      } catch (error) {
        console.error('Error updating proposal status:', error)
      }
    },
    openRejectDialog() {
      this.isRejectDialogOpen = true // Open the rejection dialog
    },
    async rejectProposal() {
      if (!this.rejectionNote.trim()) {
        alert('Please specify the reason for rejection and corrections.')
        return
      }
      try {
        const id = this.$route.params.id
        await fetch(`${API_BASE_URL}/grants/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'needs modification', rejectionNote: this.rejectionNote }),
        })
        this.proposal.status = 'needs modification' // Update UI
        this.proposal.rejectionNote = this.rejectionNote
        this.isRejectDialogOpen = false
        this.$router.push('/admin-dashboard') // Redirect
      } catch (error) {
        console.error('Error rejecting proposal:', error)
      }
    },
  },
  watch: {
    '$route.params.id': {
      immediate: true, // Runs immediately when component is mounted
      handler(newId) {
        if (newId) {
          this.fetchProposalById(newId)
          console.log('fetched')
        }
      },
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
