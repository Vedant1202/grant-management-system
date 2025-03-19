<template>
  <v-container>
    <v-container>
      <v-row align="center" justify="space-between">
        <v-tabs v-model="tab" background-color="#003da5" dark>
          <v-tab value="emailLists">Email Lists</v-tab>
          <v-tab value="eventTriggers">Email Event Triggers</v-tab>
        </v-tabs>
        <v-btn color="primary" @click="saveEmailLists">Save</v-btn>
      </v-row>
    </v-container>

    <v-window v-model="tab">
      <!-- Email Lists Tab -->
      <v-window-item value="emailLists">
        <v-card class="pa-5">
          <v-expansion-panels>
            <!-- Grant Admins -->
            <v-expansion-panel class="category-panel">
              <v-expansion-panel-title class="category-title">Grant Admins</v-expansion-panel-title>
              <v-expansion-panel-text>
                <email-list-editor
                  :emails="grantAdmins"
                  title="Grant Admins"
                  @update="updateGrantAdmins"
                />
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- Grant Managers per Division -->
            <v-expansion-panel class="category-panel">
              <v-expansion-panel-title class="category-title"
                >Grant Managers</v-expansion-panel-title
              >
              <v-expansion-panel-text>
                <v-expansion-panels>
                  <v-expansion-panel
                    v-for="division in divisions"
                    :key="division"
                    class="internal-category"
                  >
                    <v-expansion-panel-title class="internal-title">{{
                      division
                    }}</v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <email-list-editor
                        :emails="grantManagers[division]"
                        :title="division"
                        @update="updateGrantManagers(division, $event)"
                      />
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- PIs per Division with Subcategory for Co-PIs and Team Members -->
            <v-expansion-panel class="category-panel">
              <v-expansion-panel-title class="category-title"
                >Principal Investigators (PIs)</v-expansion-panel-title
              >
              <v-expansion-panel-text>
                <v-expansion-panels>
                  <v-expansion-panel
                    v-for="division in divisions"
                    :key="division + '-PI'"
                    class="internal-category"
                  >
                    <v-expansion-panel-title class="internal-title">{{
                      division
                    }}</v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-expansion-panels>
                        <v-expansion-panel
                          v-for="pi in Object.keys(PIs[division] || {})"
                          :key="pi"
                          class="internal-category"
                        >
                          <v-expansion-panel-title class="internal-title">{{
                            pi
                          }}</v-expansion-panel-title>
                          <v-expansion-panel-text>
                            <email-list-editor
                              :emails="PIs[division][pi] || []"
                              :title="pi"
                              @update="updatePIs(division, pi, $event)"
                            />
                            <v-expansion-panels>
                              <v-expansion-panel class="internal-subcategory">
                                <v-expansion-panel-title class="internal-title"
                                  >Co-PIs & Team Members</v-expansion-panel-title
                                >
                                <v-expansion-panel-text>
                                  <email-list-editor
                                    :emails="teamMembers[division]?.[pi] || []"
                                    :title="pi + ' - Co-PIs & Team Members'"
                                    @update="updateTeamMembers(division, pi, $event)"
                                  />
                                </v-expansion-panel-text>
                              </v-expansion-panel>
                            </v-expansion-panels>
                          </v-expansion-panel-text>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-window-item>

      <!-- Email Event Triggers Tab (To Be Implemented) -->
      <v-window-item value="eventTriggers">
        <v-card class="pa-5">
          <h3 class="text-h5">Email Event Triggers - Coming Soon</h3>
        </v-card>
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script>
import EmailListEditor from '@/components/EmailListEditor.vue'
import { API_BASE_URL } from '@/config/config'

