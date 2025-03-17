<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const login = () => {
  router.push('/login') // Redirect to UIC NetID authentication
}
</script>

<template>
  <v-container full-height fluid height="100vh" class="fill-height">
    <v-row no-gutters class="fill-height">
      <!-- Left Column -->
      <v-col
        full-height
        cols="12"
        md="6"
        class="left-column d-flex flex-column align-center justify-center"
      >
        <v-img src="/uic-dom.jpg" alt="UIC Logo" :aspect-ratio="1" class="" width="700" />
      </v-col>

      <!-- Right Column -->
      <v-col
        full-height
        cols="12"
        md="6"
        class="right-column d-flex flex-column align-center justify-center"
      >
        <h2 class="title">DOM Grant Proposal Management System</h2>
        <v-btn class="login-btn" large @click="login"> Login with UIC NetID </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* Full-screen layout */
.fill-height {
  height: 100vh !important; /* Ensures full height */
  margin: 0;
  border: 0;
  padding: 0;
}

/* Left Column */
.left-column {
  background-color: #fff; /* Light gray */
  text-align: center;
}

/* Right Column */
.right-column {
  background-color: #003da5; /* UIC Blue */
  color: white;
  text-align: center;
}

/* Title */
.title {
  font-size: 28px;
  font-weight: bold;
  color: #fff; /* UIC Blue */
  text-align: center;
}

/* Login Button */
.login-btn {
  background-color: #d50032 !important; /* UIC Red */
  margin-top: 12px;
  color: white !important;
  height: 40px;
  font-size: 18px;
  font-weight: bold;
  line-height: 36px;
  border-radius: 8px;
  transition: transform 0.2s ease-in-out;
}
</style>
