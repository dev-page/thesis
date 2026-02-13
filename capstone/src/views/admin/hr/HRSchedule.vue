<script>
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import Swal from 'sweetalert2'

export default {
  name: 'CreateSchedule',
  setup() {
    const branches = ref(['Branch A', 'Branch B', 'Branch C'])
    const staffList = ref([
      { id: 1, name: 'Alice', role: 'Cashier', level: 'Branch', branch: 'Branch A' },
      { id: 2, name: 'Bob', role: 'Practitioner', level: 'Branch', branch: 'Branch B' },
      { id: 3, name: 'Clara', role: 'HR', level: 'Office' }
    ])

    const schedule = ref({
      staffId: '',
      branch: '',
      date: '',
      startTime: '',
      endTime: ''
    })

    const saveSchedule = async () => {
      if (!schedule.value.staffId || !schedule.value.date || !schedule.value.startTime || !schedule.value.endTime) {
        toast.error('All fields are required.')
        return
      }

      const staff = staffList.value.find(s => s.id === parseInt(schedule.value.staffId))
      if (!staff) {
        toast.error('Invalid staff selected.')
        return
      }

      if (staff.level === 'Branch' && staff.branch !== schedule.value.branch) {
        toast.error(`${staff.name} belongs to ${staff.branch}, not ${schedule.value.branch}.`)
        return
      }

      if (schedule.value.startTime >= schedule.value.endTime) {
        toast.error('End time must be after start time.')
        return
      }

      const result = await Swal.fire({
        title: 'Confirm Schedule',
        text: `Assign ${staff.name} (${staff.role}) to ${schedule.value.branch} on ${schedule.value.date} from ${schedule.value.startTime} to ${schedule.value.endTime}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#aaa',
        confirmButtonText: 'Yes, assign',
        cancelButtonText: 'Cancel'
      })

      if (!result.isConfirmed) {
        toast.info('Schedule creation cancelled.')
        return
      }

      // Here you would save to Firestore or your backend
      toast.success(`Schedule assigned to ${staff.name}!`)
      schedule.value = { staffId: '', branch: '', date: '', startTime: '', endTime: '' }
    }

    return { branches, staffList, schedule, saveSchedule }
  }
}
</script>

<template>
  <div class="bg-slate-800 p-6 rounded-lg text-white max-w-lg mx-auto">
    <h2 class="text-xl font-semibold mb-4">Create Schedule</h2>

    <div class="space-y-4">
      <!-- Staff -->
      <div>
        <label class="block text-slate-400 mb-1">Staff</label>
        <select v-model="schedule.staffId"
          class="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600">
          <option disabled value="">Select staff</option>
          <option v-for="s in staffList" :key="s.id" :value="s.id">
            {{ s.name }} ({{ s.role }})
          </option>
        </select>
      </div>

      <!-- Branch -->
      <div>
        <label class="block text-slate-400 mb-1">Branch</label>
        <select v-model="schedule.branch"
          class="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600">
          <option disabled value="">Select branch</option>
          <option v-for="b in branches" :key="b">{{ b }}</option>
        </select>
      </div>

      <!-- Date -->
      <div>
        <label class="block text-slate-400 mb-1">Date</label>
        <input type="date" v-model="schedule.date"
          class="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600" />
      </div>

      <!-- Time -->
      <div class="flex gap-2">
        <div class="flex-1">
          <label class="block text-slate-400 mb-1">Start Time</label>
          <input type="time" v-model="schedule.startTime"
            class="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600" />
        </div>
        <div class="flex-1">
          <label class="block text-slate-400 mb-1">End Time</label>
          <input type="time" v-model="schedule.endTime"
            class="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600" />
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex justify-end mt-6">
      <button @click="saveSchedule"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
        Save Schedule
      </button>
    </div>
  </div>
</template>