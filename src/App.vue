<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>{{ 'Grant Management System' }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text>
        {{ user.email }}
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer app permanent>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6 uic-red--text">Menu</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>

        <!-- Dynamic Sidebar Items -->
        <v-list-item v-for="item in allowedSidebarItems" :key="item.to" :to="item.to">
          <v-list-item-icon>
            <v-icon :class="'uic-blue--text'">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="uic-blue--text">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { useUserStore } from './stores/user'

const userStore = useUserStore()
const user = userStore.user
const allowedSidebarItems = userStore.allowedSidebarItems
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
