<template>
  <v-app v-if="!(showLoginPage && isLoggedIn)">
    <!-- AppBar -->
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>{{ 'Grant Management System' }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-slot:append>
        <!-- Notification Button -->
        <v-btn icon @click="toggleNotifications">
          <v-icon class="notification-appbar-icon">mdi-bell</v-icon>
        </v-btn>
      </template>
    </v-app-bar>

    <!-- Main Navigation Drawer -->
    <v-navigation-drawer :key="sidebarKey" app permanent>
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

      <!-- Role Switch Dropdown (Visible Only in Dev Mode) -->
      <v-container v-if="showRoleSwitcher" class="role-switch-container">
        <v-select
          v-model="selectedRole"
          :items="roles"
          label="Switch Role (Dev only)"
          dense
          outlined
          class="role-switch"
          @update:modelValue="updateUserRole"
        ></v-select>
      </v-container>
    </v-navigation-drawer>

    <!-- Notification Sidebar -->
    <v-navigation-drawer v-model="notificationDrawer" app location="right" temporary width="400">
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6 uic-red--text">Notifications</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>

        <!-- Dynamic Notifications -->
        <v-list-item
          v-for="notification in notificationStore.getNotifications('all')"
          :key="notification.id"
          class="notification-card"
          :class="{ unread: notification.state === 'unread' }"
          :to="notification.link"
          router
          @click="markAsRead(notification.id)"
        >
          <v-list-item-content>
            <div class="notification-header">
              <v-list-item-title class="notification-title">
                {{ notification.title }}
              </v-list-item-title>
              <v-btn
                icon
                small
                variant="text"
                class="close-btn"
                @click.stop="clearNotification(notification.id)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
            <v-list-item-subtitle class="notification-message">
              {{ notification.message }}
            </v-list-item-subtitle>
            <span class="timestamp">{{ timeAgo(notification.createdAt) }}</span>

            <!-- Unread Marker -->
            <span v-if="notification.state === 'unread'" class="unread-marker"></span>
          </v-list-item-content>
        </v-list-item>

        <!-- Empty State -->
        <v-list-item v-if="notificationStore.notifications.length === 0">
          <v-list-item-content>
            <v-list-item-title>No notifications</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
  <!-- Show HomeView if user is NOT logged in and `showLoginPage` is true -->
  <HomeView v-else @login="handleLogin" />
</template>

<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from './stores/user'
import { useNotificationStore } from '@/stores/notifications'

import HomeView from '@/views/HomeView.vue'

// Toggle switch to enforce login functionality
const showLoginPage = ref(true) // Change this to `false` to always show the default pages

const handleLogin = () => {
  // Simulate login by setting a default user
  userStore.setUser('pi@example.com', 'PI')
  showLoginPage.value = false
}

// Check if user is logged in
const isLoggedIn = computed(() => !!userStore.user.email)

// User Store
const userStore = useUserStore()
const user = userStore.user
const allowedSidebarItems = computed(() => userStore.allowedSidebarItems)

// Role Switching Logic
const roles = ['Grant Admin', 'Grant Manager', 'PI', 'Proxy PI', 'Team Member']
const selectedRole = ref(userStore.user.role)
const sidebarKey = ref(0) // Key to force sidebar re-render

// Function to update user role and refresh state
const updateUserRole = (newRole) => {
  userStore.setUser(userStore.user.email, newRole) // Update Pinia store
}

// Toggle state for the role switcher (Enable for dev)
const showRoleSwitcher = ref(true)

// Notifications
const notificationDrawer = ref(false)
const notifications = ref([
  { title: 'Proposal Accepted', subtitle: 'Your grant proposal has been approved.' },
  { title: 'Deadline Reminder', subtitle: 'Submit the report by 2025-02-01.' },
  { title: 'New Grant Opportunity', subtitle: 'Check out the new RFA on the dashboard.' },
])

// Toggle Notification Drawer
const toggleNotifications = () => {
  notificationDrawer.value = !notificationDrawer.value
}

const notificationStore = useNotificationStore()

const markAsRead = (id) => {
  notificationStore.markAsRead(id)
}

const clearNotification = (id) => {
  notificationStore.deleteNotification(id)
}

const timeAgo = (date) => {
  const diff = Math.floor((new Date() - new Date(date)) / 1000)
  if (diff < 60) return `${diff} seconds ago`
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  return `${Math.floor(diff / 86400)} days ago`
}
</script>

<script setup></script>

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

.notification-appbar-icon {
  color: #003da5 !important; /* UIC Blue */
  transform: scale(1.2);
}
</style>

<style scoped>
/* Notification Card Styles */
.notification-card {
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 10px;
  position: relative;
  background-color: #f9f9f9; /* Default background color */
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s,
    background-color 0.2s;
}

.notification-card.unread {
  background-color: #e8f4ff; /* Light blue for unread notifications */
}

.notification-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-title {
  font-size: 1rem;
  font-weight: bold;
  color: #003da5; /* UIC Blue */
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  color: #d50032; /* UIC Red */
  padding: 4px;
  cursor: pointer;
}

.notification-message {
  margin-top: 10px;
  color: #666;
  font-size: 0.9rem;
}

.timestamp {
  display: block;
  margin-top: 5px;
  font-size: 0.8rem;
  color: #999;
}

/* Unread Marker */
.unread-marker {
  position: absolute;
  top: 6px;
  left: 6px;
  width: 8px;
  height: 8px;
  background-color: #d50032; /* UIC Red */
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}

.role-switch-container {
  padding: 16px;
  display: flex;
  justify-content: center;
}

.role-switch {
  max-width: 220px;
  background: #f5f5f5;
  border-radius: 50px;
  padding: 2px 12px;
}
</style>

<style>
.label-status {
  text-transform: capitalize !important;
}
</style>
