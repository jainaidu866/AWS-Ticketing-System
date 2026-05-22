<template>
  <div class="max-w-4xl mx-auto p-6">

    <router-link to="/tickets" class="text-blue-600 hover:underline text-sm">
      ← Back to Tickets
    </router-link>

    <div v-if="ticket">

      <!-- Ticket Info Card -->
      <div class="bg-white rounded-lg shadow p-6 mt-4">
        <div class="flex justify-between items-start mb-4">
          <h1 class="text-2xl font-bold text-gray-800">{{ ticket.title }}</h1>
          <div class="flex gap-2">
            <span :class="statusColor(ticket.status)"
              class="px-3 py-1 rounded-full text-sm font-medium">
              {{ ticket.status }}
            </span>
            <span :class="priorityColor(ticket.priority)"
              class="px-3 py-1 rounded-full text-sm font-medium">
              {{ ticket.priority }}
            </span>
          </div>
        </div>

        <p class="text-gray-600 mb-6 leading-relaxed">{{ ticket.description }}</p>

        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="text-gray-500">Category:
            <span class="text-gray-800 font-medium ml-1">{{ ticket.category }}</span>
          </div>
          <div class="text-gray-500">Created by:
            <span class="text-gray-800 font-medium ml-1">{{ ticket.createdByEmail }}</span>
          </div>
          <div class="text-gray-500">Created:
            <span class="text-gray-800 font-medium ml-1">{{ formatDate(ticket.createdAt) }}</span>
          </div>
          <div class="text-gray-500">Assignee:
            <span class="text-gray-800 font-medium ml-1">{{ ticket.assignee || 'Unassigned' }}</span>
          </div>
        </div>

        <div v-if="ticket.attachmentUrl" class="mt-4 pt-4 border-t">
          <a :href="ticket.attachmentUrl" target="_blank"
            class="text-blue-600 hover:underline text-sm">
            📎 View Attachment
          </a>
        </div>
      </div>

      <!-- Agent Update Panel -->
      <div v-if="auth.isAgent()" class="bg-white rounded-lg shadow p-6 mt-4">
        <h2 class="font-bold text-gray-800 mb-4">Update Ticket</h2>
        <div class="flex gap-4">
          <select v-model="updateForm.status"
            class="border rounded-lg px-3 py-2 bg-white">
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
            <option>Closed</option>
          </select>

          <select v-model="updateForm.assignee"
            class="border rounded-lg px-3 py-2 bg-white flex-1">
            <option value="">-- Select Agent --</option>
            <option v-for="agent in agents" :key="agent.email" :value="agent.email">
              {{ agent.email }}
            </option>
          </select>

          <button @click="updateTicket"
            class="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 font-medium">
            Save
          </button>
        </div>
        <p v-if="updateMsg" class="text-green-600 text-sm mt-2">{{ updateMsg }}</p>
      </div>

      <!-- Comments Section -->
      <div class="bg-white rounded-lg shadow p-6 mt-4">
        <h2 class="font-bold text-gray-800 mb-4">
          Comments ({{ comments.length }})
        </h2>

        <div class="space-y-4 mb-6">
          <div v-for="c in comments" :key="c.commentId"
            class="border-l-4 border-blue-200 pl-4 py-1">
            <div class="flex justify-between text-sm mb-1">
              <span class="font-medium text-gray-700">{{ c.createdByEmail }}</span>
              <span class="text-gray-400">{{ formatDate(c.createdAt) }}</span>
            </div>
            <p class="text-gray-700">{{ c.text }}</p>
          </div>
          <p v-if="comments.length === 0" class="text-gray-400 text-sm">
            No comments yet. Be the first to comment!
          </p>
        </div>

        <div class="flex gap-3">
          <input v-model="newComment"
            placeholder="Write a comment..."
            class="border rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keyup.enter="addComment" />
          <button @click="addComment"
            class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-medium">
            Post
          </button>
        </div>
      </div>

    </div>

    <div v-else class="text-center py-16 text-gray-400">
      Loading ticket...
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api/index.js'
import { auth } from '../stores/auth.js'

const route = useRoute()
const ticket = ref(null)
const comments = ref([])
const newComment = ref('')
const updateMsg = ref('')
const agents = ref([])
const updateForm = ref({ status: 'Open', assignee: '' })

const loadTicket = async () => {
  try {
    const res = await api.get(`/tickets/${route.params.id}`)
    ticket.value = res.data
    updateForm.value.status = res.data.status
    updateForm.value.assignee = res.data.assignee || ''
  } catch (err) {
    console.error(err)
  }
}

const loadComments = async () => {
  try {
    const res = await api.get(`/tickets/${route.params.id}/comments`)
    comments.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const loadAgents = async () => {
  try {
    const res = await api.get('/agents')
    agents.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const addComment = async () => {
  if (!newComment.value.trim()) return
  try {
    await api.post(`/tickets/${route.params.id}/comments`, { text: newComment.value })
    newComment.value = ''
    await loadComments()
  } catch (err) {
    console.error(err)
  }
}

const updateTicket = async () => {
  try {
    await api.put(`/tickets/${route.params.id}`, updateForm.value)
    updateMsg.value = '✅ Ticket updated successfully!'
    await loadTicket()
    setTimeout(() => updateMsg.value = '', 3000)
  } catch (err) {
    console.error(err)
  }
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

onMounted(() => {
  loadTicket()
  loadComments()
  if (auth.isAgent()) loadAgents()
})
</script>