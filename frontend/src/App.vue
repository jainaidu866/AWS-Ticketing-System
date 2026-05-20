<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar v-if="auth.user" />
    <router-view />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import { auth } from './stores/auth.js'
auth.init()
</script>