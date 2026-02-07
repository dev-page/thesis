<script>
import { ref, onMounted } from 'vue'
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getApp } from 'firebase/app'
import OwnerSidebar from '@/components/sidebar/OwnerSidebar.vue'

export default {
  name: 'OwnerDashboard',
  components: { OwnerSidebar },
  setup() {
    const db = getFirestore(getApp())

    const totalBranches = ref(0)
    const totalEmployees = ref(0)
    const monthlyRevenue = ref(0)

    const branches = ref([])

    const loadDashboardData = async () => {
      const snapshot = await getDocs(collection(db, "clinics"));
      const branchData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), }));

      branches.value = branchData
      
      totalBranches.value = branches.value.length
      totalEmployees.value = branches.value.reduce((sum, b) => sum + (b.employees || 0), 0)
      monthlyRevenue.value = branches.value.reduce((sum, b) => sum + (b.revenue || 0), 0)
    };

    onMounted(loadDashboardData)

    return {
      totalBranches,
      totalEmployees,
      monthlyRevenue,
      branches
    }
  }
}
</script>


<template>
  <div class="flex bg-slate-900 min-h-screen">
    <OwnerSidebar />

    <main class="flex-1 p-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Branch Overview</h1>
        <p class="text-slate-400">Monitor clinic locations, staff, and revenue performance</p>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Branches -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div class="flex items-center justify-between mb-4">
            <div class="h-12 w-12 rounded-lg bg-gold-700/20 flex items-center justify-center">
              <span class="text-gold-700 text-xl font-bold">🏥</span>
            </div>
          </div>
          <h3 class="text-slate-400 text-sm mb-1">Total Branches</h3>
          <p class="text-3xl font-bold text-white">{{ totalBranches }}</p>
          <p class="text-xs text-slate-400 mt-1">Across all regions</p>
        </div>

        <!-- Employees -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div class="flex items-center justify-between mb-4">
            <div class="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <span class="text-blue-400 text-xl font-bold">👥</span>
            </div>
          </div>
          <h3 class="text-slate-400 text-sm mb-1">Total Employees</h3>
          <p class="text-3xl font-bold text-white">{{ totalEmployees }}</p>
          <p class="text-xs text-slate-400 mt-1">Doctors, nurses & staff</p>
        </div>

        <!-- Revenue -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div class="flex items-center justify-between mb-4">
            <div class="h-12 w-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <span class="text-green-400 text-xl font-bold">$</span>
            </div>
          </div>
          <h3 class="text-slate-400 text-sm mb-1">Monthly Revenue</h3>
          <p class="text-3xl font-bold text-white">
            ${{ monthlyRevenue ? monthlyRevenue.toLocaleString() : 0 }}
          </p>
          <p class="text-xs text-green-400 mt-1">+8% from last month</p>
        </div>
      </div>

      <!-- Branch List -->
      <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
        <h2 class="text-xl font-semibold text-white mb-6">Branches Performance</h2>

        <div class="space-y-4">
          <div
            v-for="branch in branches"
            :key="branch.id"
            class="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition"
          >
            <div>
              <p class="text-white font-medium">{{ branch.name }}</p>
              <p class="text-slate-400 text-sm">
                {{ branch.employees || 0 }} employees • ${{ branch.revenue ? branch.revenue.toLocaleString() : 0 }} revenue
              </p>
            </div>

            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                branch.status === 'Active'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-yellow-500/20 text-yellow-400'
              ]"
            >
              {{ branch.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Revenue Distribution -->
      <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 class="text-xl font-semibold text-white mb-6">Revenue Distribution</h2>

        <div class="space-y-4">
          <div v-for="branch in branches" :key="branch.id">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-white">{{ branch.name }}</span>
              <span class="text-slate-400">${{ branch.revenue ? branch.revenue.toLocaleString() : 0 }}</span>
            </div>
            <div class="w-full bg-slate-700 rounded-full h-2">
              <div
                class="h-2 rounded-full bg-gold-700"
                :style="{ width: monthlyRevenue ? `${(branch.revenue / monthlyRevenue) * 100}%` : '0%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
