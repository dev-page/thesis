import { ref, onMounted, onUnmounted } from 'vue'
import { auth } from '@/config/firebaseConfig'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

const user = ref(null)
const isLoading = ref(true)
const isLoggingOut = ref(false)

let unsubscribe = null
const router = useRouter()

const initAuth = () => {
  if (unsubscribe) return // Already initialized

  unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser
    isLoading.value = false
  })
}

const logout = async () => {
  isLoggingOut.value = true
  try {
    await signOut(auth)
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    isLoggingOut.value = false
  }
}

export function useAuth() {
  onMounted(() => {
    initAuth()
  })

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  })

  return {
    user,
    isLoading,
    logout
  }
}