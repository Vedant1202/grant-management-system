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
                          v-for="(pis, division) in PIs"
                          :key="division"
                          class="internal-category"
                        >
                          <v-expansion-panel-title class="internal-title"
                            >{{ division }} - PIs</v-expansion-panel-title
                          >
                          <v-expansion-panel-text>
                            <div v-for="(emails, pi) in pis" :key="pi" class="internal-subcategory">
                              <email-list-editor
                                :emails="emails"
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
                                      :emails="teamMembers[division][pi]"
                                      :title="pi + ' - Co-PIs & Team Members'"
                                      @update="updateTeamMembers(division, pi, $event)"
                                    />
                                  </v-expansion-panel-text>
                                </v-expansion-panel>
                              </v-expansion-panels>
                            </div>
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
        this.grantManagers[division] = [] // Vue 3 handles reactivity automatically
      }
      this.grantManagers[division] = updatedEmails
    },

    updatePIs(division, pi, updatedEmails) {
      if (!this.PIs[division]) {
        this.PIs[division] = {}
      }
      if (!this.PIs[division][pi]) {
        this.PIs[division][pi] = []
      }
      this.PIs[division][pi] = updatedEmails
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
        this.emailLists = await response.json()
      } catch (error) {
        console.error('Error fetching email lists:', error)
      }
    },
    async saveEmailLists() {
      try {
        const emailListsData = {
          grantAdmins: this.grantAdmins,
          grantManagers: this.grantManagers,
          PIs: this.PIs,
          teamMembers: this.teamMembers,
        }

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
