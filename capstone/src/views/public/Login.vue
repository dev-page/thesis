<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '@/config/firebaseConfig'
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence, browserLocalPersistence, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, sendPasswordResetEmail } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { toast } from 'vue3-toastify'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user, isLoading } = useAuth()

const email = ref('')
const password = ref('')
const isRememberMe = ref(false)
const isSubmitting = ref(false)
const passwordVisible = ref(false)

onMounted(() => {
    if (!isLoading.value && user.value) {
        router.replace('/')
    }
})

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const togglePassword = () => { passwordVisible.value = !passwordVisible.value }

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

        const userCredentials = await signInWithEmailAndPassword(auth, email.value.trim(), password.value)
        await userCredentials.user.reload()

        if (!userCredentials.user.emailVerified) {
            toast.error('Please verify your email before logging in.')
            return
        }

        const userRef = doc(db, 'users', userCredentials.user.uid)
        await setDoc(userRef, { status: 'active' }, { merge: true })

        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) {
          const role = userSnap.data().role
          if (role === 'owner') {
            toast.success('Login successful! Redirecting to Owner Dashboard')
            router.push('/owner/dashboard')
          } else {
            toast.success('Login successful! Redirecting to Customer Dashboard')
            //router.push('')
          }
        }

        toast.success('Login successful! Redirecting to Dashboard')
        //router.push('')
    } catch (err) {
        console.error(err)
        const friendlyMessages = {
            'auth/user-not-found': 'No account found with this email.',
            'auth/too-many-requests': 'Too many failed login attempts. Please try again later.'
        }
        toast .error(friendlyMessages[err.code] || 'Invalid email or password.')
    } finally {
        isSubmitting.value = false
    }
}

const handleForgotPassword = async () => {
    if (!email.value) {
        toast.error('Please enter your email address to reset your password.')
        return
    }

    if (!EMAIL_REGEX.test(email.value)) {
        toast.error('Please enter a valid email address.')
        return
    }

    try {
        await sendPasswordResetEmail(auth, email.value.trim())
        toast.success('Password reset email sent! Please check your inbox.')
    } catch (err) {
        console.error(err)
        const friendlyMessages = {
            'auth/user-not-found': 'No account found with this email.',
            'auth/too-many-requests': 'Too many requests. Please try again later.'
        }
        toast.error(friendlyMessages[err.code] || 'Failed to send password reset email.')
    }
}

const handleGoogleLogin = async () => {
    try {
        const provider = new GoogleAuthProvider()
        const userCredentials = await signInWithPopup(auth, provider)
        await userCredentials.user.reload()

        const userRef = doc(db, 'users', userCredentials.user.uid)
        const userSnap = await getDoc(userRef)

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            email: userCredentials.user.email,
            role: 'customer',
            status : 'active',
            createdAt: serverTimestamp()
          })
        } else {
          await setDoc(userRef, { status : 'active', }, { merge: true })
        }

        const role = userSnap.data().role
        if (role === 'owner') {
          toast.success('Logged in with Google! Redirecting to Owner Dashboard')
          router.push('/owner/dashboard')
        } else {
          toast.success('Logged in with Google! Redirecting to Customer Dashboard')
          //router.push('')
        }
    } catch (err) {
        console.error(err)
        toast.error('Failed to login with Google.')
    }
}

const handleFacebookLogin = async () => {
    try {
        const provider = new FacebookAuthProvider()
        const userCredentials = await signInWithPopup(auth, provider)
        await userCredentials.user.reload()

        const userRef = doc(db, 'users', userCredentials.user.uid)
        const userSnap = await getDoc(userRef)

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            email: userCredentials.user.email,
            role: 'customer',
            status : 'active',
            createdAt: serverTimestamp()
          })
        } else {
          await setDoc(userRef, { status : 'active', }, { merge: true })
        }

        const role = userSnap.data().role
        if (role === 'owner') {
          toast.success('Logged in with Facebook! Redirecting to Owner Dashboard')
          router.push('/owner/dashboard')
        } else {
          toast.success('Logged in with Facebook! Redirecting to Customer Dashboard')
          //router.push('')
        }
    } catch (err) {
        console.error(err)
        toast.error('Failed to login with Facebook.')
    }
}
</script>