export default {
  components: { EmailListEditor },
  data() {
    return {
      tab: 'emailLists',
      grantAdmins: [],
      grantManagers: {}, // Ensure this gets initialized
      PIs: {},
      teamMembers: {},
      divisions: [
        'Academic Internal Medicine and Geriatrics (AIM)',
        'Cardiology',
        'Endocrinology, Diabetes and Metabolism',
        'Gastroenterology and Hepatology',
        'Hematology and Oncology',
        'Infectious Diseases',
        'Nephrology',
        'Pulmonary, Critical Care, Sleep and Allergy',
        'Rheumatology',
        'Correctional Medicine',
        'Medicaid Advisory Unit',
      ],
    }
  },
  async created() {
    await this.fetchEmailLists()
    // this.divisions.forEach((division) => {
    //   if (!this.grantManagers[division]) this.grantManagers[division] = []
    //   if (!this.PIs[division]) this.PIs[division] = {}
    //   if (!this.teamMembers[division]) this.teamMembers[division] = {}
    // })
  },

  methods: {
    updateGrantAdmins(updatedEmails) {
      this.grantAdmins = updatedEmails
    },
    updateGrantManagers(division, updatedEmails) {
      if (!this.grantManagers[division]) {
        this.grantManagers[division] = [] // Ensure it's an array
      }
      this.grantManagers[division] = updatedEmails
    },

    updatePIs(division, pi, updatedEmails) {
      if (!this.PIs[division]) {
        this.PIs[division] = {} // Ensure division exists
      }
      this.PIs = { ...this.PIs, [division]: { ...this.PIs[division], [pi]: updatedEmails } }
    },

    updateTeamMembers(division, pi, updatedEmails) {
      if (!this.teamMembers[division]) {
        this.teamMembers[division] = {}
      }
      if (!this.teamMembers[division][pi]) {
        this.teamMembers[division][pi] = []
      }
      this.teamMembers[division][pi] = updatedEmails
    },
    async fetchEmailLists() {
      try {
        const response = await fetch(`${API_BASE_URL}/email-lists`)
        if (!response.ok) throw new Error('Failed to fetch email lists')

        const data = await response.json()
        console.log('Fetched Email Lists:', data) // Debugging step

        // Ensure each section is initialized properly
        this.grantAdmins =
          data.grantAdmins?.map((email) =>
            typeof email === 'string' ? { email, enabled: true } : email,
          ) || []

        this.grantManagers = this.processEmailGroups(data.grantManagers)
        this.PIs = this.processNestedEmailGroups(data.PIs, true) // Ensure PIs structure
        this.teamMembers = this.processNestedEmailGroups(data.teamMembers, true) // Ensure Team Members structure
        console.log('Processed PIs:', this.PIs)
        console.log('Processed Team Members:', this.teamMembers)
      } catch (error) {
        console.error('Error fetching email lists:', error)
      }
    },
    processEmailGroups(groups) {
      const result = {}
      this.divisions.forEach((division) => {
        result[division] =
          groups?.[division]?.map((email) =>
            typeof email === 'string' ? { email, enabled: true } : email,
          ) || [] // Ensure an empty array if no emails
      })
      return result
    },
    processNestedEmailGroups(groups, ensureEmptyStructure = false) {
      const result = {}

      this.divisions.forEach((division) => {
        result[division] = {}

        if (groups?.[division]) {
          // Ensure that emails are NOT being treated as a PI name
          if (groups[division].emails) {
            result[division]['New PI'] = groups[division].emails // Default placeholder for empty
          } else {
            Object.keys(groups[division]).forEach((piName) => {
              result[division][piName] = groups[division][piName] || []
            })
          }
        }

        // Ensure at least one placeholder PI exists if needed
        if (ensureEmptyStructure && Object.keys(result[division]).length === 0) {
          result[division]['New PI'] = []
        }
      })

      return result
    },

    async saveEmailLists() {
      try {
        const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

        const extractEmails = (emails) => {
          if (Array.isArray(emails)) return emails // If already an array, return as-is
          if (emails && emails.emails) return emails.emails // Extract from nested object
          return [] // Return empty array if undefined or invalid
        }

        const formatEmails = (emails) =>
          extractEmails(emails)
            .filter((emailObj) => emailObj.email && isValidEmail(emailObj.email)) // Remove empty/invalid emails
            .map((emailObj) => ({ email: emailObj.email.trim(), enabled: emailObj.enabled }))

        const findInvalidEmails = (emails) =>
          extractEmails(emails).filter(
            (emailObj) => !emailObj.email || !isValidEmail(emailObj.email),
          )

        const formatEmailGroups = (groups) => {
          const result = {}
          for (const key in groups) {
            result[key] = formatEmails(groups[key]) // Ensure it's an array before filtering
          }
          return result
        }

        // 🚀 FIX: Ensure PIs and Team Members are nested properly
        const formatNestedEmailGroups = (groups) => {
          const result = {}
          for (const division in groups) {
            result[division] = {}
            for (const pi in groups[division]) {
              result[division][pi] = { emails: formatEmails(groups[division][pi]) } // Wrap in { emails: [] }
            }
            // Ensure at least one empty object if no PIs exist
            if (Object.keys(result[division]).length === 0) {
              result[division] = { 'New PI': { emails: [] } }
            }
          }
          return result
        }

        const findInvalidEmailGroups = (groups) => {
          let invalidEmails = []
          for (const key in groups) {
            invalidEmails = [...invalidEmails, ...findInvalidEmails(groups[key])]
          }
          return invalidEmails
        }

        // Find invalid emails before saving
        const invalidEmails = [
          ...findInvalidEmails(this.grantAdmins),
          ...findInvalidEmailGroups(this.grantManagers),
          ...findInvalidEmailGroups(this.PIs),
          ...findInvalidEmailGroups(this.teamMembers),
        ]

        if (invalidEmails.length > 0) {
          alert('Cannot save. Some emails are invalid or empty.')
          return // Stop execution if invalid emails exist
        }

        // 🚀 Apply the fix: Ensure PIs and Team Members are formatted correctly
        const emailListsData = {
          grantAdmins: formatEmails(this.grantAdmins),
          grantManagers: formatEmailGroups(this.grantManagers),
          PIs: formatNestedEmailGroups(this.PIs), // ✅ Fix for PIs
          teamMembers: formatNestedEmailGroups(this.teamMembers), // ✅ Fix for Team Members
        }

        console.log('Sending payload:', emailListsData) // 🔍 Debugging step

        const response = await fetch(`${API_BASE_URL}/email-lists`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailListsData),
        })

        if (!response.ok) throw new Error('Failed to save email lists')
        alert('Email lists saved successfully!')
      } catch (error) {
        console.error('Error saving email lists:', error)
      }
    },
  },
}
</script>

<style scoped>
.category-panel {
  border-left: 4px solid #003da5;
  margin-bottom: 16px;
  background-color: white;
}
.category-title {
  font-weight: bold;
  color: #003da5;
}
.internal-category {
  background-color: white;
  margin-left: 16px;
}
.internal-title {
  font-weight: bold;
  color: #003da5;
}
.internal-subcategory {
  background-color: white;
  margin-left: 32px;
}
</style>
