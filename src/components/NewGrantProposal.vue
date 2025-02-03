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
            <!-- <v-btn color="primary" class="mt-4" @click="scrollToForm">
              Fill Intent to Submit Form
            </v-btn> -->
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
              <v-select
                v-model="formData.piDivision"
                :items="[
                  { text: 'Cardiology (586003)', value: '586003' },
                  { text: 'GI/Hepatology (586004)', value: '586004' },
                  { text: 'AIM (586006)', value: '586006' },
                  { text: 'Hem/Onc (586008)', value: '586008' },
                  { text: 'Infectious Diseases (586009)', value: '586009' },
                  { text: 'Pulmonary (586009)', value: '586009' },
                  { text: 'Nephrology (586010)', value: '586010' },
                  { text: 'Rheumatology (586012)', value: '586012' },
                  { text: 'Endocrinology (586015)', value: '586015' },
                  {
                    text: 'Institute for Minority Health Research (IMHR) (586020)',
                    value: '586020',
                  },
                  {
                    text: 'Center for Dissemination & Implementation Science (CDIS) (586030)',
                    value: '586030',
                  },
                ]"
                item-title="text"
                item-value="value"
                label="PI Division Home Unit"
                required
              ></v-select>

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

              <!-- Conditional Block for Prime Institution Details -->
              <template v-if="formData.isSubaward === 'yes'">
                <v-card class="optional-block">
                  <v-card-title class="optional-title">Prime Institution Details</v-card-title>
                  <v-card-text>
                    <v-text-field
                      v-model="formData.primeInstitution"
                      label="Prime Institution Name"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="formData.primeInstitutionContact"
                      label="Prime Institution Contact Name"
                      required
                    ></v-text-field>
                    <v-text-field
                      v-model="formData.primeInstitutionContactEmail"
                      label="Prime Institution Contact Email"
                      required
                    ></v-text-field>
                  </v-card-text>
                </v-card>
              </template>

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
                label="Funding Opportunity Number/Guidelines (URL)"
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
                  { text: 'Research', value: 'Research' },
                  { text: 'Clinical Trial', value: 'Clinical Trial' },
                  { text: 'Other Sponsored Activity', value: 'Other Sponsored Activity' },
                  { text: 'Instruction', value: 'Instruction' },
                  { text: 'Fellowship', value: 'Fellowship' },
                ]"
                item-title="text"
                item-value="value"
                label="ePAF Activity Type"
                required
              ></v-select>

              <!-- Clinical Trial Definition Box -->
              <template v-if="formData.activityType === 'Clinical Trial'">
                <v-card class="clinical-trial-info">
                  <v-card-title class="info-title">What is a Clinical Trial?</v-card-title>
                  <v-card-text>
                    <p>
                      <strong>The National Institutes of Health (NIH)</strong> defines a clinical
                      trial as a research study that involves all of the following:
                    </p>
                    <ul class="info-list">
                      <li><strong>a.</strong> The study involves human participants.</li>
                      <li>
                        <strong>b.</strong> Participants are prospectively assigned to an
                        intervention.
                      </li>
                      <li>
                        <strong>c.</strong> The study is designed to evaluate the effect of an
                        intervention on the participants.
                      </li>
                      <li>
                        <strong>d.</strong> The effect being evaluated is a health-related
                        biomedical or behavioral outcome.
                      </li>
                    </ul>
                  </v-card-text>
                </v-card>
              </template>

              <!-- Clinical Trial Question -->

              <!-- Conditional Follow-up Questions if "Yes" is Selected -->
              <template v-if="formData.isClinicalTrial === 'yes'">
                <v-card class="optional-block">
                  <v-card-title class="optional-title">
                    Would you like to consult with someone regarding the Clinical Trials/Human
                    Subjects section in ASSIST?
                  </v-card-title>
                  <v-card-text>
                    <v-radio-group v-model="formData.consultClinicalTrials">
                      <v-radio label="Yes" value="yes"></v-radio>
                      <v-radio label="No" value="no"></v-radio>
                    </v-radio-group>
                  </v-card-text>
                </v-card>

                <v-card class="optional-block">
                  <v-card-title class="optional-title">
                    Would you like to consult with the DOM CTU? (Add contact email address)
                  </v-card-title>
                  <v-card-text>
                    <v-radio-group v-model="formData.consultDOMCTU">
                      <v-radio label="Yes" value="yes"></v-radio>
                      <v-radio label="No" value="no"></v-radio>
                    </v-radio-group>
                  </v-card-text>
                </v-card>
              </template>

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

              <v-card class="optional-block">
                <v-card-title class="optional-title">Key Personnel</v-card-title>
                <v-card-text>
                  <div
                    v-for="(person, index) in formData.keyPersonnel"
                    :key="index"
                    class="person-entry"
                  >
                    <v-text-field v-model="person.name" label="Name" required></v-text-field>
                    <v-text-field v-model="person.email" label="Email" required></v-text-field>
                    <v-text-field
                      v-model="person.institution"
                      label="UIC Home Unit or Other Institution Name"
                      required
                    ></v-text-field>
                    <v-btn
                      icon
                      density="comfortable"
                      size="small"
                      @click="removeKeyPersonnel(index)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                  <v-btn class="add-btn" @click="addKeyPersonnel">+ Add Key Personnel</v-btn>
                </v-card-text>
              </v-card>

              <!-- Additional Questions -->
              <v-radio-group
                v-model="formData.hasSubcontracts"
                label="Does this submission involve any subcontracts?"
              >
                <v-radio label="Yes" value="yes"></v-radio>
                <v-radio label="No" value="no"></v-radio>
              </v-radio-group>

              <!-- Conditional Fields if "Yes" is Selected -->
              <template v-if="formData.hasSubcontracts === 'yes'">
                <v-card class="optional-block">
                  <v-card-title class="optional-title">Subcontract Details</v-card-title>
                  <v-card-text>
                    <div
                      v-for="(subcontract, index) in formData.subcontracts"
                      :key="index"
                      class="person-entry"
                    >
                      <v-text-field
                        v-model="subcontract.subcontractInstitution"
                        label="Institution Name"
                        required
                      ></v-text-field>
                      <v-text-field
                        v-model="subcontract.subcontractSitePI"
                        label="Site PI"
                        required
                      ></v-text-field>
                      <v-text-field
                        v-model="subcontract.subcontractContactName"
                        label="Contact Name"
                        required
                      ></v-text-field>
                      <v-text-field
                        v-model="subcontract.subcontractContactEmail"
                        label="Contact Email"
                        required
                      ></v-text-field>
                      <v-btn
                        icon
                        density="comfortable"
                        size="small"
                        @click="removeSubcontract(index)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </div>
                    <v-btn class="add-btn" @click="addSubcontract">+ Add Subcontract</v-btn>
                  </v-card-text>
                </v-card>
              </template>

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
        piDivision: null,
        sponsorDeadlineDate: new Date(),
        sponsorDeadlineTime: '',
        proposalType: '',
        fundingAgency: '',
        isSubaward: '',
        primeInstitution: '',
        primeInstitutionContact: '',
        primeInstitutionContactEmail: '',
        submissionBy: '',
        submissionType: '',
        fundingOpportunity: '',
        temporaryAppId: '',
        activityType: '',
        isClinicalTrial: '',
        consultClinicalTrials: '',
        consultDOMCTU: '',
        projectStartDate: '',
        projectEndDate: '',
        projectTitle: '',
        keyPersonnel: [],
        hasSubcontracts: '',
        subcontracts: [],
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
          piDivision: null,
          sponsorDeadlineDate: new Date(),
          sponsorDeadlineTime: '',
          proposalType: '',
          fundingAgency: '',
          isSubaward: '',
          primeInstitution: '',
          primeInstitutionContact: '',
          primeInstitutionContactEmail: '',
          submissionBy: '',
          submissionType: '',
          fundingOpportunity: '',
          temporaryAppId: '',
          activityType: '',
          isClinicalTrial: '',
          consultClinicalTrials: '',
          consultDOMCTU: '',
          projectStartDate: '',
          projectEndDate: '',
          projectTitle: '',
          keyPersonnel: [],
          hasSubcontracts: '',
          subcontracts: [],
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
    addKeyPersonnel() {
      this.formData.keyPersonnel.push({
        name: '',
        email: '',
        institution: '',
      })
    },
    removeKeyPersonnel(index) {
      this.formData.keyPersonnel.splice(index, 1)
    },
    addSubcontract() {
      this.formData.subcontracts.push({
        subcontractInstitution: '',
        subcontractSitePI: '',
        subcontractContactName: '',
        subcontractContactEmail: '',
      })
    },
    removeSubcontract(index) {
      this.formData.subcontracts.splice(index, 1)
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
.clinical-trial-info {
  border: 2px solid #003da5; /* UIC Blue */
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  background-color: #f1f5fa; /* Light blue background */
}

.info-title {
  font-size: 16px;
  font-weight: bold;
  color: #003da5; /* UIC Blue */
  margin-bottom: 8px;
}

.info-list {
  list-style: none;
  padding-left: 0;
}

.info-list li {
  margin-bottom: 6px;
  font-size: 14px;
  color: #333;
}

.optional-block {
  border: 2px solid #d68400; /* Warm brown-orange border */
  border-radius: 8px;
  padding: 16px;
  margin-top: 12px;
  background-color: #fcf7f2; /* Light beige background */
}

.optional-title {
  font-size: 16px;
  font-weight: bold;
  color: #d68400; /* Matching brown-orange text */
  margin-bottom: 8px;
}

.person-entry {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

/* Add Key Personnel Button */
.add-btn {
  background-color: #d68400 !important; /* New Button Color */
  color: white !important;
}

.add-btn:hover {
  background-color: #b56e00 !important; /* Darker on Hover */
}
</style>
