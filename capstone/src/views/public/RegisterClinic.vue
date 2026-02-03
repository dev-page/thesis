<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '@/config/firebaseConfig'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { toast } from 'vue3-toastify'
import { useAuth } from '@/composables/useAuth'
import Modal from '@/components/common/Modal.vue'
import Terms from '@/components/common/Terms.vue'

const router = useRouter()
const { user, isLoading } = useAuth()

const firstName = ref('')
const lastName = ref('')
const birthDate = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const contactNumber = ref('')
const clinicName = ref('')
const clinicLocation = ref('')

const isSubmitting = ref(false)
const passwordVisible = ref(false)
const confirmPasswordVisible = ref(false)
const showTerms = ref(false)
const termsAccepted = ref(false)

onMounted(() => {
  if (!isLoading.value && user.value) {
    router.push('/')
  }
})

const togglePassword = () => passwordVisible.value = !passwordVisible.value
const toggleConfirmPassword = () => confirmPasswordVisible.value = !confirmPasswordVisible.value

const register = async () => {
  if (!termsAccepted.value) {
    toast.error('You must agree to the terms and conditions')
    return
  }
  
  if (password.value !== confirmPassword.value) {
    toast.error('Passwords do not match')
    return
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  if (!passwordRegex.test(password.value)) {
    toast.error('Password must be at least 8 characters and contain uppercase, lowercase, number, and special character')
    return
  }

  if (!firstName.value || !lastName.value || !email.value || !clinicName.value || !clinicLocation.value || !contactNumber.value || !password.value || !confirmPassword.value  ) {
    toast.error('Please fill all required fields')
    return
  }

  const phoneRegex = /^[0-9]{10}$/
  if (!phoneRegex.test(contactNumber.value)) {
    toast.error('Contact number must be 10 digits after +63')
    return
  }

  const birth = new Date(birthDate.value)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  if (age < 18) {
    toast.error('You must be at least 18 years old to register')
    return
  }

  isSubmitting.value = true

  try {
    const userCredentials = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const uid = userCredentials.user.uid

    await sendEmailVerification(userCredentials.user)

    const clinicRef = doc(db, 'clinics', uid)
    await setDoc(clinicRef, {
      clinicName: clinicName.value,
      clinicLocation: clinicLocation.value,
      contactNumber: contactNumber.value,
      ownerId: uid,
      createdAt: serverTimestamp(),
    })

    await setDoc(doc(db, 'clinics', uid), {
      firstName: firstName.value,
      lastName: lastName.value,
      birthDate: birthDate.value || null,
      email: email.value,
      role: 'owner',
      clinicId: clinicRef.id,
      status: 'pending',
      createdAt: serverTimestamp(),
    })

    toast.success('Owner and clinic registered! Please check your email for verification.')
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
<div class="min-h-[100dvh] bg-gradient-to-br from-gold-100 via-cream-200 to-rose-100 overflow-x-hidden no-scrollbar">

  <nav class="fixed top-0 inset-x-0 z-50 bg-gold-800/90 bg-gradient-to-r from-gold-800 via-gold-700 to-rose-800 backdrop-blur-md border-b border-gold-600/50 shadow-md">
    <div class="relative max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2 text-white hover:text-yellow-100 transition-colors rounded-md px-2 py-1 hover:bg-white/20">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
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
    <div class="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2
                rounded-2xl overflow-hidden
                bg-white/50 backdrop-blur-xl
                border border-white/40
                shadow-2xl shadow-gold-900/20">
      <div class="relative hidden lg:block">
        <img src="@/assets/bg.jpg" alt="AesthetiCare" class="absolute inset-0 w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-br from-gold-900/70 via-charcoal-900/60 to-rose-900/60"></div>
        <div class="relative z-10 h-full flex flex-col justify-end p-10">
          <h2 class="text-2xl font-playfair text-gold-300 mb-2">Register Your Clinic & Create Your Account</h2>
          <p class="text-white/80 max-w-sm">
            Get started with AesthetiCare today! Set up your clinic profile and your personal account to manage bookings, services, and more — all in one place.
          </p>
        </div>
      </div>

      <div class="flex items-center justify-center px-4 pt-12 pb-12">
        <form class="space-y-4 w-full max-w-[480px]" @submit.prevent="register">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="relative">
            <input v-model="firstName" placeholder=" " required class="peer input h-16 pt-4 pb-2 px-3" />
            <label class="absolute left-3 top-3 text-xs text-charcoal-500
                            transition-all duration-200
                            peer-placeholder-shown:top-1/2
                            peer-placeholder-shown:-translate-y-1/2
                            peer-placeholder-shown:text-sm
                            peer-placeholder-shown:text-charcoal-400
                            peer-focus:top-2
                            peer-focus:translate-y-0
                            peer-focus:text-xs
                            peer-focus:text-gold-700">
                First Name
            </label>
            </div>
            <div class="relative">
            <input v-model="lastName" placeholder=" " required class="peer input h-16 pt-4 pb-2 px-3" />
            <label class="absolute left-3 top-3 text-xs text-charcoal-500
                            transition-all duration-200
                            peer-placeholder-shown:top-1/2
                            peer-placeholder-shown:-translate-y-1/2
                            peer-placeholder-shown:text-sm
                            peer-placeholder-shown:text-charcoal-400
                            peer-focus:top-2
                            peer-focus:translate-y-0
                            peer-focus:text-xs
                            peer-focus:text-gold-700">
                Last Name
            </label>
            </div>
        </div>

        <div class="relative">
            <input type="date" v-model="birthDate" class="peer input h-16 pt-4 pb-2 px-3" />
            <label class="absolute left-3 top-3 text-xs text-charcoal-500
                        transition-all duration-200
                        peer-placeholder-shown:top-1/2
                        peer-placeholder-shown:-translate-y-1/2
                        peer-placeholder-shown:text-sm
                        peer-placeholder-shown:text-charcoal-400
                        peer-focus:top-2
                        peer-focus:translate-y-0
                        peer-focus:text-xs
                        peer-focus:text-gold-700">
            Birth Date
            </label>
        </div>

        <div class="relative">
            <input v-model="email" type="email" required placeholder=" " class="peer input h-16 pt-4 pb-2 px-3" />
            <label class="absolute left-3 top-3 text-xs text-charcoal-500
                        transition-all duration-200
                        peer-placeholder-shown:top-1/2
                        peer-placeholder-shown:-translate-y-1/2
                        peer-placeholder-shown:text-sm
                        peer-placeholder-shown:text-charcoal-400
                        peer-focus:top-2
                        peer-focus:translate-y-0
                        peer-focus:text-xs
                        peer-focus:text-gold-700">
            Email Address
            </label>
        </div>

        <div class="relative">
            <input :type="passwordVisible ? 'text' : 'password'" v-model="password"
                   required placeholder=" " class="peer input h-16 pt-4 pb-2 px-3" />
            <label class="absolute left-3 top-3 text-xs text-charcoal-500
                          transition-all duration-200
                          peer-placeholder-shown:top-1/2
                          peer-placeholder-shown:-translate-y-1/2
                          peer-placeholder-shown:text-sm
                          peer-placeholder-shown:text-charcoal-400
                          peer-focus:top-2
                          peer-focus:translate-y-0
                          peer-focus:text-xs
                          peer-focus:text-gold-700">
              Password
            </label>
              <button type="button" @click="togglePassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500 hover:text-gold-700" tabindex="-1">
                <svg v-if="!confirmPasswordVisible" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.956 9.956 0 012.1-3.592M6.18 6.18A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
          </div>

          <div class="relative">
            <input :type="confirmPasswordVisible ? 'text' : 'password'" v-model="confirmPassword"
                   required placeholder=" " class="peer input h-16 pt-4 pb-2 px-3" />
            <label class="absolute left-3 top-3 text-xs text-charcoal-500
                          transition-all duration-200
                          peer-placeholder-shown:top-1/2
                          peer-placeholder-shown:-translate-y-1/2
                          peer-placeholder-shown:text-sm
                          peer-placeholder-shown:text-charcoal-400
                          peer-focus:top-2
                          peer-focus:translate-y-0
                          peer-focus:text-xs
                          peer-focus:text-gold-700">
              Confirm Password
            </label>
            <button type="button" @click="toggleConfirmPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500 hover:text-gold-700" tabindex="-1">
                <svg v-if="!confirmPasswordVisible" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.956 9.956 0 012.1-3.592M6.18 6.18A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
          </div>

        <div class="relative">
            <input v-model="clinicName" placeholder=" " required class="peer input h-16 pt-4 pb-2 px-3" />
            <label class="absolute left-3 top-3 text-xs text-charcoal-500
                        transition-all duration-200
                        peer-placeholder-shown:top-1/2
                        peer-placeholder-shown:-translate-y-1/2
                        peer-placeholder-shown:text-sm
                        peer-placeholder-shown:text-charcoal-400
                        peer-focus:top-2
                        peer-focus:translate-y-0
                        peer-focus:text-xs
                        peer-focus:text-gold-700">
            Clinic Name
            </label>
        </div>

        <div class="relative">
            <input v-model="clinicLocation" placeholder=" " required class="peer input h-16 pt-4 pb-2 px-3" />
            <label class="absolute left-3 top-3 text-xs text-charcoal-500
                        transition-all duration-200
                        peer-placeholder-shown:top-1/2
                        peer-placeholder-shown:-translate-y-1/2
                        peer-placeholder-shown:text-sm
                        peer-placeholder-shown:text-charcoal-400
                        peer-focus:top-2
                        peer-focus:translate-y-0
                        peer-focus:text-xs
                        peer-focus:text-gold-700">
            Clinic Location
            </label>
        </div>

        <div class="relative">
            <div class="flex items-center rounded-xl border border-[rgba(0,0,0,0.15)] bg-white/20 focus-within:border-gold-700">
                <span class="inline-flex items-center px-3 text-charcoal-700 select-none">
                +63
                </span>

                <input v-model="contactNumber" type="tel" placeholder=" " required class="peer flex-1 h-16 pt-4 pb-2 px-3 bg-transparent text-charcoal-700 placeholder-transparent focus:outline-none"/>
                <label
                class="absolute left-12 top-3 text-xs text-charcoal-500
                        transition-all duration-200
                        peer-placeholder-shown:top-1/2
                        peer-placeholder-shown:-translate-y-1/2
                        peer-placeholder-shown:text-sm
                        peer-placeholder-shown:text-charcoal-400
                        peer-focus:top-2
                        peer-focus:translate-y-0
                        peer-focus:text-xs
                        peer-focus:text-gold-700">
                Contact Number
                </label>
            </div>
        </div>

        <label class="flex items-center gap-2 text-charcoal-600 text-sm">
            <input type="checkbox" v-model="termsAccepted" required class="accent-gold-700" />
            I agree to the <a href="#" @click.prevent="showTerms = true" class="text-gold-700 hover:underline">terms and conditions</a>
        </label>

        <button type="submit"
                :disabled="isSubmitting"
                class="w-full py-3 rounded-xl bg-gold-700 text-white font-semibold text-base
                        hover:bg-gold-800 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed">
            {{ isSubmitting ? 'Registering...' : 'Create Account' }}
        </button>

        </form>

      </div>

    </div>

      <!-- Terms and Conditions Modal -->
      <Modal
        :isOpen="showTerms"
        :title="'Terms and Conditions'"
        @close="showTerms = false"
        :showConfirm="false"
      >
        <Terms />
      </Modal>

  </div>
</div>
</template>

<style scoped>
.input {
  width: 100%;
  padding: 1rem 1rem 0.5rem;
  border-radius: 0.75rem;
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(0,0,0,0.15);
  color: #1C1C1C;
  outline: none;
  transition: all 0.2s;
}
.input:focus {
  border-color: #D4AF37;
  background: rgba(255,255,255,0.3);
}
.no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
