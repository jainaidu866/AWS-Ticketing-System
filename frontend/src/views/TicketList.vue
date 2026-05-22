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

    <!-- Search and Filters -->
    <div class="flex flex-wrap gap-3 mb-6">
      <input
        v-model="searchQuery"
        @input="handleSearch"
        placeholder="🔍 Search by tags or title..."
        class="border rounded-lg px-3 py-2 flex-1 min-w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
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

    <!-- Results info -->
    <div class="text-sm text-gray-500 mb-3" v-if="pagination.totalItems > 0">
      Showing {{ (pagination.currentPage - 1) * pagination.pageSize + 1 }}
      - {{ Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems) }}
      of {{ pagination.totalItems }} tickets
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12 text-gray-400">
      Loading tickets...
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="text-left p-4 text-gray-600 font-medium">Title</th>
            <th class="text-left p-4 text-gray-600 font-medium">Status</th>
            <th class="text-left p-4 text-gray-600 font-medium">Priority</th>
            <th class="text-left p-4 text-gray-600 font-medium">Category</th>
            <th class="text-left p-4 text-gray-600 font-medium">Tags</th>
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
            <td class="p-4">
              <div class="flex flex-wrap gap-1">
                <span v-for="tag in (ticket.tags || []).slice(0, 3)" :key="tag"
                  class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  {{ tag }}
                </span>
              </div>
            </td>
            <td class="p-4 text-gray-500 text-sm">{{ formatDate(ticket.createdAt) }}</td>
          </tr>
          <tr v-if="tickets.length === 0">
            <td colspan="6" class="p-12 text-center text-gray-400">
              No tickets found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="flex justify-center items-center gap-3 mt-6">
      <button @click="changePage(pagination.currentPage - 1)"
        :disabled="pagination.currentPage === 1"
        class="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
        ← Previous
      </button>

      <div class="flex gap-2">
        <button v-for="page in visiblePages" :key="page"
          @click="changePage(page)"
          :class="page === pagination.currentPage
            ? 'bg-blue-600 text-white'
            : 'border hover:bg-gray-50'"
          class="w-10 h-10 rounded-lg text-sm font-medium">
          {{ page }}
        </button>
      </div>

      <button @click="changePage(pagination.currentPage + 1)"
        :disabled="pagination.currentPage === pagination.totalPages"
        class="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
        Next →
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api/index.js'
import { auth } from '../stores/auth.js'

const tickets = ref([])
const loading = ref(true)
const filterStatus = ref('')
const filterPriority = ref('')
const searchQuery = ref('')
const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  pageSize: 50
})

let searchTimeout = null

const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.currentPage = 1
    loadTickets()
  }, 400)
}

const loadTickets = async () => {
  loading.value = true
  try {
    const params = { page: pagination.value.currentPage }
    if (filterStatus.value) params.status = filterStatus.value
    if (filterPriority.value) params.priority = filterPriority.value
    if (searchQuery.value.trim()) params.search = searchQuery.value.trim()
    const res = await api.get('/tickets', { params })
    tickets.value = res.data.tickets || []
    pagination.value = res.data.pagination || pagination.value
  } catch (err) {
    console.error(err)
  }
  loading.value = false
}

const changePage = (page) => {
  if (page < 1 || page > pagination.value.totalPages) return
  pagination.value.currentPage = page
  loadTickets()
}

const visiblePages = computed(() => {
  const total = pagination.value.totalPages
  const current = pagination.value.currentPage
  const pages = []
  let start = Math.max(1, current - 2)
  let end = Math.min(total, start + 4)
  if (end - start < 4) start = Math.max(1, end - 4)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

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