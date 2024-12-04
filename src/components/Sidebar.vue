<template>
  <v-navigation-drawer app permanent>
    <v-list>
      <!-- Sidebar Title -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">Menu</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <!-- Dashboard Navigation -->
      <v-list-item to="/dashboard" class="sidebar-item">
        <v-list-item-icon>
          <v-icon>mdi-view-dashboard</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- New Grant Proposal Navigation -->
      <v-list-item to="/new-grant-proposal" class="sidebar-item">
        <v-list-item-icon>
          <v-icon>mdi-file-document-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Create New</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- New Grant Proposal Navigation -->
      <v-list-item to="/tasklist" class="sidebar-item">
        <v-list-item-icon>
          <v-icon>mdi-file</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Tasklist</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- Placeholder for Other Items -->
      <v-list-item class="sidebar-item">
        <v-list-item-content>
          <v-list-item-title>Other Items</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-spacer></v-spacer>

      <!-- Logout -->
      <v-list-item class="sidebar-item">
        <v-list-item-content>
          <v-list-item-title class="blue--text text--accent-4">Logout</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'Sidebar',
}
</script>

<style scoped>
/* Sidebar Background */
.v-navigation-drawer {
  background-color: #f5f5f5; /* Light grey for sidebar */
}

/* List Item Hover Effect */
.sidebar-item {
  transition: all 0.2s ease-in-out;
}

.sidebar-item:hover {
  background-color: #e3f2fd; /* Very light blue for hover effect */
}

/* Icon Alignment */
.v-list-item-icon {
  margin-right: 16px; /* Add space between icon and text */
  color: black; /* Default color for icons */
}

/* Title Styling */
.v-list-item-title {
  font-weight: 500; /* Semi-bold for better readability */
  color: #1976d2; /* Blue accent for text */
}

/* Custom Hover Effect for Title */
.sidebar-item:hover .v-list-item-title {
  color: #1565c0; /* Darker blue on hover */
}
</style>
