<template>
  <v-container>
    <v-btn class="back-button" color="primary" variant="outlined" @click="$router.go(-1)"
      >Back</v-btn
    >

    <v-btn
      v-if="
        isGrantAdminOrManager &&
        grant &&
        grant.status === 'accepted - pending tasklist and timeline'
      "
      class="approve-button ml-5 mb-2"
      color="success"
      @click="confirmApproval"
    >
      Approve and Send to PI
    </v-btn>

    <v-container
      v-if="grant && isPI && grant.status === 'accepted' && !grant.additionalData?.ackPi"
    >
      <v-card class="acknowledgment-card" outlined>
        <v-card-text>
          <v-checkbox
            v-model="tempAcknowledgePI"
            label="I agree with the timeline and task list for this proposal."
            @update:modelValue="confirmAcknowledgment"
          ></v-checkbox>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- Tabs -->
    <v-card v-if="grant">
      <v-tabs v-model="tab" background-color="#d50032" dark>
        <v-tab value="overview">Overview</v-tab>
        <v-tab v-if="shouldDisplayTasklist" value="timeline">Timeline</v-tab>
        <v-tab v-if="shouldDisplayTasklist" value="tasklist">Tasklist</v-tab>
      </v-tabs>

      <v-card-text>
        <v-tabs-window v-model="tab">
          <!-- Overview Tab -->
          <v-tabs-window-item value="overview">
            <v-card class="overview-card">
              <v-card-title class="headline">Grant Overview</v-card-title>

              <!-- Status & Completion Status Pills -->
              <v-row justify="center" class="status-container">
                <v-chip :color="statusColor(grant && grant.status)" class="status-pill">{{
                  grant.status
                }}</v-chip>
                <v-chip
                  :color="completionStatusColor(grant.completionStatus)"
                  class="status-pill"
                  >{{ grant.completionStatus }}</v-chip
                >
              </v-row>

              <v-divider></v-divider>
              <v-card-text class="text-left">
                <v-row>
                  <v-col cols="12" v-for="(value, key) in displayFields" :key="key">
                    <strong class="field-title">{{ formatFieldName(key) }}:</strong>
                    <template v-if="Array.isArray(value)">
                      <ul>
                        <li v-for="(item, index) in value" :key="index">{{ item }}</li>
                      </ul>
                    </template>
                    <template v-else>
                      <span class="field-value">{{ value }}</span>
                    </template>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tabs-window-item>

          <!-- Timeline Tab -->
          <v-tabs-window-item value="timeline">
            <v-card>
              <v-card-text>
                <Timeline :grant="grant" :grantId="grant._id" />
              </v-card-text>
            </v-card>
          </v-tabs-window-item>

          <!-- Tasklist Tab -->
          <v-tabs-window-item value="tasklist">
            <v-card>
              <v-card-text>
                <Tasklist :grant="grant" :grantId="grant._id" />
              </v-card-text>
            </v-card>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
  </v-container>

  <v-dialog v-model="approvalDialog" max-width="400">
    <v-card>
      <v-card-title>Confirm Approval</v-card-title>
      <v-card-text>Are you sure you want to approve and send this to the PI?</v-card-text>
      <v-card-actions>
        <v-btn color="grey" @click="approvalDialog = false">Cancel</v-btn>
        <v-btn color="success" @click="approveAndSend">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="acknowledgmentDialog" max-width="400">
    <v-card>
      <v-card-title>Confirm Acknowledgment</v-card-title>
      <v-card-text>
        This operation is one-time and final. It cannot be changed. Do you want to proceed?
      </v-card-text>
      <v-card-actions>
        <v-btn color="grey" @click="acknowledgmentDialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="acknowledge">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment'
import { useGrantProposalsStore } from '@/stores/grantProposals'
import { useUserStore } from '../stores/user'
import Tasklist from '@/components/Tasklist.vue'
import Timeline from '@/components/Timeline.vue'
import { API_BASE_URL } from '@/config/config'

