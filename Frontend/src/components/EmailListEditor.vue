<template>
  <div>
    <h4>{{ title }}</h4>
    <v-row v-for="(email, index) in emails" :key="index" class="mb-2">
      <v-text-field v-model="emails[index]" label="Email" dense></v-text-field>
      <v-btn icon @click="removeEmail(index)"><v-icon>mdi-close</v-icon></v-btn>
      <v-switch v-model="enabled[index]" label="Enabled"></v-switch>
    </v-row>
    <v-btn color="primary" @click="addEmail">+ Add Email</v-btn>
  </div>
</template>

<script>
export default {
  props: ['emails', 'title'],
  data() {
    return { enabled: [] }
  },
  methods: {
    addEmail() {
      let updatedEmails = this.emails ? [...this.emails] : [] // Ensure array
      updatedEmails.push('')
      this.$emit('update', updatedEmails)
    },

    removeEmail(index) {
      this.emails.splice(index, 1)
      this.enabled.splice(index, 1)
      this.$emit('update', this.emails)
    },
  },
}
</script>
