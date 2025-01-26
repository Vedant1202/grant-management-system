<template>
  <v-app>
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

    <!-- Notification Sidebar -->
    <v-navigation-drawer
  v-model="notificationDrawer"
  app
  right
  temporary
  width="400"
>
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
    >
      <v-list-item-content>
        <div class="notification-header">
          <v-list-item-title class="notification-title">
            {{ notification.title }}
          </v-list-item-title>
          <v-btn
            icon
            small
            class="close-btn"
            @click="clearNotification(notification.id)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-list-item-subtitle class="notification-message">
          {{ notification.message }}
        </v-list-item-subtitle>
        <v-btn text class="view-btn" :to="notification.link" @click="markAsRead(notification.id)">
          View
        </v-btn>
        <span class="timestamp">{{ timeAgo(notification.createdAt) }}</span>
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
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from './stores/user'
import { useNotificationStore } from '@/stores/notifications'

// User Store
const userStore = useUserStore()
const user = userStore.user
const allowedSidebarItems = userStore.allowedSidebarItems

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

<script setup>

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
  background-color: #fff;
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

.view-btn {
  margin-top: 5px;
  color: #003da5; /* UIC Blue */
  font-weight: 600;
}

.timestamp {
  display: block;
  margin-top: 5px;
  font-size: 0.8rem;
  color: #999;
}
</style>

