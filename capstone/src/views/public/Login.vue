<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/config/firebaseConfig'
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence, browserLocalPersistence, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth'
import { toast } from 'vue3-toastify'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user, isLoading } = useAuth()

const email = ref('')
const password = ref('')
const isRememberMe = ref(false)
const isSubmitting = ref(false)
const passwordVisible = ref(false)

const goBack = () => history.back()

onMounted(() => {
    if (!isLoading.value && user.value) {
        router.replace('/')
    }
})

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const togglePassword = () => {
    passwordVisible.value = !passwordVisible.value
}

const handleLogin = async () => {
    if (!email.value || !password.value) {
        toast.error('Email and password are required.')
        return
    }

    if (!EMAIL_REGEX.test(email.value)) {
        toast.error('Please enter a valid email address.')
        return
    }

    if (password.value.length < 8) {
        toast.error('Password must be at least 8 characters.')
        return
    }

    isSubmitting.value = true

    try {
        await setPersistence(
            auth,
            isRememberMe.value ? browserLocalPersistence : browserSessionPersistence
        )

        await signInWithEmailAndPassword(auth, email.value.trim(), password.value)

        toast.success('Welcome back!')
        router.push('/platform')
    } catch (err) {
        console.error(err)
        toast.error('Invalid email or password.')
    } finally {
        isSubmitting.value = false
    }
}

const handleGoogleLogin = async () => {
    try {
        const provider = new GoogleAuthProvider()
        await signInWithPopup(auth, provider)
        toast.success('Logged in with Google!')
        router.push('/platform')
    } catch (err) {
        console.error(err)
        toast.error('Failed to login with Google.')
    }
}

const handleFacebookLogin = async () => {
    try {
        const provider = new FacebookAuthProvider()
        await signInWithPopup(auth, provider)
        toast.success('Logged in with Facebook!')
        router.push('/platform')
    } catch (err) {
        console.error(err)
        toast.error('Failed to login with Facebook.')
    }
}
</script>

<template>
  <div class="min-h-[100dvh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden no-scrollbar">
    <nav class="fixed top-0 inset-x-0 z-50 glass backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <button @click="goBack" class="flex items-center gap-2 text-white/80 hover:text-white transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="hidden sm:inline text-sm font-montserrat">Home</span>
        </button>

        <span class="text-white font-playfair text-lg tracking-wide">AesthetiCare</span>
        <div class="w-8"></div>
      </div>
    </nav>

    <div class="relative flex min-h-[100dvh] items-center justify-center px-4 pt-24 pb-16">
      <div class="relative w-full max-w-[520px] glass rounded-3xl p-8 sm:p-10 glow">
        

        <div class="text-center mb-10">
          <div class="mx-auto w-20 h-20 gradient-gold rounded-2xl flex items-center justify-center mb-6">
            <svg class="w-10 h-10 text-gold-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 class="text-3xl sm:text-4xl font-playfair text-white font-bold">Welcome Back</h1>
          <p class="text-white/70 mt-2 font-montserrat">Sign in to your account</p>
        </div>

        <form class="space-y-6">
          <div>
            <label class="text-sm text-white/80">Email</label>
            <input v-model="email" type="email" required placeholder="Enter Email Address" class="input" />
          </div>

          <div>
            <label class="text-sm text-white/80">Password</label>
            <div class="relative mt-2">
              <input
                :type="passwordVisible ? 'text' : 'password'"
                v-model="password"
                required
                placeholder="Enter your Password"
                class="input pr-12"
              />
              <button type="button" @click="togglePassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white" tabindex="-1">
                <svg v-if="!passwordVisible" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.956 9.956 0 012.1-3.592M6.18 6.18A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex justify-between items-center text-sm text-white/70">
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="isRememberMe" class="accent-yellow-400" />
              Remember me
            </label>
            <a href="#" class="text-gold-400 hover:underline">Forgot password?</a>
          </div>

          <div class="space-y-3">
            <button @click="handleGoogleLogin" type="button" class="w-full py-3 px-4 rounded-xl bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 transition flex items-center justify-center gap-3">
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button @click="handleFacebookLogin" type="button" class="w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition flex items-center justify-center gap-3">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </button>
          </div>

          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-white/20"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-transparent text-white/70">or</span>
            </div>
          </div>

          <button @click="handleLogin" type="button" class="w-full py-4 rounded-xl gradient-gold text-gold-700 font-semibold text-lg hover:scale-[1.02] active:scale-[0.98] transition">
            Sign In
          </button>

          <div class="text-center">
            <router-link to="/register" class="text-gold-400 hover:text-gold-300 transition font-montserrat">
              Don’t have an account? <span class="underline underline-offset-4">Register Here</span>
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glass {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(18px);
}

.gradient-gold {
  background: linear-gradient(135deg, #f8f4f0, #e7d3a8, #d1b075);
}

.glow {
  box-shadow: 0 20px 40px rgba(234, 179, 8, 0.25);
}

.no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.input {
  width: 100%;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  outline: none;
}
</style>
