<template>
  <div>
    <h4>{{ title }}</h4>
    <v-row v-for="(entry, index) in emails" :key="index" class="mb-2 pa-3">
      <v-text-field
        v-model="entry.email"
        label="Email"
        dense
        :error="showError(index)"
        :error-messages="showError(index) ? getErrorMessage(entry.email) : ''"
        @blur="markTouched(index)"
      ></v-text-field>
      <v-btn icon @click="removeEmail(index)"><v-icon>mdi-close</v-icon></v-btn>
      <v-switch
        v-model="entry.enabled"
        label="Enabled"
        :color="entry.enabled ? 'success' : 'grey'"
      ></v-switch>
    </v-row>
    <v-btn color="primary" @click="addEmail">+ Add Email</v-btn>
  </div>
</template>

<script>
export default {
  props: {
    emails: {
      type: Array,
      default: () => [], // Ensures emails is always an array
    },
    title: String,
  },
  data() {
    return {
      touchedFields: [], // Track if a field has been touched
    }
  },
  methods: {
    addEmail() {
      if (!this.emails) {
        this.emails = [] // Ensure emails is initialized
      }
      this.emails.push({ email: '', enabled: true })
      this.touchedFields.push(false) // Add tracking for the new field
      this.$emit('update', this.emails)
    },
    removeEmail(index) {
      this.emails.splice(index, 1)
      this.touchedFields.splice(index, 1) // Remove tracking for the field
      this.$emit('update', this.emails)
    },
    validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    },
    markTouched(index) {
      this.touchedFields[index] = true // Mark field as touched when user exits
    },
    showError(index) {
      return this.touchedFields[index] && !this.validateEmail(this.emails[index].email)
    },
    getErrorMessage(email) {
      if (!email) return 'Email cannot be empty'
      if (!this.validateEmail(email)) return 'Invalid email format'
      return ''
    },
  },
}
</script>
