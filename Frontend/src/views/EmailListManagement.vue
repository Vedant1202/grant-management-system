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
            <!-- Principal Investigators (PIs) Section -->
            <v-expansion-panel class="category-panel">
              <v-expansion-panel-title class="category-title">
                Principal Investigators (PIs)
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-expansion-panels>
                  <!-- Loop through each division -->
                  <v-expansion-panel
                    v-for="division in divisions"
                    :key="division + '-PI'"
                    class="internal-category"
                  >
                    <v-expansion-panel-title class="internal-title">
                      {{ division }}
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <!-- Loop through each PI in the division -->
                      <v-expansion-panels>
                        <v-expansion-panel
                          v-for="(piData, piName) in PIs[division]"
                          :key="piName"
                          class="internal-category"
                        >
                          <v-expansion-panel-title class="internal-title">
                            {{ piData.email?.[0]?.email || 'New PI' }}
                          </v-expansion-panel-title>

                          <v-expansion-panel-text>
                            <!-- Editor for PI Email -->
                            <v-card class="pa-3">
                              <h5 class="mb-3">PI Email</h5>
                              <email-list-editor
                                :emails="piData.email || []"
                                @update="updatePIEmail(division, piName, $event)"
                              />
                            </v-card>
                            <!-- Editor for Co-PIs -->
                            <v-card class="pa-3" style="margin-top: 16px">
                              <h5 class="mb-3">Co-PIs</h5>
                              <email-list-editor
                                :emails="piData['Co-PI'] || []"
                                @update="updateCoPIs(division, piName, $event)"
                              />
                            </v-card>
                            <!-- Editor for Team Members -->
                            <v-card class="pa-3" style="margin-top: 16px">
                              <h5 class="mb-3">Team Members</h5>
                              <email-list-editor
                                :emails="piData['Team-members'] || []"
                                @update="updateTeamMembers(division, piName, $event)"
                              />
                            </v-card>
                          </v-expansion-panel-text>
                        </v-expansion-panel>
                      </v-expansion-panels>
                      <!-- Button to add a new PI for this division -->
                      <v-btn color="primary" @click="addNewPI(division)">+ Add PI</v-btn>
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
      grantManagers: {},
      // PIs: each division is an object of PIs
      // Each PI is structured as: { email: [], "Co-PI": [], "Team-members": [] }
      PIs: {},
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
  },
  methods: {
    // --- Methods for updating PI details ---
    getPIEmail(division, piName, updatedEmails) {
      if (!this.PIs[division]) {
        this.PIs[division] = {}
      }
      if (!this.PIs[division][piName]) {
        this.PIs[division][piName] = { email: [], 'Co-PI': [], 'Team-members': [] }
      }
      return this.PIs[division][piName].email
    },
    updatePIEmail(division, piName, updatedEmails) {
      if (!this.PIs[division]) {
        this.PIs[division] = {}
      }
      if (!this.PIs[division][piName]) {
        this.PIs[division][piName] = { email: [], 'Co-PI': [], 'Team-members': [] }
      }
      this.PIs[division][piName].email = updatedEmails
    },
    updateCoPIs(division, piName, updatedEmails) {
      if (!this.PIs[division]) {
        this.PIs[division] = {}
      }
      if (!this.PIs[division][piName]) {
        this.PIs[division][piName] = { email: [], 'Co-PI': [], 'Team-members': [] }
      }
      this.PIs[division][piName]['Co-PI'] = updatedEmails
    },
    updateTeamMembers(division, piName, updatedEmails) {
      if (!this.PIs[division]) {
        this.PIs[division] = {}
      }
      if (!this.PIs[division][piName]) {
        this.PIs[division][piName] = { email: [], 'Co-PI': [], 'Team-members': [] }
      }
      this.PIs[division][piName]['Team-members'] = updatedEmails
    },

    // Method to add a new PI in a division
    addNewPI(division) {
      // Create a unique default PI name
      let newName = 'New PI'
      let counter = 1
      while (this.PIs[division] && this.PIs[division][newName]) {
        newName = `New PI ${counter++}`
      }
      if (!this.PIs[division]) {
        this.PIs[division] = {}
      }
      this.PIs[division][newName] = { email: [], 'Co-PI': [], 'Team-members': [] }
    },

    // --- Methods for Grant Admins and Grant Managers (unchanged) ---
    updateGrantAdmins(updatedEmails) {
      this.grantAdmins = updatedEmails
    },
    updateGrantManagers(division, updatedEmails) {
      if (!this.grantManagers[division]) {
        this.grantManagers[division] = []
      }
      this.grantManagers[division] = updatedEmails
    },

    // --- Fetching Email Lists ---
    async fetchEmailLists() {
      try {
        const response = await fetch(`${API_BASE_URL}/email-lists`)
        if (!response.ok) throw new Error('Failed to fetch email lists')
        const data = await response.json()
        console.log('Fetched Email Lists:', data)

        // Process grantAdmins and grantManagers as needed...
        this.grantAdmins =
          data.grantAdmins?.map((email) =>
            typeof email === 'string' ? { email, enabled: true } : email,
          ) || []
        this.grantManagers = this.processEmailGroups(data.grantManagers)

        // Process PIs: expect data.PIs to be in the form
        // { division: { PIName: { email: [...], "Co-PI": [...], "Team-members": [...] } } }
        this.PIs = {}
        this.divisions.forEach((division) => {
          if (data.PIs && data.PIs[division]) {
            this.PIs[division] = data.PIs[division]
          } else {
            // Initialize with a default PI if no data exists for this division
            this.PIs[division] = {
              'New PI': { email: [], 'Co-PI': [], 'Team-members': [] },
            }
          }
        })
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
          ) || []
      })
      return result
    },

    // --- Saving Email Lists ---
    async saveEmailLists() {
      try {
        const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

        const extractEmails = (emails) => {
          if (Array.isArray(emails)) return emails
          if (emails && emails.emails) return emails.emails
          return []
        }

        const formatEmails = (emails) =>
          extractEmails(emails)
            .filter((emailObj) => emailObj.email && isValidEmail(emailObj.email))
            .map((emailObj) => ({
              email: emailObj.email.trim(),
              enabled: emailObj.enabled,
            }))

        // Validate emails for each section
        const findInvalidEmails = (emails) =>
          extractEmails(emails).filter(
            (emailObj) => !emailObj.email || !isValidEmail(emailObj.email),
          )
        const findInvalidEmailGroups = (groups) => {
          let invalidEmails = []
          for (const key in groups) {
            invalidEmails = [...invalidEmails, ...findInvalidEmails(groups[key])]
          }
          return invalidEmails
        }
        const invalidEmails = [
          ...findInvalidEmails(this.grantAdmins),
          ...findInvalidEmailGroups(this.grantManagers),
          // Validate each nested list in PIs (PI email, Co-PI, and Team-members)
          ...Object.keys(this.PIs).reduce((acc, division) => {
            const pis = this.PIs[division]
            for (const pi in pis) {
              acc = [
                ...acc,
                ...findInvalidEmails(pis[pi].email),
                ...findInvalidEmails(pis[pi]['Co-PI']),
                ...findInvalidEmails(pis[pi]['Team-members']),
              ]
            }
            return acc
          }, []),
        ]

        if (invalidEmails.length > 0) {
          alert('Cannot save. Some emails are invalid or empty.')
          return
        }

        // Build the payload in the desired structure
        const emailListsData = {
          'Grant admins': formatEmails(this.grantAdmins),
          'Grant Managers': this.processEmailGroups(this.grantManagers),
          PIs: this.PIs, // Already structured as desired
        }

        console.log('Sending payload:', emailListsData)
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
