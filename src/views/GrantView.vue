<template>
  <v-container>
    <v-btn class="back-button" color="primary" variant="outlined" @click="$router.go(-1)"
      >Back</v-btn
    >

    <v-btn
      v-if="isGrantAdminOrManager && grant.status === 'accepted - pending tasklist and timeline'"
      class="approve-button ml-5 mb-2"
      color="success"
      @click="confirmApproval"
    >
      Approve and Send to PI
    </v-btn>

    <v-container v-if="isPI && grant.status === 'accepted' && !grant.ackPI">
      <v-card class="acknowledgment-card" outlined>
        <v-card-text>
          <v-checkbox
            v-model="tempAcknowledgePI"
            label="I agree with the timeline and task list for this proposal."
            @change="confirmAcknowledgment"
          ></v-checkbox>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- Tabs -->
    <v-card>
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
                <v-chip :color="statusColor(grant.status)" class="status-pill">{{
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
                <Timeline :grantId="grant.id" />
              </v-card-text>
            </v-card>
          </v-tabs-window-item>

          <!-- Tasklist Tab -->
          <v-tabs-window-item value="tasklist">
            <v-card>
              <v-card-text>
                <Tasklist :grantId="grant.id" />
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

export default {
  components: {
    Tasklist,
    Timeline,
  },
  data() {
    return {
      tab: 'overview',
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
    grant() {
      const store = useGrantProposalsStore()
      const id = this.$route.params.id
      return store.proposals.find((p) => p.id === id) || {}
    },
    displayFields() {
      return {
        piFirstName: this.grant.piFirstName,
        piLastName: this.grant.piLastName,
        piEmail: this.grant.piEmail,
        piDivision: this.grant.piDivision,
        sponsorDeadlineDate: this.formatFieldValue(
          'sponsorDeadlineDate',
          this.grant.sponsorDeadlineDate,
        ),
        sponsorDeadlineTime: this.formatTime(this.grant.sponsorDeadlineTime),
        proposalType: this.grant.proposalType,
        fundingAgency: this.grant.fundingAgency,
        isSubaward: this.grant.isSubaward,
        primeInstitution: this.grant.primeInstitution,
        primeInstitutionContact: this.grant.primeInstitutionContact,
        primeInstitutionContactEmail: this.grant.primeInstitutionContactEmail,
        submissionBy: this.grant.submissionBy,
        submissionType: this.grant.submissionType,
        fundingOpportunity: this.grant.fundingOpportunity,
        temporaryAppId: this.grant.temporaryAppId,
        activityType: this.grant.activityType,
        projectTitle: this.grant.projectTitle,
        keyPersonnel: this.grant.keyPersonnel
          ?.map((kp) => `${kp?.name} (${kp?.email}, ${kp?.institution})`)
          .join(', '),
        hasSubcontracts: this.grant.hasSubcontracts,
        subcontracts: this.grant.subcontracts
          ?.map(
            (sc) =>
              `${sc?.subcontractInstitution} - PI: ${sc?.subcontractSitePI}, Contact: ${sc?.subcontractContactName} (${sc?.subcontractContactEmail})`,
          )
          .join('; '),
        additionalRequirements: this.grant.additionalRequirements?.join(', '),
        hasConflictOfInterest: this.grant.hasConflictOfInterest,
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
    approveAndSend() {
      alert('The grant proposal was approved by you and sent to the PI')
      this.grant.status = 'accepted'
      useGrantProposalsStore().updateProposalStatus(this.grant.id, 'accepted')
      this.approvalDialog = false
    },
    confirmAcknowledgment() {
      if (this.tempAcknowledgePI) {
        this.acknowledgmentDialog = true
      }
    },
    acknowledge() {
      this.grant.ackPI = true
      this.acknowledgePI = true
      useGrantProposalsStore().updateProposalStatus(
        this.grant.id,
        this.grant.status,
        'Acknowledged by PI',
      )
      this.acknowledgmentDialog = false
      alert('Acknowledgment has been sent.')
    },
  },
  watch: {
    acknowledgmentDialog(val) {
      if (!val) {
        this.tempAcknowledgePI = false // Reset checkbox if dialog is closed
      }
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
