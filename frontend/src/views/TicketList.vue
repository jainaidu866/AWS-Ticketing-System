<template>
  <div class="max-w-6xl mx-auto p-6">

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">
        {{ auth.isAgent() ? 'All Tickets' : 'My Tickets' }}
      </h1>
      <router-link to="/tickets/new"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
        + New Ticket
      </router-link>
    </div>

    <!-- Filters -->
    <div class="flex gap-4 mb-6">
      <select v-model="filterStatus" @change="loadTickets"
        class="border rounded-lg px-3 py-2 bg-white text-gray-700">
        <option value="">All Status</option>
        <option>Open</option>
        <option>In Progress</option>
        <option>Resolved</option>
        <option>Closed</option>
      </select>
      <select v-model="filterPriority" @change="loadTickets"
        class="border rounded-lg px-3 py-2 bg-white text-gray-700">
        <option value="">All Priority</option>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12 text-gray-400">Loading tickets...</div>

    <!-- Table -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="text-left p-4 text-gray-600 font-medium">Title</th>
            <th class="text-left p-4 text-gray-600 font-medium">Status</th>
            <th class="text-left p-4 text-gray-600 font-medium">Priority</th>
            <th class="text-left p-4 text-gray-600 font-medium">Category</th>
            <th class="text-left p-4 text-gray-600 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in tickets" :key="ticket.ticketId"
            @click="$router.push(`/tickets/${ticket.ticketId}`)"
            class="border-t hover:bg-blue-50 cursor-pointer transition-colors">
            <td class="p-4 font-medium text-blue-600">{{ ticket.title }}</td>
            <td class="p-4">
              <span :class="statusColor(ticket.status)"
                class="px-2 py-1 rounded-full text-xs font-medium">
                {{ ticket.status }}
              </span>
            </td>
            <td class="p-4">
              <span :class="priorityColor(ticket.priority)"
                class="px-2 py-1 rounded-full text-xs font-medium">
                {{ ticket.priority }}
              </span>
            </td>
            <td class="p-4 text-gray-600">{{ ticket.category }}</td>
            <td class="p-4 text-gray-500 text-sm">{{ formatDate(ticket.createdAt) }}</td>
          </tr>
          <tr v-if="tickets.length === 0">
            <td colspan="5" class="p-12 text-center text-gray-400">
              No tickets found. Create your first ticket!
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/index.js'
import { auth } from '../stores/auth.js'

const tickets = ref([])
const loading = ref(true)
const filterStatus = ref('')
const filterPriority = ref('')

const loadTickets = async () => {
  loading.value = true
  try {
    const params = {}
    if (filterStatus.value) params.status = filterStatus.value
    if (filterPriority.value) params.priority = filterPriority.value
    const res = await api.get('/tickets', { params })
    tickets.value = res.data
  } catch (err) {
    console.error(err)
  }
  loading.value = false
}

const statusColor = (s) => ({
  'Open': 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  'Resolved': 'bg-green-100 text-green-700',
  'Closed': 'bg-gray-100 text-gray-700'
}[s] || 'bg-gray-100 text-gray-700')

const priorityColor = (p) => ({
  'High': 'bg-red-100 text-red-700',
  'Medium': 'bg-yellow-100 text-yellow-700',
  'Low': 'bg-green-100 text-green-700'
}[p] || 'bg-gray-100 text-gray-700')

const formatDate = (d) => new Date(d).toLocaleDateString()

onMounted(loadTickets)
</script>