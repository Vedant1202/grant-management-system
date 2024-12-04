<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>{{ 'Grant Management System' }}</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer app permanent>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6 uic-red--text">Menu</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>

        <!-- Dashboard Navigation -->
        <v-list-item :to="isAdmin ? '/admin-dashboard' : '/dashboard'">
          <v-list-item-icon>
            <v-icon class="uic-blue--text">mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="uic-blue--text">Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- Dynamic Navigation -->
        <v-list-item :to="isAdmin ? '/new-grant-proposal-requests' : '/new-grant-proposal'">
          <v-list-item-icon>
            <v-icon :class="isAdmin ? 'uic-blue--text' : 'uic-blue--text'">
              {{ isAdmin ? 'mdi-file-check' : 'mdi-file-document-outline' }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="uic-blue--text">
              {{ isAdmin ? 'New Grant Proposal Requests' : 'Create New' }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-spacer></v-spacer>

        <!-- Toggle Admin View -->
        <v-list-item>
          <v-switch v-model="isAdmin" label="Admin View" color="primary"></v-switch>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      isAdmin: false, // Toggle for admin view
    }
  },
  watch: {
    isAdmin(newValue) {
      // Redirect to the appropriate dashboard
      if (newValue) {
        this.$router.push('/admin-dashboard')
      } else {
        this.$router.push('/dashboard')
      }
    },
  },
}
</script>

<style scoped>
/* UIC Colors */
.uic-red--text {
  color: #d50032; /* UIC Red */
}

.uic-blue--text {
  color: #003da5; /* UIC Blue */
}

.v-navigation-drawer {
  background-color: #f1f5f9; /* UIC light blue-gray */
}

.v-app-bar {
  background-color: white !important; /* White background */
  color: #003da5; /* UIC Blue for text */
  font-weight: bold; /* Bolden the text */
}

.v-toolbar-title {
  color: #003da5 !important; /* UIC Blue for the title */
  font-weight: 900; /* Bold title */
}

.v-list-item-title {
  font-weight: bold;
}

.v-list-item-icon > .v-icon {
  color: #003da5 !important; /* UIC Blue */
}

.v-divider {
  border-color: #d50032 !important; /* UIC Red */
}

a {
  color: #003da5; /* UIC Blue */
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease-in-out;
}

a:hover {
  color: #002c74; /* Darker UIC Blue */
}
</style>
