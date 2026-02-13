<script>
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import CustomerSidebar from '@/components/sidebar/CustomerSidebar.vue'
import Modal from '@/components/common/Modal.vue'

export default {
  name: 'MyAppointments',
  components: { CustomerSidebar, Modal },
    setup() {
        const appointments = ref([
            { id: 1, clinic: 'Downtown Clinic', service: 'Facial Treatment', date: '2026-02-10', time: '2:00 PM', status: 'Upcoming' },
            { id: 2, clinic: 'Uptown Clinic', service: 'Laser Hair Removal', date: '2026-01-28', time: '10:00 AM', status: 'Completed' },
            { id: 3, clinic: 'Westside Clinic', service: 'Botox Session', date: '2026-01-15', time: '4:00 PM', status: 'Completed' },
            { id: 4, clinic: 'Eastside Clinic', service: 'Skin Consultation', date: '2026-02-05', time: '11:00 AM', status: 'Canceled' },
            { id: 5, clinic: 'North Clinic', service: 'Chemical Peel', date: '2026-02-12', time: '1:00 PM', status: 'Upcoming' },
        ])

        const showModal = ref(false) 
        const showViewModal = ref(false)
        const selectedAppointment = ref(null)
        const newSchedule = ref('')

        const availableSlots = ref([
            '2026-02-15 • 10:00 AM',
            '2026-02-15 • 1:00 PM',
            '2026-02-16 • 3:00 PM',
            '2026-02-17 • 11:00 AM'
        ])

        const openViewModal = (appt) => {
            selectedAppointment.value = appt
            showViewModal.value = true
        }

        const openRescheduleModal = (appt) => {
            if (appt.status !== 'Upcoming') return
            selectedAppointment.value = appt
            newSchedule.value = ''
            showModal.value = true
        }

        const confirmReschedule = () => {
            if (!newSchedule.value) {
            toast.error('Please select a new schedule.')
            return
            }

            const [date, time] = newSchedule.value.split(' • ')
            selectedAppointment.value.date = date
            selectedAppointment.value.time = time
            selectedAppointment.value.status = 'Rescheduled'

            toast.success(`Rescheduled to ${newSchedule.value}`)
            showModal.value = false
        }

        const cancelAppointment = (appt) => {
            if (appt.status !== 'Upcoming') return
            appt.status = 'Canceled'
            toast.success(`Canceled appointment for ${appt.service}`)
        }

        return {
            appointments,
            showModal,
            showViewModal,
            selectedAppointment,
            newSchedule,
            availableSlots,
            openViewModal,
            openRescheduleModal,
            confirmReschedule,
            cancelAppointment
        }
    }
}
</script>

