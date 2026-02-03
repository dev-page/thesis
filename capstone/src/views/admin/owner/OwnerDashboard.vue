<script>
import { ref } from 'vue'
import OwnerSidebar from '@/components/sidebar/OwnerSidebar.vue'

export default {
  name: 'OwnerDashboard',
  components: { OwnerSidebar },
  setup() {
    //Static data
    const totalBranches = ref(6)
    const totalEmployees = ref(84)
    const monthlyRevenue = ref(128500)

    const branches = ref([
      { id: 1, name: 'Downtown Clinic', employees: 22, revenue: 32500, status: 'Active' },
      { id: 2, name: 'Uptown Clinic', employees: 18, revenue: 28400, status: 'Active' },
      { id: 3, name: 'Westside Clinic', employees: 14, revenue: 19600, status: 'Active' },
      { id: 4, name: 'Eastside Clinic', employees: 12, revenue: 17400, status: 'Active' },
      { id: 5, name: 'North Clinic', employees: 10, revenue: 15400, status: 'Under Review' },
      { id: 6, name: 'South Clinic', employees: 8, revenue: 15200, status: 'Active' }
    ])

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
            ${{ monthlyRevenue.toLocaleString() }}
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
                {{ branch.employees }} employees • ${{ branch.revenue.toLocaleString() }} revenue
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
              <span class="text-slate-400">${{ branch.revenue.toLocaleString() }}</span>
            </div>
            <div class="w-full bg-slate-700 rounded-full h-2">
              <div
                class="h-2 rounded-full bg-gold-700"
                :style="{ width: `${(branch.revenue / monthlyRevenue) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
