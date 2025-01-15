<template>
  <v-container>
    <v-row>
      <!-- Main Content Section -->
      <v-col cols="8">
        <!-- Info Section -->
        <v-card class="info-section mb-6">
          <v-card-title class="headline primary--text"> Pre-Award Support </v-card-title>
          <v-card-text>
            Please complete this form to request Pre-award Proposal Development and ensure timely
            submission. ALL proposals must be routed through the Grants & Contracts Associate/Grant
            Manager for your division.
            <v-btn color="primary" class="mt-4" @click="scrollToForm">
              Fill Intent to Submit Form
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Intent to Submit Form -->
        <v-card id="intent-form">
          <v-card-title>Department of Medicine Grant Intake Form</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="isFormValid">
              <!-- PI Information -->
              <v-text-field
                v-model="formData.piFirstName"
                label="PI First Name"
                required
              ></v-text-field>
              <v-text-field
                v-model="formData.piLastName"
                label="PI Last Name"
                required
              ></v-text-field>
              <v-text-field v-model="formData.piEmail" label="PI Email" required></v-text-field>
              <v-text-field
                v-model="formData.piDivision"
                label="PI Division Home Unit"
                required
              ></v-text-field>

              <!-- Sponsor Deadline -->
              <v-menu
                ref="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="formData.sponsorDeadlineDate"
                transition="scale-transition"
                offset-y
                attach
                min-width="auto"
              >
                <template #activator="{ props }">
                  <v-text-field
                    v-model="formattedSponsorDeadline"
                    label="Sponsor Deadline (Date)"
                    v-bind="props"
                    readonly
                    required
                  ></v-text-field>
                </template>
                <v-date-picker
                  :allowed-dates="allowedDates"
                  v-model="formData.sponsorDeadlineDate"
                  @update:modelValue="updateFormattedDate"
                ></v-date-picker>
              </v-menu>
              <v-text-field
                v-model="formData.sponsorDeadlineTime"
                label="Sponsor Deadline (Time)"
                required
              ></v-text-field>

              <!-- Proposal Details -->
              <v-select
                v-model="formData.proposalType"
                :items="[
                  'New',
                  'Continuation',
                  'Pre-Proposal',
                  'Renewal',
                  'Supplemental/Amendment',
                ]"
                label="Proposal Type"
                required
              ></v-select>
              <v-text-field
                v-model="formData.fundingAgency"
                label="Funding Agency Name"
                required
              ></v-text-field>

              <v-radio-group
                v-model="formData.isSubaward"
                label="Is this a subaward to UIC?"
                :mandatory="true"
              >
                <v-radio label="Yes" value="yes"></v-radio>
                <v-radio label="No" value="no"></v-radio>
              </v-radio-group>
              <v-text-field
                v-model="formData.primeInstitution"
                label="Prime Institution Name"
              ></v-text-field>
              <v-text-field
                v-model="formData.primeInstitutionContact"
                label="Prime Institution Contact Name"
              ></v-text-field>
              <v-text-field
                v-model="formData.primeInstitutionContactEmail"
                label="Prime Institution Contact Email"
              ></v-text-field>

              <v-select
                v-model="formData.submissionBy"
                :items="['Central Office', 'Unit']"
                label="Submission by"
                required
              ></v-select>
              <v-select
                v-model="formData.submissionType"
                :items="['NIH Assist', 'Grants.gov', 'ProposalCentral', 'Fastlane', 'Other']"
                label="Submission Type"
                required
              ></v-select>
              <v-text-field
                v-model="formData.fundingOpportunity"
                label="Funding Opportunity Number/Guidelines (URL or PDF)"
                required
              ></v-text-field>
              <v-text-field
                v-model="formData.temporaryAppId"
                label="Temporary Application ID (if applicable)"
              ></v-text-field>

              <!-- Activity Type -->
              <v-select
                v-model="formData.activityType"
                :items="[
                  'Basic Science Research',
                  'Clinical Research',
                  'Dissemination/Implementation Science Research',
                  'Institutional Training Grant',
                  'Career Development Grant',
                  'Sponsored Instruction',
                  'Other Sponsored Activity',
                ]"
                label="Activity Type"
                required
                multiple
              ></v-select>

              <v-radio-group
                v-model="formData.isClinicalTrial"
                label="Is this a Clinical Trial?"
                :mandatory="true"
              >
                <v-radio label="Yes" value="yes"></v-radio>
                <v-radio label="No" value="no"></v-radio>
              </v-radio-group>

              <!-- Project Details -->
              <v-text-field
                v-model="formData.projectStartDate"
                label="Project Start Date"
                required
              ></v-text-field>
              <v-text-field
                v-model="formData.projectEndDate"
                label="Project End Date"
                required
              ></v-text-field>
              <v-text-field
                v-model="formData.projectTitle"
                label="Project Title"
                required
              ></v-text-field>

              <!-- Key Personnel -->
              <v-textarea
                v-model="formData.keyPersonnel"
                label="Key Personnel (Names & Emails)"
                required
              ></v-textarea>

              <!-- Additional Questions -->
              <v-radio-group
                v-model="formData.hasSubcontracts"
                label="Does this submission involve any subcontracts?"
              >
                <v-radio label="Yes" value="yes"></v-radio>
                <v-radio label="No" value="no"></v-radio>
              </v-radio-group>

              <v-select
                v-model="formData.additionalRequirements"
                :items="[
                  'Human Subjects',
                  'Animals',
                  'Recombinant DNA/Infectious Agents',
                  'Human Embryonic Stem Cells',
                  'UIC Hospital Clinics/MRI Center',
                  'COVID-19 Trial',
                ]"
                label="Does the project involve any of the following?"
                multiple
              ></v-select>
              <v-radio-group
                v-model="formData.hasConflictOfInterest"
                label="Is there a conflict of interest?"
              >
                <v-radio label="Yes" value="yes"></v-radio>
                <v-radio label="No" value="no"></v-radio>
                <v-radio label="Unsure" value="unsure"></v-radio>
              </v-radio-group>

              <!-- Submit Button -->
              <v-btn :disabled="!isFormValid" color="primary" @click="openConfirmDialog"
                >Submit</v-btn
              >
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Help Notes Section -->
      <v-col cols="4" class="sticky-container mt-6">
        <v-card class="useful-links help-notes">
          <v-card-title class="subheading">Help Notes</v-card-title>
          <v-card-text>
            <ul>
              <li>
                <b>Senior/Key Personnel:</b> Individuals contributing significantly to project
                development or execution.
              </li>
              <li>
                <b>Other Significant Contributors:</b> Individuals committed to the project without
                measurable effort.
              </li>
              <li>
                <b>Consultant:</b> Provides professional advice/services for a fee but not as an
                employee.
              </li>
              <li>
                <b>Consortium Agreement:</b> Formal agreement for collaborative research with
                separate legal entities.
              </li>
            </ul>
          </v-card-text>
        </v-card>
        <v-card class="useful-links mt-6">
          <v-card-title class="subheading"> Other Useful Links </v-card-title>
          <v-card-text>
            <ul>
              <li>
                <a href="#" class="link">Proposal Submission Best Practices</a>
              </li>
              <li>
                <a href="#" class="link">Proposal Review</a>
              </li>
              <li>
                <a href="#" class="link">Recommended Budget Template</a>
              </li>
              <li>
                <a href="#" class="link">Cost Sharing Tools</a>
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Confirmation Dialog -->
  <v-dialog v-model="isDialogOpen" max-width="400px">
    <v-card>
      <v-card-title class="headline">Are you sure you want to submit?</v-card-title>
      <v-card-text>Confirm to proceed or go back to edit the form.</v-card-text>
      <v-card-actions>
        <v-btn text @click="closeDialog">Go Back</v-btn>
        <v-btn color="primary" text @click="submitForm">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment'
