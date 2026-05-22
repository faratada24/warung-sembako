import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './css/main.css'
import { initDatabase } from './db/init'

// Initialize database
await initDatabase()

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(err => {
    console.log('Service Worker registration failed:', err)
  })
}

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
