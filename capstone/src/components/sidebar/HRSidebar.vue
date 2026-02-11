<template>
  <aside class="w-64 bg-slate-800 min-h-screen flex flex-col">
    <!-- Logo/Header -->
    <div class="p-6 border-b border-slate-700">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700"></div>
        <div>
          <h2 class="text-white font-semibold text-lg">HR Module</h2>
          <p class="text-slate-400 text-xs">Human Resources</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4">
      <ul class="space-y-2">
        <li>
          <router-link
            to="/hr/dashboard"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            active-class="bg-purple-500 text-white hover:bg-purple-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <span>Dashboard</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/hr/employees"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            active-class="bg-purple-500 text-white hover:bg-purple-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <span>Employees</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/hr/sales"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            active-class="bg-purple-500 text-white"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <span>Sales</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- User Section -->
    <div class="p-4 border-t border-slate-700">
      <div class="flex items-center gap-3 px-4 py-3">
        <div class="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
          U
        </div>
        <div class="flex-1">
          <p class="text-white text-sm font-medium">{{ hrName }}</p>
          <p class="text-slate-400 text-xs">{{ hrEmail }}</p>
        </div>
      </div>
      <button @click="logout" class="flex items-center gap-3 w-full px-4 py-2 mt-2 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-500 hover:text-white transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>

<script>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '@/config/firebaseConfig';

export default {
  name: 'HRSidebar',
  setup() {
    const isOpen = ref(false);
    const router = useRouter();
    const db = getFirestore();

    const hrName = ref('');
    const hrEmail = ref('');

    const toggleSidebar = () => {
      isOpen.value = !isOpen.value;
    };

    const logout = () => {
      alert('Logging out...'); // Replace with actual logout logic
      router.push('/login');
    }

    watch(isOpen, (open) => {
      document.body.style.overflow = open ? 'hidden' : '';
    });

    onUnmounted(() => {
      document.body.style.overflow = '';
    });

    const loadHRDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const hrData = userSnap.data();
          hrName.value = `${hrData.firstName || ''} ${hrData.lastName || ''}`.trim();
          hrEmail.value = hrData.email || user.email;
        } else {
          hrName.value = 'HR User';
          hrEmail.value = user.email || '';
        }
      }
    };

    onMounted(loadHRDetails);

    return { isOpen, toggleSidebar, logout, hrName, hrEmail }
  }
}
</script>

<style scoped>
.router-link-active {
  background-color: #8b5cf6;
  color: white;
}
</style>
