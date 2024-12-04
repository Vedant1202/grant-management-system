<template>
  <v-container>
    <v-row>
      <!-- Main Content Section -->
      <v-col cols="8">
        <!-- Info Section -->
        <v-card class="info-section mb-6">
          <v-card-title class="headline primary--text"> Pre-Award Support </v-card-title>
          <v-card-text>
            <p>
              For URICA supported proposals, please utilize the
              <a href="#" class="link">URICA Proposal Intake Form</a> to notify the team of the need
              for proposal support. URICA greatly appreciates notification as far in advance of
              submissions as possible in order to provide the best possible service. URICA will not
              be able to begin work on your proposal support until provided with a proposal intake
              form submission, which will include the critical information needed to begin providing
              pre-award research administration support.
            </p>
            <p>
              CERES will be replacing InfoEd on April 24 when the system goes live at Northwestern.
              The system will be used for proposal submissions (directly to Grants.gov or not),
              grant and contract administration, award management including award modifications and
              other post-award changes, and agreements management.
            </p>
            <p>
              Please visit the
              <a href="#" class="link">CERES Cutover Timeline</a> for proposal submission and change
              request cutoff dates. Reach out to your research administrator as soon as possible
              with any questions or concerns.
            </p>
            <v-btn color="primary" class="mt-4" @click="scrollToForm">
              Fill Intent to Submit Form
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Scroll Button -->
        <!-- <v-row justify="center">
      <v-btn color="primary" large @click="scrollToForm"> Go to Intent to Submit Form </v-btn>
    </v-row> -->

        <v-card id="intent-form">
          <v-card-title>Department of Medicine Intent to Submit Survey</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="isFormValid">
              <!-- PI Information -->
              <v-text-field
                v-model="formData.piLastName"
                label="PI Last Name"
                required
              ></v-text-field>

              <v-text-field
                v-model="formData.piFirstName"
                label="PI First Name"
                required
              ></v-text-field>

              <v-text-field v-model="formData.x500" label="x500" required></v-text-field>

              <v-text-field v-model="formData.division" label="Division" required></v-text-field>

              <!-- Grant Details -->
              <v-text-field
                v-model="formData.rfa"
                label="What RFA/PA or other announcement are you applying to? (Provide link)"
                required
              ></v-text-field>

              <v-text-field
                v-model="formData.grantMechanism"
                label="What is the grant mechanism?"
                required
              ></v-text-field>

              <v-radio-group
                v-model="formData.careerAward"
                label="Is this a Career Development Award that requires dedicated research time?"
                :mandatory="true"
              >
                <v-radio label="Yes" value="yes"></v-radio>
                <v-radio label="No" value="no"></v-radio>
              </v-radio-group>

              <!-- Submission Type -->
              <v-select
                v-model="formData.submissionType"
                :items="['New', 'Resubmission (A1)', 'Renewal', 'Supplement', 'Subcontract']"
                label="What is the type of submission?"
                required
              ></v-select>

              <!-- Sponsor Information -->
              <v-text-field
                v-model="formData.sponsor"
                label="Who is the sponsor?"
                required
              ></v-text-field>

              <!-- Sponsor Information -->
              <!-- <div>
            <h3>Selected Due Date: {{ formData.sponsorDueDate || 'None' }}</h3>
          </div> -->
              <v-menu
                :close-on-content-click="false"
                :persistent="false"
                transition="scale-transition"
                offset-y
                attach
              >
                <template #activator="{ props }">
                  <v-text-field
                    v-model="formattedSponsorDueDate"
                    label="What is the sponsor due date?"
                    readonly
                    v-bind="props"
                    required
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="formData.sponsorDueDate"
                  :allowed-dates="allowedDates"
                  @input="handleDateInput"
                ></v-date-picker>
              </v-menu>

              <v-text-field
                v-model="formData.proposedTitle"
                label="What is the proposed or draft Title?"
              ></v-text-field>

              <v-radio-group
                v-model="formData.continuousSubmission"
                label="If this is an NIH proposal, are you eligible for Continuous Submission?"
              >
                <v-radio label="Yes" value="yes"></v-radio>
                <v-radio label="No" value="no"></v-radio>
              </v-radio-group>

              <!-- Personnel -->
              <v-textarea
                v-model="formData.knownPersonnel"
                label="List all known personnel (Co-PIs, Co-Is, Research Staff, etc) and corresponding department involved in this proposal."
                required
              ></v-textarea>

              <!-- Subcontracts -->
              <v-radio-group
                v-model="formData.outgoingSubcontracts"
                label="Will your proposal involve any outgoing subcontract(s)?"
                :mandatory="true"
              >
                <v-radio label="Yes" value="yes"></v-radio>
                <v-radio label="No" value="no"></v-radio>
              </v-radio-group>

              <!-- Human and Animal Subjects -->
              <v-radio-group v-model="formData.humanSubjects" label="Are human subjects involved?">
                <v-radio label="Yes" value="yes"></v-radio>
                <v-radio label="No" value="no"></v-radio>
              </v-radio-group>

              <v-radio-group
                v-model="formData.animalSubjects"
                label="Are animals involved?"
                :mandatory="true"
              >
                <v-radio label="Yes" value="yes"></v-radio>
                <v-radio label="No" value="no"></v-radio>
              </v-radio-group>

              <!-- Pre-submission Review -->
              <v-select
                v-model="formData.preSubmissionReview"
                :items="[
                  'Thematically aligned UMN colleague(s) within DOM, unpaid',
                  'Thematically aligned UMN colleague(s) outside DOM, unpaid',
                  'Thematically aligned external colleagues, unpaid',
                  'External consultants, paid',
                  'Co-Investigators, collaborators, and members of immediate research team on this grant',
                  'Research Mentors',
                  'None desired',
                  'Don’t know, I need help',
                  'Other',
                ]"
                label="Who will provide pre-submission review of your proposal?"
                required
              ></v-select>

              <v-select
                v-model="formData.reviewContent"
                :items="['Specific Aims only', 'Entire research proposal', 'Other', 'N/A']"
                label="For your pre-submission review, what will be reviewed?"
                required
              ></v-select>

              <v-radio-group
                v-model="formData.shareApplication"
                label="Would you be willing to share your complete application with others in the Department of Medicine as a resource?"
              >
                <v-radio label="Yes" value="yes"></v-radio>
                <v-radio label="No" value="no"></v-radio>
              </v-radio-group>

              <!-- Submit Button -->
              <v-btn :disabled="!isFormValid" color="primary" @click="openConfirmDialog">
                Submit
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Sticky Useful Links Section -->
      <v-col cols="4" class="sticky-container mt-6">
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

  <!-- Success Dialog -->
  <v-dialog v-model="isSuccessDialogOpen" max-width="400px">
    <v-card>
      <v-card-title class="headline">Form Submitted</v-card-title>
      <v-card-text>Your form has been successfully submitted!</v-card-text>
      <v-card-actions>
        <v-btn color="primary" text @click="closeSuccessDialog">Okay</v-btn>
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
      isDialogOpen: false, // For the confirmation dialog
      isSuccessDialogOpen: false, // For the success dialog
      menu: false, // Controls the date picker menu
      formData: {
        piLastName: '',
        piFirstName: '',
        x500: '',
        division: '',
        rfa: '',
        grantMechanism: '',
        careerAward: null,
        submissionType: '',
        sponsor: '',
        sponsorDueDate: null, // Updated to handle date input
        proposedTitle: '',
        continuousSubmission: null,
        knownPersonnel: '',
        outgoingSubcontracts: null,
        humanSubjects: null,
        animalSubjects: null,
        preSubmissionReview: '',
        reviewContent: '',
        shareApplication: null,
        minDate: new Date().toISOString().substr(0, 10), // Set minimum date to today
      },
      formattedSponsorDueDate: '', // Stores the human-readable date
    }
  },
  methods: {
    crollToForm() {
      const formElement = document.getElementById('intent-form')
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' })
      }
    },

    submitForm() {
      if (this.$refs.form.validate()) {
        const store = useGrantProposalsStore()

        // Add the form data to the centralized store
        store.addProposal({ ...this.formData })

        console.log('Form Submitted:', this.formData)

        // Reset the form after submission
        this.formData = {
          piLastName: '',
          piFirstName: '',
          x500: '',
          division: '',
          rfa: '',
          grantMechanism: '',
          careerAward: null,
          submissionType: '',
          sponsor: '',
          sponsorDueDate: '',
          proposedTitle: '',
          continuousSubmission: null,
          knownPersonnel: '',
          outgoingSubcontracts: null,
          humanSubjects: null,
          animalSubjects: null,
          preSubmissionReview: '',
          reviewContent: '',
          shareApplication: null,
        }

        // Navigate to the "New Grant Proposal Requests" page (optional)
        this.$router.push('/new-grant-proposal-requests')
      }
    },
    openConfirmDialog() {
      this.isDialogOpen = true
    },
    closeDialog() {
      this.isDialogOpen = false
    },
    closeSuccessDialog() {
      this.isSuccessDialogOpen = false
    },
    allowedDates(date) {
      // Allow only dates after today
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Remove time from comparison
      return new Date(date) >= today
    },
    updateFormattedDate() {
      if (this.formData.sponsorDueDate) {
        this.formattedSponsorDueDate = moment(this.formData.sponsorDueDate).format('MMMM Do, YYYY')
      } else {
        this.formattedSponsorDueDate = ''
      }
    },
    handleDateInput(date) {
      this.formData.sponsorDueDate = date
      this.updateFormattedDate() // Format the selected date
      // this.
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
