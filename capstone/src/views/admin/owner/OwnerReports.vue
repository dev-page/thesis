
<script>
import OwnerSidebar from '@/components/sidebar/OwnerSidebar.vue';
import { ref } from 'vue';

export default {
  name: 'OwnerReports',
  components: { OwnerSidebar },
  setup() {
    const totalBranches = ref(3);
    const totalEmployees = ref(45);
    const monthlyRevenue = ref(152300);
    const newInquiries = ref(28);

    const branches = ref([
      { name: 'Downtown', employees: 15, revenue: 65200, newInquiries: 12, conversionRate: 67 },
      { name: 'Uptown', employees: 10, revenue: 42000, newInquiries: 8, conversionRate: 50 },
      { name: 'Suburb', employees: 20, revenue: 45100, newInquiries: 8, conversionRate: 72 },
    ]);

    return { totalBranches, totalEmployees, monthlyRevenue, newInquiries, branches };
  }
}
</script>

<style scoped>
</style>
<template>
  <div class="flex flex-col md:flex-row bg-slate-900 min-h-screen">
    <!-- Sidebar stays fixed on medium screens and up -->
    <OwnerSidebar class="w-full md:w-64 flex-shrink-0" />

    <main class="flex-1 p-4 md:p-8">
      <!-- Page Header -->
      <div class="mb-6 md:mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">Reports & Analytics</h1>
        <p class="text-slate-400 text-sm md:text-base">View detailed performance metrics for branches, staff, and revenue</p>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div class="bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700">
          <h3 class="text-slate-400 text-xs sm:text-sm mb-1">Total Branches</h3>
          <p class="text-2xl sm:text-3xl font-bold text-white">{{ totalBranches }}</p>
        </div>

        <div class="bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700">
          <h3 class="text-slate-400 text-xs sm:text-sm mb-1">Total Employees</h3>
          <p class="text-2xl sm:text-3xl font-bold text-white">{{ totalEmployees }}</p>
        </div>

        <div class="bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700">
          <h3 class="text-slate-400 text-xs sm:text-sm mb-1">Monthly Revenue</h3>
          <p class="text-2xl sm:text-3xl font-bold text-white">${{ monthlyRevenue }}</p>
        </div>

        <div class="bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700">
          <h3 class="text-slate-400 text-xs sm:text-sm mb-1">New Inquiries</h3>
          <p class="text-2xl sm:text-3xl font-bold text-white">{{ newInquiries }}</p>
        </div>
      </div>

      <!-- Reports Table -->
      <div class="bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700 overflow-x-auto">
        <h2 class="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">Branch Performance</h2>

        <table class="w-full text-left min-w-[600px] border-collapse">
          <thead>
            <tr class="text-slate-400 uppercase text-xs md:text-sm border-b border-slate-700">
              <th class="py-2 px-3 md:py-3 md:px-4">Branch</th>
              <th class="py-2 px-3 md:py-3 md:px-4">Employees</th>
              <th class="py-2 px-3 md:py-3 md:px-4">Revenue</th>
              <th class="py-2 px-3 md:py-3 md:px-4">New Inquiries</th>
              <th class="py-2 px-3 md:py-3 md:px-4">Conversion Rate</th>
            </tr>
          </thead>
          <tbody class="text-white">
            <tr 
              v-for="branch in branches" 
              :key="branch.name" 
              class="hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <td class="py-2 px-3 md:py-3 md:px-4 font-medium">{{ branch.name }}</td>
              <td class="py-2 px-3 md:py-3 md:px-4">{{ branch.employees }}</td>
              <td class="py-2 px-3 md:py-3 md:px-4">${{ branch.revenue }}</td>
              <td class="py-2 px-3 md:py-3 md:px-4">{{ branch.newInquiries }}</td>
              <td class="py-2 px-3 md:py-3 md:px-4">{{ branch.conversionRate }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>
