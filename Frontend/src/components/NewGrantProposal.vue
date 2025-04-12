<template>
  <v-container>
    <v-row>
      <!-- Main Content Section -->
      <v-col cols="8">
        <!-- Info Section -->
        <v-card class="info-section mb-6">
          <v-btn color="secondary" variant="outlined" class="mr-4" @click="fillWithMockData">
            Fill with Mock Data (Test only)
          </v-btn>
          <v-card-title class="headline primary--text"> Pre-Award Support </v-card-title>
          <v-card-text>
            Please complete this intake form to request Pre-award Proposal Development to ensure a
            timely submission. All intake forms will be routed to the designated Grants & Contracts
            Associate/Grant Manager in your unit.
            <!-- <v-btn color="primary" class="mt-4" @click="scrollToForm">
              Fill Intent to Submit Form
            </v-btn> -->
          </v-card-text>
        </v-card>

        <!-- Intent to Submit Form -->
        <v-card id="intent-form">
          <v-card-title>Department of Medicine Grant Intake Form</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="isFormValid" lazy-validation>
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
              <v-text-field v-model="formData.piEmail" readonly label="PI Email" required></v-text-field>
              <v-select
                v-model="formData.piDivision"
                :items="[
                  { text: 'Cardiology (586003)', value: 'Cardiology (586003)' },
                  { text: 'GI/Hepatology (586004)', value: 'GI/Hepatology (586004)' },
                  { text: 'AIM (586006)', value: 'AIM (586006)' },
                  { text: 'Hem/Onc (586008)', value: 'Hem/Onc (586008)' },
                  { text: 'Infectious Diseases (586009)', value: 'Infectious Diseases (586009)' },
                  { text: 'Pulmonary (586009)', value: 'Pulmonary (586009)' },
                  { text: 'Nephrology (586010)', value: 'Nephrology (586010)' },
                  { text: 'Rheumatology (586012)', value: 'Rheumatology (586012)' },
                  { text: 'Endocrinology (586015)', value: 'Endocrinology (586015)' },
                  {
                    text: 'Institute for Minority Health Research (IMHR) (586020)',
                    value: 'Institute for Minority Health Research (IMHR) (586020)',
                  },
                  {
                    text: 'Center for Dissemination & Implementation Science (CDIS) (586030)',
                    value: 'Center for Dissemination & Implementation Science (CDIS) (586030)',
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

                <!-- Clinical Trial Consultation Question -->
                <v-card class="clinical-trial-info">
                  <v-card-title class="info-title">
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

                <!-- Conditional Follow-up Question for DOM CTU -->
                <v-card class="clinical-trial-info">
                  <v-card-title class="info-title">
                    Would you like to consult with the DOM CTU?
                  </v-card-title>
                  <v-card-text>
                    <v-radio-group v-model="formData.consultDOMCTU">
                      <v-radio label="Yes" value="yes"></v-radio>
                      <v-radio label="No" value="no"></v-radio>
                    </v-radio-group>
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
              <!--  -->
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
              <!--  -->
              <!-- Project Details -->
              <v-menu
                ref="menuStartDate"
                :return-value.sync="formData.projectStartDate"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
                :nudge-right="40"
                attach
              >
                <template #activator="{ props }">
                  <v-text-field
                    v-model="formattedProjectStartDate"
                    label="Project Start Date"
                    v-bind="props"
                    readonly
                    required
                  ></v-text-field>
                </template>
                <v-date-picker
                  :allowed-dates="allowedDates"
                  v-model="formData.projectStartDate"
                  @update:modelValue="updateFormattedProjectStartDate"
                ></v-date-picker>
              </v-menu>

              <v-menu
                ref="menuEndDate"
                v-model="menuEndDate"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ props }">
                  <v-text-field
                    v-model="formattedProjectEndDate"
                    label="Project End Date"
                    v-bind="props"
                    readonly
                    required
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="formData.projectEndDate"
                  @update:modelValue="updateFormattedProjectEndDate"
                ></v-date-picker>
              </v-menu>

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
              <v-card class="clinical-trial-info">
                <v-card-title class="info-title"
                  >What is a Conflict of Interest (COI)?</v-card-title
                >
                <v-card-text>
                  <p>Conflict of Interest:</p>
                  <ul class="info-list">
                    <li>
                      <strong>a.</strong> Exists when the Covered Individual engages in Outside
                      Activities that may directly or indirectly influence the Covered Individual’s
                      professional judgment in exercising any University Responsibilities to the
                      actual or potential detriment of the University.
                    </li>
                    <li>
                      <strong>b.</strong> Exists when a Covered Individual is in a position to
                      directly or indirectly influence University business, research, or other
                      University activities in ways that could lead to personal gain for the Covered
                      Individual, or a Covered Individual’s Immediate Family Member, to the
                      potential detriment of the University; or
                    </li>
                    <li>
                      <strong>c.</strong> Exists when a Covered Individual, or a Covered
                      Individual’s Immediate Family Member, is or seeks to be in a vendor or
                      contracting relationship with the University, whether directly or by having a
                      financial or ownership interest in a vendor or contractor doing business with
                      the University.
                    </li>
                  </ul>
                </v-card-text>
              </v-card>
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
          <v-card-title class="subheading"> Other Useful Links </v-card-title>
          <v-card-text>
            <ul>
              <li>
                <a
                  href="https://research.uic.edu/principal-investigator-eligibility-and-approval-procedures/"
                  class="link"
                  >Principal Investigator Eligibility and Approval Procedures | Office of the Vice
                  Chancellor for Research | University of Illinois Chicago</a
                >
              </li>
              <li>
                <a
                  href="https://research.uic.edu/sponsoredprograms/proposals/how-do-i-build-a-budget/"
                  class="link"
                  >How Do I Build a Budget? | Office of the Vice Chancellor for Research |
                  University of Illinois Chicago</a
                >
              </li>
              <li>
                <a
                  href="https://research.uic.edu/sponsoredprograms/proposals/proposal-resources/"
                  class="link"
                  >Proposal Resources | Office of the Vice Chancellor for Research | University of
                  Illinois Chicago</a
                >
              </li>
              <li>
                <a
                  href="https://research.uic.edu/compliance/clinical-trials/externally-sponsored-clinical-trials/"
                  class="link"
                  >Externally Sponsored Clinical Trials | Office of the Vice Chancellor for Research
                  | University of Illinois Chicago</a
                >
              </li>
              <li>
                <a
                  href="https://research.uic.edu/compliance/human-subjects-irbs/general-information/irb-fees/"
                  class="link"
                  >IRB Fees | Office of the Vice Chancellor for Research | University of Illinois
                  Chicago</a
                >
              </li>
            </ul>
          </v-card-text>
        </v-card>
        <!-- <v-card class="useful-links mt-6">
          <v-card-title class="subheading"> Other Useful Links </v-card-title>

        </v-card> -->
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
import { useUserStore } from '@/stores/user'
import { API_BASE_URL } from '@/config/config'

