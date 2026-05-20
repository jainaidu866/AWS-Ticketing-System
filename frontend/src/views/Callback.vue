<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="text-4xl mb-4">⏳</div>
      <p class="text-gray-500">Logging you in, please wait...</p>
      <p v-if="errorMsg" class="text-red-500 mt-4">{{ errorMsg }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const errorMsg = ref('')

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  
  console.log('Callback params:', window.location.search)
  console.log('Code:', code)

  if (!code) {
    errorMsg.value = 'No code found. Redirecting to login...'
    setTimeout(() => router.push('/login'), 2000)
    return
  }

  const domain = import.meta.env.VITE_COGNITO_DOMAIN
  const clientId = import.meta.env.VITE_CLIENT_ID
  const redirect = 'http://localhost:5173/callback'

  try {
    console.log('Exchanging code for token...')
    
    const res = await fetch(`${domain}/oauth2/token`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        code: code,
        redirect_uri: redirect
      }).toString()
    })

    const data = await res.json()
    console.log('Token response:', data)

    if (data.id_token) {
      localStorage.setItem('id_token', data.id_token)
      localStorage.setItem('access_token', data.access_token)
      console.log('Login successful! Redirecting...')
      router.push('/tickets')
    } else {
      errorMsg.value = 'Login failed: ' + JSON.stringify(data)
      console.error('Token error:', data)
    }
  } catch (err) {
    errorMsg.value = 'Error: ' + err.message
    console.error('Fetch error:', err)
  }
})
</script>