import { useGrantProposalsStore } from '@/stores/grantProposals'

export default {
  data() {
    return {
      isFormValid: false,
      isDialogOpen: false,
      menu: false,
      formData: {
        piFirstName: '',
        piLastName: '',
        piEmail: '',
        piDivision: '',
        sponsorDeadlineDate: new Date(),
        sponsorDeadlineTime: '',
        proposalType: '',
        fundingAgency: '',
        isSubaward: null,
        primeInstitution: '',
        primeInstitutionContact: '',
        primeInstitutionContactEmail: '',
        submissionBy: '',
        submissionType: '',
        fundingOpportunity: '',
        temporaryAppId: '',
        activityType: [],
        isClinicalTrial: null,
        projectStartDate: '',
        projectEndDate: '',
        projectTitle: '',
        keyPersonnel: '',
        hasSubcontracts: null,
        additionalRequirements: [],
        hasConflictOfInterest: null,
      },
      formattedSponsorDeadline: '',
    }
  },
  methods: {
    openConfirmDialog() {
      this.isDialogOpen = true
    },
    closeDialog() {
      this.isDialogOpen = false
    },
    updateFormattedDate() {
      if (this.formData.sponsorDeadlineDate) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        this.formattedSponsorDeadline = new Date(
          this.formData.sponsorDeadlineDate,
        ).toLocaleDateString('en-US', options)
      } else {
        this.formattedSponsorDeadline = ''
      }
    },
    allowedDates(date) {
      // Allow only dates after today
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Remove time from comparison
      return new Date(date) >= today
    },
    submitForm() {
      console.log('Form Data:', this.formData)
      // Reset the form after submission
      if (this.$refs.form.validate()) {
        const store = useGrantProposalsStore()

        // Add the form data to the centralized store
        store.addProposal({ ...this.formData })
        this.formData = {
          piFirstName: '',
          piLastName: '',
          piEmail: '',
          piDivision: '',
          sponsorDeadlineDate: new Date(),
          sponsorDeadlineTime: '',
          proposalType: '',
          fundingAgency: '',
          isSubaward: null,
          primeInstitution: '',
          primeInstitutionContact: '',
          primeInstitutionContactEmail: '',
          submissionBy: '',
          submissionType: '',
          fundingOpportunity: '',
          temporaryAppId: '',
          activityType: [],
          isClinicalTrial: null,
          projectStartDate: '',
          projectEndDate: '',
          projectTitle: '',
          keyPersonnel: '',
          hasSubcontracts: null,
          additionalRequirements: [],
          hasConflictOfInterest: null,
        }
        alert('Intent to submit form was submitted successfully!')
        // Navigate to the "New Grant Proposal Requests" page (optional)
        this.$router.push('/new-grant-proposal-requests')
      }
    },
    allowedDates(date) {
      // Allow only dates after today
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Remove time from comparison
      return new Date(date) >= today
    },
  },
  watch: {
    // Automatically update the formatted date if the date changes externally
    'formData.sponsorDueDate'(newValue) {
      this.updateFormattedDate()
    },
  },
}
</script>

