<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '@/config/firebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { toast } from 'vue3-toastify'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user, isLoading } = useAuth()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const birthDate = ref('')
const isSubmitting = ref(false)
const passwordVisible = ref(false)
const confirmPasswordVisible = ref(false)

onMounted(() => {
    if (!isLoading.value && user.value) {
        router.push('/')
    }
})

const togglePassword = () => passwordVisible.value = !passwordVisible.value
const toggleConfirmPassword = () => confirmPasswordVisible.value = !confirmPasswordVisible.value

const register = async () => {
    if (password.value !== confirmPassword.value) {
        toast.error('Passwords do not match')
        return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password.value)) {
        toast.error('Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)')
        return
    }

    if (!firstName.value || !lastName.value || !email.value) {
        toast.error('Please fill all required fields')
        return
    }

    isSubmitting.value = true

    try {
        const userCredentials = await createUserWithEmailAndPassword(
            auth,
            email.value,
            password.value,
        )
        const uid = userCredentials.user.uid

        await setDoc(doc(db, 'users', uid), {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            birthDate: birthDate.value || null,
            about: 'Hi! I am new here',
            createdAt: serverTimestamp(),
        })

        toast.success('Account created successfully! Redirecting to login...')

        setTimeout(() => router.push('/login'), 3000)
    } catch (err) {
        console.error(err)
        const friendlyMessages = {
            'auth/email-already-in-use': 'An account with this email already exists.',
            'auth/invalid-email': 'Invalid email format.',
            'auth/weak-password': 'Password is too weak.',
        }
        toast.error(friendlyMessages[err.code] || 'Failed to register, please try again')
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
<div class="min-h-[100dvh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden no-scrollbar">

  <nav class="fixed top-0 inset-x-0 z-50 glass backdrop-blur-xl">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <button @click="history.back()" class="flex items-center gap-2 text-white/80 hover:text-white transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="hidden sm:inline text-sm">Home</span>
      </button>
      <span class="text-white font-playfair text-lg tracking-wide">AesthetiCare</span>
      <div class="w-8"></div>
    </div>
  </nav>

  <div class="relative flex min-h-[100dvh] items-center justify-center px-4 pt-24 pb-16">
    <div class="relative w-full max-w-[520px] glass rounded-3xl p-8 sm:p-10 glow">
      
      <div class="text-center mb-10">
        <h1 class="text-3xl sm:text-4xl font-playfair text-white font-bold">Create Your Account</h1>
        <p class="text-white/70 mt-2">Join AesthetiCare today</p>
      </div>

      <form class="space-y-6" @submit.prevent="register">
        <!-- Name -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input v-model="firstName" placeholder="First Name" class="input" />
          <input v-model="lastName" placeholder="Last Name" class="input" />
        </div>

        <input type="date" v-model="birthDate" class="input" />

        <input v-model="email" type="email" placeholder="Email address" class="input" />

        <div class="relative">
          <input
            :type="passwordVisible ? 'text' : 'password'"
            v-model="password"
            placeholder="Password"
            class="input pr-12"
          />
          <button type="button" @click="togglePassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white" tabindex="-1">
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

        <div class="relative">
          <input
            :type="confirmPasswordVisible ? 'text' : 'password'"
            v-model="confirmPassword"
            placeholder="Confirm Password"
            class="input pr-12"
          />
          <button type="button" @click="toggleConfirmPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white" tabindex="-1">
            <svg v-if="!confirmPasswordVisible" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.956 9.956 0 012.1-3.592M6.18 6.18A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
            </svg>
          </button>
        </div>

        <label class="flex items-center gap-2 text-white/70 text-sm">
          <input type="checkbox" required class="accent-yellow-400" />
          I agree to the <a href="#" class="text-gold-400 hover:underline">terms and conditions</a>
        </label>

        <button
          type="button"
          @click="register"
          :disabled="isSubmitting"
          class="w-full py-4 rounded-xl gradient-gold text-gold-700 font-semibold text-lg hover:scale-[1.02] transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'Registering...' : 'Create Account' }}
        </button>

        <p class="text-center text-white/70 mt-4">
          Already have an account?
          <router-link to="/login" class="text-gold-400 hover:text-gold-300 underline">
            Sign in
          </router-link>
        </p>
      </form>
    </div>
  </div>
</div>
</template>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(18px);
}

.gradient-gold {
  background: linear-gradient(135deg, #f8f4f0, #e7d3a8, #d1b075);
}

.glow {
  box-shadow: 0 20px 40px rgba(234, 179, 8, 0.25);
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

.no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