<template>
  <div class="min-h-[100dvh] bg-gradient-to-br from-gold-100 via-cream-200 to-rose-100 overflow-x-hidden no-scrollbar">
    <nav class="fixed top-0 inset-x-0 z-50
            bg-gold-800/90 bg-gradient-to-r from-gold-800 via-gold-700 to-rose-800
            backdrop-blur-md border-b border-gold-600/50 shadow-md">
      <div class="relative max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

      <router-link to="/" class="flex items-center gap-2 text-white hover:text-yellow-100 transition-colors rounded-md px-2 py-1 hover:bg-white/20">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span class="hidden sm:inline text-sm font-montserrat">Home</span>
      </router-link>


        <span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-playfair text-lg sm:text-xl tracking-wide">
          AesthetiCare
        </span>

        <div class="w-8"></div>
      </div>
    </nav>


    <div class="flex items-center justify-center px-4 pt-24 pb-12 text-sm">
      <div
        class="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2
               rounded-2xl overflow-hidden
               bg-white/50 backdrop-blur-xl
               border border-white/40
               shadow-2xl shadow-gold-900/20"
      >
        <div class="relative hidden lg:block">
          <img
            src="@/assets/bg.jpg"
            alt="AesthetiCare"
            class="absolute inset-0 w-full h-full object-cover"
          />

          <div class="absolute inset-0 bg-gradient-to-br from-gold-900/70 via-charcoal-900/60 to-rose-900/60"></div>

          <div class="relative z-10 h-full flex flex-col justify-end p-10">
            <h2 class="text-2xl font-playfair text-gold-300 mb-2">
              Sign In to Your Account
            </h2>
            <p class="text-white/80 max-w-sm">
              Access your profile, bookings, and more — easily and securely.
            </p>
          </div>
        </div>

        <div class="flex items-center justify-center px-4 pt-12 pb-12">
          <form class="space-y-4 w-full max-w-[480px]">
            <div class="relative">
              <input
                v-model="email"
                type="email"
                required
                placeholder=" "
                class="peer input h-16 pt-4 pb-2 px-3"
              />
              <label
                    class="absolute left-3 top-3 text-xs text-charcoal-500
                      transition-all duration-200
                      peer-placeholder-shown:top-1/2
                      peer-placeholder-shown:-translate-y-1/2
                      peer-placeholder-shown:text-sm
                      peer-placeholder-shown:text-charcoal-400
                      peer-focus:top-2
                      peer-focus:translate-y-0
                      peer-focus:text-xs
                      peer-focus:text-gold-700"
              >
                Email Address
              </label>
            </div>

            <div class="relative">
              <input
                :type="passwordVisible ? 'text' : 'password'"
                v-model="password"
                required
                placeholder=" "
                class="peer input h-16 pt-4 pb-2 px-3"
              />
              <label
                    class="absolute left-3 top-3 text-xs text-charcoal-500
                      transition-all duration-200
                      peer-placeholder-shown:top-1/2
                      peer-placeholder-shown:-translate-y-1/2
                      peer-placeholder-shown:text-sm
                      peer-placeholder-shown:text-charcoal-400
                      peer-focus:top-2
                      peer-focus:translate-y-0
                      peer-focus:text-xs
                      peer-focus:text-gold-700"
              >
                Password
              </label>

              <button type="button" @click="togglePassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500 hover:text-gold-700" tabindex="-1">
                <svg v-if="!passwordVisible" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.956 9.956 0 012.1-3.592M6.18 6.18A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
                </svg>
              </button>
            </div>

            <div class="flex justify-between items-center text-xs text-charcoal-600">
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="isRememberMe" class="accent-gold-700" />
                Remember me
              </label>
              <a href="#" class="text-gold-700 hover:underline text-xs">Forgot password?</a>
            </div>

            <div class="space-y-2">
              <button
                @click="handleGoogleLogin"
                type="button"
                class="w-full py-3 px-4 rounded-xl bg-white
                      text-gray-700 font-semibold text-sm
                      hover:bg-gray-50 transition
                      flex items-center justify-center gap-3
                      border border-gray-200"
              >
                <svg class="w-5 h-5" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#4285F4" d="M24 9.5c3.54 0 6.73 1.23 9.23 3.26l6.9-6.9C35.9 2.38 30.28 0 24 0 14.64 0 6.63 5.38 2.69 13.22l8.03 6.24C12.74 13.01 17.93 9.5 24 9.5z"/>
                  <path fill="#34A853" d="M46.5 24.5c0-1.64-.15-3.22-.43-4.75H24v9h12.7c-.55 2.95-2.18 5.45-4.62 7.14l7.07 5.5C43.86 37.19 46.5 31.3 46.5 24.5z"/>
                  <path fill="#FBBC05" d="M10.72 28.46A14.8 14.8 0 0 1 9.95 24c0-1.55.27-3.05.77-4.46l-8.03-6.24A23.98 23.98 0 0 0 0 24c0 3.87.92 7.53 2.56 10.78l8.16-6.32z"/>
                  <path fill="#EA4335" d="M24 48c6.28 0 11.56-2.08 15.42-5.61l-7.07-5.5c-1.96 1.32-4.47 2.1-8.35 2.1-6.06 0-11.25-3.51-13.28-8.58l-8.16 6.32C6.6 42.63 14.62 48 24 48z"/>
                </svg>

                <span>Continue with Google</span>
              </button>

              <button
                @click="handleFacebookLogin"
                type="button"
                class="w-full py-3 px-4 rounded-xl bg-blue-600
                      text-white font-semibold text-sm
                      hover:bg-blue-700 transition
                      flex items-center justify-center gap-3"
              >
                <svg
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12
                      c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047
                      V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235
                      2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25
                      h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
                <span>Continue with Facebook</span>
              </button>
            </div>

            <div class="relative my-4">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-charcoal-200"></div>
              </div>
              <div class="relative flex justify-center text-xs">
                <span class="px-2 bg-transparent text-charcoal-500">or</span>
              </div>
            </div>

            <button
              @click="handleLogin"
              type="button"
              class="w-full py-3 rounded-xl bg-gold-700
                    text-white font-semibold text-base
                    hover:bg-gold-800 hover:scale-[1.02]
                    active:scale-[0.98] transition"
            >
              Sign In
            </button>

            <div class="text-center text-sm">
              <router-link
                to="/register"
                class="text-gold-700 hover:text-gold-800 font-montserrat"
              >
                Don’t have an account?
                <span class="underline underline-offset-4">Register Here</span>
              </router-link>
            </div>
          </form>
        </div>
        </div>
      </div>
    </div>
</template>


<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(254, 252, 247, 0.2);
  backdrop-filter: blur(18px);
}

.glow {
  box-shadow: 0 20px 40px rgba(232, 167, 58, 0.25);
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
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(232, 167, 58, 0.35);
  color: #333;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input:focus {
  border-color: #c9a24d;
  box-shadow: 0 0 0 3px rgba(201, 162, 77, 0.25);
}

</style>