<template>
  <div class="flex bg-slate-900 min-h-screen">
    <CustomerSidebar />

    <main class="flex-1 p-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">My Appointments</h1>
        <p class="text-slate-400">View and manage your bookings</p>
      </div>

      <div class="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 class="text-xl font-semibold text-white mb-6">Appointment List</h2>

        <table class="w-full text-left text-sm text-slate-300">
          <thead>
            <tr class="border-b border-slate-700 text-slate-400">
              <th class="py-3 px-4">Clinic</th>
              <th class="py-3 px-4">Service</th>
              <th class="py-3 px-4">Date</th>
              <th class="py-3 px-4">Time</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="appt in appointments"
              :key="appt.id"
              class="border-b border-slate-700 hover:bg-slate-700 transition"
            >
              <td class="py-3 px-4">{{ appt.clinic }}</td>
              <td class="py-3 px-4">{{ appt.service }}</td>
              <td class="py-3 px-4">{{ appt.date }}</td>
              <td class="py-3 px-4">{{ appt.time }}</td>
              <td class="py-3 px-4">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    appt.status === 'Upcoming'
                      ? 'bg-blue-500/20 text-blue-400'
                      : appt.status === 'Rescheduled'
                      ? 'bg-purple-500/20 text-purple-400'
                      : appt.status === 'Completed'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  ]"
                >
                  {{ appt.status }}
                </span>
              </td>
              <td class="py-3 px-4 space-x-2">
                <button
                @click="openViewModal(appt)"
                class="px-3 py-1 rounded-md text-sm font-medium
                        bg-blue-500 text-white hover:bg-blue-600"
                >
                View
                </button>


                <button
                  @click="openRescheduleModal(appt)"
                  :disabled="appt.status !== 'Upcoming'"
                  class="px-3 py-1 rounded-md text-sm font-medium transition
                         bg-yellow-500 text-white hover:bg-yellow-600
                         disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed">
                  Reschedule
                </button>

                <button
                  @click="cancelAppointment(appt)"
                  :disabled="appt.status !== 'Upcoming'"
                  class="px-3 py-1 rounded-md text-sm font-medium transition
                         bg-red-500 text-white hover:bg-red-600
                         disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed">
                  Cancel
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    <!--Modal for viewing appointment details-->
    <Modal
    :isOpen="showViewModal"
    panelClass="bg-slate-800 text-white w-full max-w-md"
    @close="showViewModal = false"
    >
    <template #header>
        <h2 class="text-xl font-semibold text-white">Appointment Details</h2>
    </template>

    <template #body>
        <div v-if="selectedAppointment" class="space-y-4">
        <div>
            <label class="block text-slate-400 mb-1">Clinic</label>
            <p class="px-3 py-2 rounded-lg bg-slate-700 text-slate-300 border border-slate-600">
            {{ selectedAppointment.clinic }}
            </p>
        </div>

        <div>
            <label class="block text-slate-400 mb-1">Service</label>
            <p class="px-3 py-2 rounded-lg bg-slate-700 text-slate-300 border border-slate-600">
            {{ selectedAppointment.service }}
            </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
            <label class="block text-slate-400 mb-1">Date</label>
            <p class="px-3 py-2 rounded-lg bg-slate-700 text-slate-300 border border-slate-600">
                {{ selectedAppointment.date }}
            </p>
            </div>
            <div>
            <label class="block text-slate-400 mb-1">Time</label>
            <p class="px-3 py-2 rounded-lg bg-slate-700 text-slate-300 border border-slate-600">
                {{ selectedAppointment.time }}
            </p>
            </div>
        </div>

        <div>
            <label class="block text-slate-400 mb-1">Status</label>
            <p class="px-3 py-2 rounded-lg bg-slate-700 text-slate-300 border border-slate-600">
            {{ selectedAppointment.status }}
            </p>
        </div>
        </div>
    </template>

    <template #footer>
        <div class="flex justify-end">
        <button
            @click="showViewModal = false"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
            Close
        </button>
        </div>
    </template>
    </Modal>

  <!--Modal for rescheduling-->
    <Modal 
        :isOpen="showModal" 
        panelClass="bg-slate-800 text-white w-full max-w-md" 
        @close="showModal = false"
      >
        <template #header>
          <h2 class="text-xl font-semibold text-white">Reschedule Appointment</h2>
        </template>

        <template #body>
          <form class="space-y-4">
            <div>
              <label class="block text-slate-400 mb-1">Clinic</label>
              <input
                type="text"
                v-model="selectedAppointment.clinic"
                disabled
                class="w-full px-3 py-2 rounded-lg bg-slate-700 text-slate-300 border border-slate-600"
              />
            </div>

            <div>
              <label class="block text-slate-400 mb-1">Service</label>
              <input
                type="text"
                v-model="selectedAppointment.service"
                disabled
                class="w-full px-3 py-2 rounded-lg bg-slate-700 text-slate-300 border border-slate-600"
              />
            </div>

            <div>
              <label class="block text-slate-400 mb-1">Available Schedules</label>
              <select
                v-model="newSchedule"
                class="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option disabled value="">Select a new schedule</option>
                <option v-for="slot in availableSlots" :key="slot" :value="slot">
                  {{ slot }}
                </option>
              </select>
            </div>
          </form>
        </template>

        <template #footer>
          <div class="flex flex-col sm:flex-row justify-end sm:space-x-2 space-y-2 sm:space-y-0">
            <button
              @click="showModal = false"
              class="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded transition"
            >
              Cancel
            </button>
            <button
              @click="confirmReschedule"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              Confirm
            </button>
          </div>
        </template>
    </Modal>
    </main>
  </div>
</template>