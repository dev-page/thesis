<script>
import OwnerSidebar from '@/components/sidebar/OwnerSidebar.vue';
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getApp } from 'firebase/app';

export default {
  name: 'OwnerFinance',
  components: { OwnerSidebar },
  setup() {
    const db = getFirestore(getApp());
    const totalPayroll = ref(0);
    const revenue = ref(0);

    // Branches with employees and proposed salaries
    const branches = ref([]);
    const reports = ref([]);

    const editReport = (report) => {
      alert(`Editing report for ${report.employee} at ${report.branch}`);
      // Here you could open a modal or navigate to an edit page
    };

    const payrollPercentage = computed(() => revenue.value ? ((totalPayroll.value / revenue.value) * 100).toFixed(1) : 0 );

    // Canvas refs
    const payrollChart = ref(null);
    const financeChart = ref(null);
    let payrollChartInstance = null;
    let financeChartInstance = null;

    const loadFinanceData = async () => {
      const snapshot = await getDocs(collection(db, "clinics"));
      const branchData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      branches.value = branchData;

      totalPayroll.value = branchData.reduce((sum, b) => sum + (b.employees ? b.employees.reduce((s, e) => s + (e.proposedSalary || 0), 0) : 0), 0);
      revenue.value = branchData.reduce((sum, b) => sum + (b.revenue || 0), 0);
    }

    // Payroll by branch chart
    const renderPayrollChart = () => {
      const labels = branches.value.map(b => b.clinicBranch || b.name || b.clinicName);
      const data = branches.value.map(b => b.employees ? b.employees.reduce((sum, e) => sum + (e.proposedSalary || 0), 0) : 0);

      if (payrollChartInstance) payrollChartInstance.destroy();

      const ctx = payrollChart.value.getContext('2d');
      payrollChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Total Payroll',
            data,
            backgroundColor: 'rgba(139,92,246,0.7)',
            borderColor: '#8b5cf6',
            borderWidth: 1,
            barPercentage: 0.5,
            categoryPercentage: 0.6
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: 'white' } } },
          scales: {
            x: { ticks: { color: 'white' }, grid: { color: '#334155' } },
            y: { ticks: { color: 'white' }, grid: { color: '#334155' } }
          }
        }
      });
    };

    // Revenue vs Payroll chart
    const renderFinanceChart = () => {
      if (!financeChart.value) return;

      const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
          {
            label: 'Revenue',
            data: [120000, 135000, 140000, 150000, 152300],
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139,92,246,0.2)',
            fill: true
          },
          {
            label: 'Payroll',
            data: [50000, 58000, 60000, 62000, 64200],
            borderColor: '#facc15',
            backgroundColor: 'rgba(250,204,21,0.2)',
            fill: true
          }
        ]
      };

      if (financeChartInstance) financeChartInstance.destroy();

      const ctx = financeChart.value.getContext('2d');
      financeChartInstance = new Chart(ctx, {
        type: 'line',
        data,
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: 'white' } } },
          scales: {
            x: { ticks: { color: 'white' }, grid: { color: '#334155' } },
            y: { ticks: { color: 'white' }, grid: { color: '#334155' } }
          }
        }
      });
    };

    onMounted(async () => {
      await loadFinanceData();
      await nextTick(); // Ensure DOM is updated before rendering charts
      renderPayrollChart();
      renderFinanceChart();
    });

    // Update chart if branch data changes
    watch(branches, async () => { 
      await nextTick(); // Wait for DOM update
      renderPayrollChart(); 
    }, { deep: true });

    return {
      totalPayroll, revenue, payrollPercentage,
      branches, payrollChart, financeChart, reports, editReport
    };
  }
};
</script>

<template>
  <div class="flex flex-col md:flex-row bg-slate-900 min-h-screen">
    <OwnerSidebar />

    <main class="flex-1 p-4 md:p-8 overflow-x-hidden">
      <!-- Page Header -->
      <div class="mb-6 md:mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-white mb-1">Finance Overview</h1>
        <p class="text-slate-400 text-sm md:text-base">High-level financial metrics for all branches</p>
      </div>

      <!-- Key Finance Metrics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <div class="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700">
          <h3 class="text-slate-400 text-sm mb-1">Total Payroll</h3>
          <p class="text-2xl md:text-3xl font-bold text-white">${{ totalPayroll }}</p>
          <p class="text-xs text-green-500 mt-1">-</p>
        </div>

        <div class="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700">
          <h3 class="text-slate-400 text-sm mb-1">Revenue This Month</h3>
          <p class="text-2xl md:text-3xl font-bold text-white">${{ revenue }}</p>
          <p class="text-xs text-green-500 mt-1">-</p>
        </div>

        <div class="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700">
          <h3 class="text-slate-400 text-sm mb-1">Payroll % of Revenue</h3>
          <p class="text-2xl md:text-3xl font-bold text-white">{{ payrollPercentage }}%</p>
          <p class="text-xs text-slate-500 mt-1">-</p>
        </div>
      </div>

      <div class="overflow-x-auto bg-slate-800 rounded-xl border border-slate-700 my-4">
        <table class="w-full table-auto divide-y divide-slate-700">
            <thead class="bg-slate-700">
            <tr>
                <th class="px-4 md:px-6 py-2 text-left text-xs md:text-sm font-medium text-slate-300 uppercase tracking-wider">Branch</th>
                <th class="px-4 md:px-6 py-2 text-left text-xs md:text-sm font-medium text-slate-300 uppercase tracking-wider">Employee</th>
                <th class="px-4 md:px-6 py-2 text-left text-xs md:text-sm font-medium text-slate-300 uppercase tracking-wider">Proposed Salary</th>
                <th class="px-4 md:px-6 py-2 text-left text-xs md:text-sm font-medium text-slate-300 uppercase tracking-wider">Status</th>
                <th class="px-4 md:px-6 py-2 text-center text-xs md:text-sm font-medium text-slate-300 uppercase tracking-wider">Actions</th>
            </tr>
            </thead>
            <tbody class="bg-slate-800 divide-y divide-slate-700">
            <tr v-for="(report, index) in reports" :key="index" class="hover:bg-slate-700">
                <td class="px-4 md:px-6 py-2 text-slate-200 whitespace-nowrap">{{ report.branch }}</td>
                <td class="px-4 md:px-6 py-2 text-slate-200">{{ report.employee }}</td>
                <td class="px-4 md:px-6 py-2 text-slate-200">${{ report.proposedSalary }}</td>
                <td class="px-4 md:px-6 py-2 text-slate-200">{{ report.status }}</td>
                <td class="px-4 md:px-6 py-2 text-center">
                <button
                    @click="editReport(report)"
                    class="px-2 md:px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs md:text-sm transition-colors"
                >
                    Edit
                </button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>


      <!-- Payroll by Branch Chart -->
      <div class="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700 mb-6 md:mb-8">
        <h2 class="text-lg md:text-xl font-semibold text-white mb-2 md:mb-4">Payroll by Branch</h2>
        <canvas ref="payrollChart" class="w-full h-32 md:h-40"></canvas>
      </div>

      <!-- Revenue vs Payroll Chart -->
      <div class="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700">
        <h2 class="text-lg md:text-xl font-semibold text-white mb-2 md:mb-4">Revenue vs Payroll Trend</h2>
        <canvas ref="financeChart" class="w-full h-40 md:h-64"></canvas>
      </div>
    </main>
  </div>
</template>

<style scoped>
table {
  min-width: 600px;
}

@media (max-width: 640px) {
  table {
    min-width: 500px;
  }
}
</style>