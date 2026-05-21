import { reactive } from 'vue'

export const auth = reactive({
  user: null,
  token: null,
  groups: [],

  init() {
    const token = localStorage.getItem('id_token')
    if (token) {
      this.token = token
      const payload = JSON.parse(atob(token.split('.')[1]))
      this.user = { email: payload.email, sub: payload.sub }
      const groups = payload['cognito:groups'] || []
      this.groups = Array.isArray(groups) ? groups : [groups]
    }
  },

  isAgent() {
    return this.groups.includes('Agent')
  },

  logout() {
    localStorage.clear()
    this.user = null
    this.token = null
    this.groups = []
    const domain = import.meta.env.VITE_COGNITO_DOMAIN
    const clientId = import.meta.env.VITE_CLIENT_ID
    const logoutUri = encodeURIComponent(import.meta.env.VITE_REDIRECT_URI.replace('/callback', '/login'))
    window.location.href = `${domain}/logout?client_id=${clientId}&logout_uri=${logoutUri}`
  }
})