<style scoped>
.v-card {
  max-width: 800px;
  margin: 20px auto;
}

.sticky-container {
  position: sticky;
  top: 20px;
}

.help-notes ul {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
}

.help-notes li {
  margin-bottom: 10px;
}

.help-notes li b {
  color: #d50032; /* Highlighted text */
}
</style>

<style scoped>
.v-card {
  max-width: 800px;
  margin: 20px auto;
}

.v-menu__content {
  z-index: 9999 !important;
}

.v-container,
.v-card {
  overflow: visible !important;
}
</style>
<style scoped>
.v-card {
  border-radius: 12px;
}

.v-card ul {
  list-style-type: none;
  padding: 0;
}

.v-card ul li {
  margin: 8px 0;
}

.v-card ul li a {
  color: #1976d2;
  font-weight: 500;
  transition: color 0.2s ease-in-out;
}

.v-card ul li a:hover {
  color: #0d47a1; /* Darker blue */
}
</style>

<style scoped>
/* Primary UIC Colors */
.primary--text {
  color: #d50032; /* UIC red */
}

.info-section {
  background-color: #ffffff; /* White background */
  padding: 24px;
  border-left: 6px solid #d50032; /* UIC red accent */
}

.useful-links {
  background-color: #f5f5f5; /* Light gray background */
  border: 1px solid #e0e0e0; /* Light border for separation */
  padding: 16px;
  border-radius: 8px;
}

.link {
  color: #1a73e8; /* UIC blue */
  text-decoration: none;
  font-weight: bold;
}

.link:hover {
  text-decoration: underline;
}

/* Form Section */
.form-section {
  background-color: #ffffff;
  padding: 24px;
}

/* Sticky Section */
.sticky-container {
  position: sticky;
  top: 20px; /* Maintain spacing from the top during scrolling */
}

/* Typography */
h1,
h2,
h3 {
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
}

p {
  font-family: 'Open Sans', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #333333; /* Dark gray for readability */
}

/* Button Styling */
.v-btn {
  color: white !important;
  background-color: #d50032 !important;
}

.v-btn:hover {
  background-color: #b40029 !important; /* Slightly darker red */
}
</style>

<style scoped>
/* UIC Colors */
.primary--text {
  color: #d50032; /* UIC red */
}

.info-section {
  background-color: #ffffff; /* White background */
  padding: 24px;
  border-left: 6px solid #d50032; /* UIC red accent */
}

.useful-links {
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  border: 2px solid #d50032; /* UIC red border */
  position: sticky;
  top: 20px; /* Sticks 20px from the top during scroll */
}

.link {
  color: #003da5; /* UIC dark blue */
  text-decoration: none;
  font-weight: bold;
}

.link:hover {
  text-decoration: underline;
}

/* Form Section */
.form-section {
  background-color: #ffffff;
  padding: 24px;
}

/* Typography */
h1,
h2,
h3 {
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
}

p {
  font-family: 'Open Sans', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #333333; /* Dark gray for readability */
}

/* Button Styling */
.v-btn {
  color: white !important;
  background-color: #d50032 !important; /* UIC red */
}

.v-btn:hover {
  background-color: #b40029 !important; /* Darker UIC red */
}

/* Sticky Container */
.sticky-container {
  position: relative;
}

.useful-links ul {
  list-style-type: none;
  padding-left: 0;
  margin: 0;
}

.useful-links li {
  margin-bottom: 10px;
}

.useful-links li::before {
  content: '●';
  color: #d50032; /* UIC red */
  font-size: 1.2em;
  margin-right: 8px;
  vertical-align: middle;
}
</style>
