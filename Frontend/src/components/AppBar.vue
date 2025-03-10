<template>
  <v-app-bar app color="white" flat>
    <v-spacer></v-spacer>

    <!-- Navigation Buttons -->
    <v-btn outlined class="mr-2" to="/pi-view">Go to PI View</v-btn>
    <v-btn outlined to="/admin-view">Go to Admin View</v-btn>

    <!-- Profile Badge -->
    <v-avatar size="40" class="ml-4">
      <v-icon>mdi-account-circle</v-icon>
    </v-avatar>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppBar',
}
</script>

<style scoped>
.v-app-bar {
  background-color: #ffffff; /* White background */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for separation */
}

.v-btn {
  color: #1976d2; /* Blue text for buttons */
  border-color: #1976d2; /* Blue border for outlined buttons */
}

.v-avatar {
  background-color: #e3f2fd; /* Light blue background for profile badge */
}
</style>
