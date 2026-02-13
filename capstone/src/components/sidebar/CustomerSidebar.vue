<script>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

/* Firebase */
import { getAuth, signOut } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

/* SweetAlert2 */
import Swal from 'sweetalert2'

export default {
  name: 'CustomerSidebar',

  setup() {
    const router = useRouter()
    const auth = getAuth()
    const db = getFirestore()

    const isOpen = ref(false)
    const helpOpen = ref(false)

    const customerEmail = ref('')
    const customerName = ref('')

    /* ==============================
       Sidebar Controls
    ============================== */

    const toggleSidebar = () => {
      isOpen.value = !isOpen.value
    }

    const toggleHelp = () => {
      helpOpen.value = !helpOpen.value
    }

    watch(isOpen, (open) => {
      document.body.style.overflow = open ? 'hidden' : ''
    })

    onUnmounted(() => {
      document.body.style.overflow = ''
    })

    /* ==============================
       Load Customer Info
    ============================== */

    const loadCustomerInfo = async () => {
      const user = auth.currentUser

      if (!user) return

      customerEmail.value = user.email || ''

      try {
        const userRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
          const data = userSnap.data()
          customerName.value = `${data.firstName || ''} ${data.lastName || ''}`.trim()
        }
      } catch (error) {
        console.error('Error loading user info:', error)
      }
    }

    onMounted(() => {
      loadCustomerInfo()
    })

    /* ==============================
       Logout
    ============================== */

    const logout = async () => {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to log out?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, log me out',
        cancelButtonText: 'Cancel'
      })

      if (result.isConfirmed) {
        try {
          await signOut(auth)

          await Swal.fire({
            icon: 'success',
            title: 'Logged out',
            timer: 1500,
            showConfirmButton: false
          })

          router.push('/login')
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Logout Failed',
            text: error.message
          })
        }
      }
    }

    return {
      isOpen,
      helpOpen,
      toggleSidebar,
      toggleHelp,
      logout,
      customerEmail,
      customerName
    }
  }
}
</script>


<template>
  <div class="flex">
    <button
      class="md:hidden absolute top-4 left-4 z-50 p-2 bg-gold-600 text-orange-50 rounded-md shadow-md transition-all duration-300"
      :style="{ left: isOpen ? '16rem' : '1rem' }"
      @click="toggleSidebar">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <aside
      :class="[
        'fixed md:static z-40 h-full bg-neutral-50 flex flex-col transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
      style="width: 16rem;">

      <div class="p-6 border-b border-gold-700">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-gold-600 to-gold-800"></div>
          <div>
            <h2 class="text-gold-800 font-semibold text-lg">Welcome Back!</h2>
            <p class="text-gold-700 text-xs">Book your Appointments</p>
          </div>
        </div>
      </div>

      <nav class="flex-1 p-4 overflow-y-auto">
        <ul class="space-y-2">
          <li>
            <router-link
              to="/customer/home"
              class="flex items-center gap-3 px-4 py-3 rounded-lg text-gold-700 hover:bg-rose-600 hover:text-white transition-colors"
              active-class="bg-gold-700 text-slate-50 hover:bg-gold-800">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h5v-6h4v6h5a1 1 0 001-1V10" />
              </svg>
              <span>Home</span>
            </router-link>
          </li>

          <li>
            <router-link
              to="/customer/appointments"
              class="flex items-center gap-3 px-4 py-3 rounded-lg text-gold-700 hover:bg-rose-600 hover:text-white transition-colors"
              active-class="bg-gold-700 text-slate-50 hover:bg-gold-800">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3M3 11h18M5 7h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 15l2 2 4-4" />
                </svg>
              <span>My Appointments</span>
            </router-link>
          </li>

          <li>
            <router-link
              to="/customer/profile"
              class="flex items-center gap-3 px-4 py-3 rounded-lg text-gold-700 hover:bg-rose-600 hover:text-white transition-colors"
              active-class="bg-gold-700 text-slate-50 hover:bg-gold-800">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M12 4a8 8 0 00-6.96 11.947A4.99 4.99 0 019 14h6a4.99 4.99 0 013.96 1.947A8 8 0 0012 4
                        m7.943 14.076q.188-.245.36-.502A9.96 9.96 0 0022 12
                        c0-5.523-4.477-10-10-10S2 6.477 2 12
                        a9.96 9.96 0 002.057 6.076l-.005.018
                        l.355.413A9.98 9.98 0 0012 22
                        q.324 0 .644-.02a9.95 9.95 0 005.031-1.745
                        a10 10 0 001.918-1.728l.355-.413z
                        M12 6a3 3 0 100 6a3 3 0 000-6" />
                </svg>
              <span>My Profile</span>
            </router-link>
          </li>

          <li>
            <button
              @click="toggleHelp"
              class="flex items-center justify-between w-full px-4 py-3 rounded-lg text-gold-700 hover:bg-rose-600 hover:text-white transition-colors"
            >
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-width="2"
                        d="M21 12v-1a9 9 0 10-18 0v1m18 0h-4v6h2c1.105 0 2-.827 2-1.846z
                        M3 12h4v6H5m-2-6v4.154C3 17.174 3.895 18 5 18
                        m5.25 3.5H8a3 3 0 01-3-3V18
                        m5.25 3.5c0 .414.336.75.75.75h2
                        a.75.75 0 000-1.5h-2a.75.75 0 00-.75.75Z"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
                <span>Help & Support</span>
              </div>
              <svg
                class="w-4 h-4 transform transition-transform"
                :class="{ 'rotate-90': helpOpen }"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <ul v-if="helpOpen" class="ml-8 mt-2 space-y-2">
              <li>
                <router-link
                  to="/customer/help/report"
                  class="block px-4 py-2 rounded-lg text-gold-700 hover:bg-rose-600 hover:text-white transition-colors"
                  active-class="bg-gold-700 text-slate-50 hover:bg-gold-800">
                  Report an Issue  
                </router-link>
              </li>
                <li>
                    <router-link
                    to="/customer/help/faq"
                    class="block px-4 py-2 rounded-lg text-gold-700 hover:bg-rose-600 hover:text-white transition-colors"
                    active-class="bg-gold-700 text-slate-50 hover:bg-gold-800">
                    FAQ
                    </router-link>
                </li>
            </ul>
            </li>
        </ul>
        </nav>

        <div class="p-4 border-t border-slate-700">
            <div class="flex items-center gap-3 px-4 py-3">
                <div class="h-10 w-10 rounded-full bg-gold-700 flex items-center justify-center text-slate-50 font-semibold"></div>
                <div class="flex-1">
                    <p class="text-gold-800 text-sm font-medium">{{ customerName }}</p>
                    <p class="text-gold-900 text-xs">{{ customerEmail }}</p>
                </div>
            </div>

            <button
            @click="logout"
            class="flex items-center gap-3 w-full px-4 py-2 mt-2 border border-gold-700 text-gold-700 rounded-lg hover:bg-gold-700 hover:text-slate-50 transition-colors"
            >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0
                01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0
                013 3v1" />
            </svg>
            <span>Logout</span>
            </button>
        </div>
        </aside>
    </div>
</template>
