<template>
  <v-container>
    <v-btn text color="primary" @click="$router.go(-1)">Back</v-btn>

    <!-- Tabs -->
    <v-card>
      <v-tabs v-model="tab">
        <v-tab value="overview">Overview</v-tab>
        <v-tab value="timeline">Timeline</v-tab>
        <v-tab value="tasklist">Tasklist</v-tab>
      </v-tabs>

      <v-card-text>
        <v-tabs-window v-model="tab">
          <!-- Overview Tab -->
          <v-tabs-window-item value="overview">
            <v-card>
              <v-card-text>
                <v-row>
                  <v-col cols="12" v-for="(value, key) in grant" :key="key">
                    <strong>{{ formatFieldName(key) }}:</strong>
                    <span>{{ formatFieldValue(key, value) }}</span>
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
</template>

<script>
import moment from 'moment'
import { useGrantProposalsStore } from '@/stores/grantProposals'
import Tasklist from '@/components/Tasklist.vue' // Import Tasklist component
import Timeline from '@/components/Timeline.vue'

export default {
  components: {
    Tasklist,
    Timeline,
  },
  data() {
    return {
      tab: 'overview', // Default tab is Overview
    }
  },
  computed: {
    grant() {
      const store = useGrantProposalsStore()
      const id = this.$route.params.id
      return store.proposals.find((p) => p.id === id) || {}
    },
  },
  methods: {
    formatFieldName(key) {
      // Convert camelCase keys to readable labels
      return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
    },
    formatFieldValue(key, value) {
      if (value === null || value === '') {
        return 'N/A' // Handle empty or null values
      }
      if (key === 'sponsorDueDate') {
        return moment(value).format('MMMM Do, YYYY')
      }
      return value // Return the value as-is for other fields
    },
  },
}
</script>
