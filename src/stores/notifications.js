import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notificationStore', {
  state: () => ({
    notifications: [
      // Example Notification
      {
        id: 1,
        title: 'Proposal Accepted',
        message: 'Your grant proposal has been approved.',
        link: '/grants/123',
        state: 'unread', // 'read' or 'unread'
        createdAt: new Date().toISOString(),
      },
    ],
  }),
  actions: {
    // Create a new notification
    createNotification(notification) {
      const newNotification = {
        id: Date.now(),
        title: notification.title,
        message: notification.message,
        link: notification.link || '#',
        state: 'unread',
        createdAt: new Date().toISOString(),
      }
      this.notifications.unshift(newNotification)
    },

    // Mark a notification as read
    markAsRead(notificationId) {
      const notification = this.notifications.find((n) => n.id === notificationId)
      if (notification) {
        notification.state = 'read'
      }
    },

    // Delete (clear) a notification
    deleteNotification(notificationId) {
      this.notifications = this.notifications.filter((n) => n.id !== notificationId)
    },

    // Fetch notifications (filtered)
    getNotifications(filter = 'all') {
      if (filter === 'unread') {
        return this.notifications.filter((n) => n.state === 'unread')
      }
      return this.notifications
    },
  },
})
