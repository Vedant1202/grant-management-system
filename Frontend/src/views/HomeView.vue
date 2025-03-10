<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const login = () => {
  router.push('/login'); // Redirect to UIC NetID authentication
};
</script>

<template>
  <v-container fluid class="home-container fill-height">
    <v-row no-gutters class="fill-height">
      <!-- Left Column (Image & Title) -->
      <v-col cols="12" md="6" class="left-column d-flex flex-column align-center justify-center">
        <v-img
          src="/uic-dom.jpg"
          alt="UIC Logo"
          :aspect-ratio="1"
          class="bg-white"
          width="700"
        />
      </v-col>

      <!-- Right Column (Login Section) -->
      <v-col cols="12" md="6" class="right-column d-flex flex-column align-center justify-center">
        <h2 class="title">Grant Management System</h2>
        <v-btn class="login-btn" large @click="login">
          Login with UIC NetID
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* Full-page layout */
.home-container {
  background-color: white;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  padding: 0 !important;
  margin: 0 !important;
}

/* Left Column */
.left-column {
  background-color: #f5f5f5; /* Light gray for contrast */
  text-align: center;
  height: 100%;
}

.logo {
  max-width: 60%;
  margin-bottom: 20px;
}

/* Right Column */
.right-column {
  background-color: #003da5; /* UIC Blue */
  color: white;
  text-align: center;
  height: 100vh;
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

.login-btn:hover {
  transform: scale(1.05);
}
</style>