export default {
  components: {
    Tasklist,
    Timeline,
  },
  data() {
    return {
      tab: 'overview',
      grant: null, // Initialize as null
      approvalDialog: false,
      acknowledgmentDialog: false,
      acknowledgePI: false,
      tempAcknowledgePI: false, // Temporary variable for checkbox state
    }
  },
  computed: {
    user() {
      const userStore = useUserStore()
      return userStore.user
    },
    shouldDisplayTasklist() {
      if (!this.user) return false
      if (!this.grant) return false
      if (
        (this.user.role === 'Grant Admin' || this.user.role === 'Grant Manager') &&
        (this.grant.status === 'accepted' ||
          this.grant.status === 'accepted - pending tasklist and timeline')
      ) {
        return true
      } else if (this.grant.status === 'accepted') {
        return true
      }
      return false
    },
    displayFields() {
      if (!this.grant) return {} // Prevents errors before data loads

      return {
        piFirstName: this.grant.piFirstName || 'N/A',
        piLastName: this.grant.piLastName || 'N/A',
        piEmail: this.grant.piEmail || 'N/A',
        piDivision: this.grant.piDivision || 'N/A',
        sponsorDeadlineDate: this.formatFieldValue(
          'sponsorDeadlineDate',
          this.grant.sponsorDeadlineDate,
        ),
        sponsorDeadlineTime: this.formatTime(this.grant.sponsorDeadlineTime),
        proposalType: this.grant.proposalType || 'N/A',
        fundingAgency: this.grant.fundingAgency || 'N/A',
        isSubaward: this.grant.isSubaward || 'N/A',
        primeInstitution: this.grant.primeInstitution || 'N/A',
        primeInstitutionContact: this.grant.primeInstitutionContact || 'N/A',
        primeInstitutionContactEmail: this.grant.primeInstitutionContactEmail || 'N/A',
        submissionBy: this.grant.submissionBy || 'N/A',
        submissionType: this.grant.submissionType || 'N/A',
        fundingOpportunity: this.grant.fundingOpportunity || 'N/A',
        temporaryAppId: this.grant.temporaryAppId || 'N/A',
        activityType: this.grant.activityType || 'N/A',
        projectTitle: this.grant.projectTitle || 'N/A',
        keyPersonnel: this.grant.keyPersonnel
          ? this.grant.keyPersonnel
              .map((kp) => `${kp?.name} (${kp?.email}, ${kp?.institution})`)
              .join(', ')
          : 'N/A',
        hasSubcontracts: this.grant.hasSubcontracts || 'N/A',
        subcontracts: this.grant.subcontracts
          ? this.grant.subcontracts
              .map(
                (sc) =>
                  `${sc?.subcontractInstitution} - PI: ${sc?.subcontractSitePI}, Contact: ${sc?.subcontractContactName} (${sc?.subcontractContactEmail})`,
              )
              .join('; ')
          : 'N/A',
        additionalRequirements: this.grant.additionalRequirements
          ? this.grant.additionalRequirements.join(', ')
          : 'N/A',
        hasConflictOfInterest: this.grant.hasConflictOfInterest || 'N/A',
        rejectionNote: this.grant.rejectionNote || 'N/A',
      }
    },
    isGrantAdminOrManager() {
      return this.user?.role === 'Grant Admin' || this.user?.role === 'Grant Manager'
    },
    isPI() {
      return this.user?.role === 'PI'
    },
  },
  methods: {
    async fetchGrantById() {
      try {
        const id = this.$route.params.id
        const response = await fetch(`${API_BASE_URL}/grants/${id}`)
        const data = await response.json()

        this.grant = data
        if (!this.grant.additionalData) {
          this.grant.additionalData = {} // Ensure additionalData exists
        }
      } catch (error) {
        console.error('Error fetching grant:', error)
      }
    },

    formatFieldName(key) {
      if (key === 'rejectionNote') {
        return "Grant Manager's note for modifications required"
      }
      return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
    },
    formatFieldValue(key, value) {
      if (!value) {
        return 'N/A'
      }
      if (key === 'sponsorDeadlineDate') {
        return moment(value).format('MMMM Do, YYYY')
      }
      return value
    },
    formatTime(value) {
      return value ? moment(value, 'HH:mm').format('hh:mm A') : 'N/A'
    },
    statusColor(status) {
      return status === 'accepted' || status === 'accepted - pending tasklist and timeline'
        ? '#008000'
        : status === 'needs modification'
          ? '#d50032'
          : '#FFA500'
    },
    completionStatusColor(status) {
      return status === 'completed' ? '#008000' : status === 'in-progress' ? '#003da5' : '#808080'
    },
    confirmApproval() {
      this.approvalDialog = true
    },
    async approveAndSend() {
      try {
        const id = this.$route.params.id
        await fetch(`${API_BASE_URL}/grants/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'accepted' }),
        })
        this.grant.status = 'accepted' // Update UI after success
        this.approvalDialog = false
        alert('The grant proposal was approved and sent to the PI.')
      } catch (error) {
        console.error('Error approving proposal:', error)
      }
    },
    async acknowledge() {
      try {
        const id = this.$route.params.id
        await fetch(`${API_BASE_URL}/grants/${id}/additionalData`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ackPi: true, // Save acknowledgment in additionalData
          }),
        })

        // ✅ Update UI after acknowledgment
        if (!this.grant.additionalData) {
          this.grant.additionalData = {} // Ensure additionalData exists
        }
        this.grant.additionalData.ackPi = true

        this.acknowledgmentDialog = false
        alert('Acknowledgment has been saved successfully.')
      } catch (error) {
        console.error('Error saving acknowledgment:', error)
      }
    },

    confirmAcknowledgment() {
      console.log('tempack', this.tempAcknowledgePI)
      if (this.tempAcknowledgePI) {
        this.acknowledgmentDialog = true
      }
    },
  },
  watch: {
    acknowledgmentDialog(val) {
      if (!val) {
        this.tempAcknowledgePI = false // Reset checkbox if dialog is closed
      }
    },
    '$route.params.id': {
      immediate: true, // Runs immediately when component is mounted
      handler(newId) {
        if (newId) {
          this.fetchGrantById()
        }
      },
    },
  },
}
</script>

<style scoped>
.overview-card {
  background-color: #f1f5fa;
  border-left: 5px solid #d50032;
  padding: 16px;
}

.field-title {
  color: #003da5;
  font-weight: bold;
}

.field-value {
  color: #333;
}

.v-tabs {
  background-color: #d50032;
  color: white;
}

.v-card {
  border-radius: 8px;
}

v-container .v-btn {
  background-color: #d50032;
  color: white;
}

v-container .v-btn:hover {
  background-color: #b40029;
}

.back-button {
  background-color: #ffff;
  margin-bottom: 8px;
}

.back-button:hover {
  background-color: #eee;
}

.overview-card {
  background-color: #fff;
  /* border-left: 5px solid #d50032; */
  padding: 16px;
  text-align: left;
  box-shadow:
    rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset,
    rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
}

.status-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.status-pill {
  margin: 5px;
  font-weight: bold;
  text-transform: uppercase;
}

.acknowledgment-card {
  border-left: 5px solid #d50032; /* UIC Red Accent */
  background-color: #f8f9fa; /* Light gray background for emphasis */
  padding: 16px;
  margin-bottom: 16px;
}
</style>
