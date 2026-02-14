<script>
import { ref, onMounted, render } from 'vue'
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getApp } from 'firebase/app'
import OwnerSidebar from '@/components/sidebar/OwnerSidebar.vue'
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables)

export default {
  name: 'OwnerDashboard',
  components: { OwnerSidebar },
  setup() {
    const db = getFirestore(getApp())

    const totalBranches = ref(0)
    const totalEmployees = ref(0)
    const monthlyRevenue = ref(0)

    const branches = ref([])
    const staff = ref([])

    const revenueChartRef = ref(null)
    const employeeChartRef = ref(null)
    let revenueChartInstance = null
    let employeeChartInstance = null

    const loadDashboardData = async () => {
      try {
        const branchSnapshot = await getDocs(collection(db, "clinics"));
        const branchData = branchSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        branches.value = branchData
        totalBranches.value = branches.value.length

        const staffSnapshot = await getDocs(collection(db, "users"));
        const staffData = staffSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(u => u.userType === 'Staff');
        staff.value = staffData
        totalEmployees.value = staff.value.length
        
        monthlyRevenue.value = branches.value.reduce((sum, b) => sum + (b.revenue || 0), 0)
        
        renderRevenueChart()
        
        if(branches.value.length > 0) {
          renderEmployeeChart()
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      }
    };
    
    const renderRevenueChart = () => {
      if(!revenueChartRef.value) return

      const labels = branches.value.map(b => `${b.clinicBranch} (${b.clinicLocation || 'Unknown'})`)
      const revenues = branches.value.map(b => b.revenue || 0)

      if(revenueChartInstance) revenueChartInstance.destroy()

      revenueChartInstance = new Chart(revenueChartRef.value, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Revenue (₱)',
              data: revenues,
              backgroundColor: 'rgba(255, 215, 0, 0.7)',
              borderColor: 'rgba(255, 215, 0, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: 'Branch Performance' }
          }
        }
      })
    }

    const renderEmployeeChart = () => {
      if(!employeeChartRef.value) return

      const roleCounts = {}
      staff.value.forEach(s => {
        const key = `${s.clinicBranch} - ${s.role}`
        roleCounts[key] = (roleCounts[key] || 0) + 1
      })

      const labels = Object.keys(roleCounts)
      const data = Object.values(roleCounts)

      if(employeeChartInstance) employeeChartInstance.destroy()

      employeeChartInstance = new Chart(employeeChartRef.value, {
        type: 'pie',
        data: {
          labels,
          datasets: [
            {
              label: 'Employees by Role',
              data,
              backgroundColor: ['rgba(30, 144, 255, 0.7)', 'rgba(255, 99, 132, 0.7)'],
              borderColor: ['rgba(30, 144, 255, 1)', 'rgba(255, 99, 132, 1)'],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: 'Employees Distibution by Branch & Role' }
          }
        }
      })
    }

    onMounted(async () => {
      await loadDashboardData()
      renderRevenueChart()
      renderEmployeeChart()
    })

    return {
      totalBranches,
      totalEmployees,
      monthlyRevenue,
      branches,
      staff,
      revenueChartRef,
      employeeChartRef
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
          <h3 class="text-slate-400 text-sm mb-1">Total Branches</h3>
          <p class="text-3xl font-bold text-white">{{ totalBranches }}</p>
        </div>

        <!-- Employees -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 class="text-slate-400 text-sm mb-1">Total Employees</h3>
          <p class="text-3xl font-bold text-white">{{ totalEmployees }}</p>
        </div>

        <!-- Revenue -->
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 class="text-slate-400 text-sm mb-1">Monthly Revenue</h3>
          <p class="text-3xl font-bold text-white">
            ₱{{ monthlyRevenue ? monthlyRevenue.toLocaleString("en-PH") : 0 }}
          </p>
        </div>
      </div>

      <!-- Branch Performance -->
      <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
        <h2 class="text-xl font-semibold text-white mb-6">Branch Revenue Performance</h2>
        <canvas ref="revenueChartRef"></canvas>
      </div>

      <!-- Employee Pie Chart -->
      <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 class="text-xl font-semibold text-white mb-6">Employees by Role</h2>
        <canvas ref="employeeChartRef"></canvas>
      </div>

    </main>
  </div>
</template>