export default {
  data() {
    return {
      isFormValid: false,
      isDialogOpen: false,
      menu: false,
      menuStartDate: false,
      menuEndDate: false,
      formattedProjectStartDate: '',
      formattedProjectEndDate: '',
      formData: {
        piFirstName: '',
        piLastName: '',
        piEmail: 'vnand@uic.edu',
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
        projectStartDate: new Date(),
        projectEndDate: new Date(),
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
  computed: {
    user() {
      const userStore = useUserStore()
      return userStore.user
    },
  },
  methods: {
    updateFormattedProjectStartDate() {
      if (this.formData.projectStartDate) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        this.formattedProjectStartDate = new Date(
          this.formData.projectStartDate,
        ).toLocaleDateString('en-US', options)
      } else {
        this.formattedProjectStartDate = ''
      }
    },
    updateFormattedProjectEndDate() {
      if (this.formData.projectEndDate) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        this.formattedProjectEndDate = new Date(this.formData.projectEndDate).toLocaleDateString(
          'en-US',
          options,
        )
      } else {
        this.formattedProjectEndDate = ''
      }
    },
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
    fillWithMockData() {
      this.formData = {
        piFirstName: 'Alice',
        piLastName: 'Johnson',
        piEmail: this.user.email,
        piDivision: 'Cardiology',
        sponsorDeadlineDate: new Date(),
        sponsorDeadlineTime: '17:00',
        proposalType: 'Research',
        fundingAgency: 'NIH',
        isSubaward: 'No',
        primeInstitution: '',
        primeInstitutionContact: '',
        primeInstitutionContactEmail: '',
        submissionBy: 'Central Office',
        submissionType: 'New',
        fundingOpportunity: 'R01-Grant.com',
        temporaryAppId: 'TEMP-1234',
        activityType: 'Clinical Trial',
        isClinicalTrial: 'No',
        consultClinicalTrials: 'No',
        consultDOMCTU: 'No',
        projectStartDate: new Date(),
        projectEndDate: new Date(),
        projectTitle: 'Exploring Heart Health',
        keyPersonnel: [{ name: 'Dr. Bob Smith', role: 'Co-PI', email: 'bob.smith@uic.edu' }],
        hasSubcontracts: 'No',
        subcontracts: [],
        additionalRequirements: [],
        hasConflictOfInterest: 'No',
      }
    },
    submitForm() {
      console.log('Form Data:', this.formData)

      if (this.$refs.form.validate()) {
        const store = useGrantProposalsStore()

        fetch(`${API_BASE_URL}/grants`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.formData),
        })
          .then(async (response) => {
            const data = await response.json()

            if (!response.ok) {
              this.closeDialog()
              // Smart error detection
              if (data.error && data.error.includes('validation failed')) {
                throw new Error('Please fill in all required fields before submitting.')
              }
              throw new Error(data.error || 'Something went wrong. Please try again.')
            }

            // ✅ Success block — only reached if response.ok
            console.log('✅ Grant created:', data)
            alert('Intent to submit form was submitted successfully!')

            // Reset form only after success
            this.formData = {
              piFirstName: '',
              piLastName: '',
              piEmail: this.user.email,
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

            this.$router.push('/new-grant-proposal-requests')
          })
          .catch((error) => {
            console.error('❌ Error submitting grant:', error)
            alert(`Submission failed: ${error.message}`)
          })
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
  mounted() {
    this.projectStartDate = new Date()
    this.projectEndDate = new Date()
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

/* Ensure text wraps and prevents ellipsis truncation */
.v-card-title,
.v-card-text,
.v-btn {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: unset !important;
  word-break: break-word;
}

/* Ensure radio button labels and selects wrap properly */
.v-radio-group,
.v-select {
  white-space: normal !important;
  word-break: break-word;
}

/* Ensure help notes and useful links wrap properly */
.useful-links ul li {
  white-space: normal !important;
  word-wrap: break-word;
  overflow: visible !important;
}
</style>
