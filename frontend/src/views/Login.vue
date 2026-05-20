<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white p-8 rounded-lg shadow-md text-center w-96">
      <div class="text-5xl mb-4">🎫</div>
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Ticketing System</h1>
      <p class="text-gray-500 mb-8">Sign in to manage your tickets</p>
      <button @click="login"
        class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium">
        Sign In / Sign Up
      </button>
    </div>
  </div>
</template>

<script setup>
const login = () => {
  const domain = import.meta.env.VITE_COGNITO_DOMAIN
  const clientId = import.meta.env.VITE_CLIENT_ID
  const redirect = 'http://localhost:5173/callback'
  // prompt=login forces Cognito to show login form every time
  const url = `${domain}/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirect)}&scope=openid+email+phone&prompt=login`
  window.location.href = url
}
</script>