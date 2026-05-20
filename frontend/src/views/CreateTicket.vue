<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Create New Ticket</h1>

    <div class="bg-white rounded-lg shadow p-6 space-y-5">

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input v-model="form.title"
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Brief summary of the issue" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea v-model="form.description" rows="5"
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe the issue in detail"></textarea>
      </div>

      <div class="flex gap-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select v-model="form.priority"
            class="w-full border rounded-lg px-3 py-2 bg-white">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select v-model="form.category"
            class="w-full border rounded-lg px-3 py-2 bg-white">
            <option>General</option>
            <option>Technical</option>
            <option>Billing</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Attachment (optional)</label>
        <input type="file" @change="handleFile"
          class="w-full border rounded-lg px-3 py-2 text-gray-600" />
        <p v-if="uploading" class="text-sm text-blue-500 mt-1">⏳ Uploading file...</p>
        <p v-if="form.attachmentUrl" class="text-sm text-green-500 mt-1">✅ File uploaded</p>
      </div>

      <p v-if="errorMsg" class="text-red-500 text-sm">{{ errorMsg }}</p>

      <div class="flex gap-3 pt-2">
        <button @click="submit" :disabled="loading || uploading"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium">
          {{ loading ? 'Creating...' : 'Create Ticket' }}
        </button>
        <router-link to="/tickets"
          class="px-6 py-2 border rounded-lg hover:bg-gray-50 text-gray-700">
          Cancel
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/index.js'

const router = useRouter()
const loading = ref(false)
const uploading = ref(false)
const errorMsg = ref('')

const form = ref({
  title: '',
  description: '',
  priority: 'Medium',
  category: 'General',
  attachmentUrl: null
})

const handleFile = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  uploading.value = true
  errorMsg.value = ''
  try {
    const res = await api.post('/tickets/presigned-url', {
      fileName: file.name,
      fileType: file.type
    })
    await fetch(res.data.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type }
    })
    form.value.attachmentUrl = res.data.fileUrl
  } catch (err) {
    errorMsg.value = 'File upload failed. Try again.'
  }
  uploading.value = false
}

const submit = async () => {
  errorMsg.value = ''
  if (!form.value.title.trim() || !form.value.description.trim()) {
    errorMsg.value = 'Title and description are required.'
    return
  }
  loading.value = true
  try {
    await api.post('/tickets', form.value)
    router.push('/tickets')
  } catch (err) {
    errorMsg.value = 'Failed to create ticket. Please try again.'
  }
  loading.value = false
}
</script>