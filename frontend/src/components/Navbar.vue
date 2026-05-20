<template>
  <nav class="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
    <div class="flex gap-6 items-center">
      <span class="font-bold text-lg">🎫 TicketSystem</span>
      <router-link to="/tickets" class="hover:underline text-sm">All Tickets</router-link>
      <router-link to="/tickets/new" class="hover:underline text-sm">+ New Ticket</router-link>
    </div>
    <div class="flex gap-4 items-center">
      <span class="text-sm opacity-80">{{ auth.user?.email }}</span>
      <span class="bg-blue-800 text-xs px-2 py-1 rounded">
        {{ auth.isAgent() ? '🛠 Agent' : '👤 Customer' }}
      </span>
      <button @click="auth.logout()"
        class="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100">
        Logout
      </button>
    </div>
  </nav>
</template>

<script setup>
import { auth } from '../stores/auth.js'
</script>