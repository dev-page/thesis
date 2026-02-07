<script>
import { ref, onMounted } from 'vue'
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { getApp } from 'firebase/app'
import OwnerSidebar from '@/components/sidebar/OwnerSidebar.vue'
import Modal from '@/components/common/Modal.vue'
import { toast } from 'vue3-toastify'

export default {
  name: 'OwnerStaff',
  components: { OwnerSidebar, Modal },
  setup() {
    const db = getFirestore(getApp())
    const staffList = ref([])

    // Static branch list - replace with dynamic data from Firestore if needed
    const branches = ref([
      'Downtown Clinic',
      'Uptown Clinic',
      'Westside Clinic',
      'Eastside Clinic'
    ])

    // Modal state
    const showModal = ref(false)
    const currentStaff = ref({
      id: null,
      name: '',
      email: '',
      role: '',
      level: 'Branch',
      branch: ''
    })
    
    // Load staff data from Firestore
    const loadStaff = async () => {
      const snapshot = await getDocs(collection(db, "staff"));
      staffList.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }

    onMounted(loadStaff)

    // Open Add Staff Modal
    const openAddModal = () => {
      currentStaff.value = {
        id: null,
        name: '',
        email: '',
        role: '',
        level: 'Branch',
        branch: ''
      }
      showModal.value = true
    }

    // Open Edit Staff Modal
    const openEditModal = (staff) => {
      currentStaff.value = { ...staff }
      showModal.value = true
    }

    // Delete Staff
    const deleteStaff = async (id) => {
      if (confirm('Are you sure you want to delete this staff member?')) {
        await deleteDoc(doc(db, "staff", id));
        staffList.value = staffList.value.filter((s) => s.id !== id)
        toast.success('Staff member deleted successfully!')
      }
    }

    // Save Staff (Add/Edit)
    const saveStaff = async () => {
      if (!currentStaff.value.name.trim() || !currentStaff.value.email.trim() || !currentStaff.value.role.trim()) {
        toast.error('Name, email, and role are required.')
        return
      }

      if (currentStaff.value.level === 'Branch' && !currentStaff.value.branch) {
        toast.error('Branch is required for branch-level staff.')
        return
      }

      if (currentStaff.value.id) {
        const staffRef = doc(db, "staff", currentStaff.value.id)
        await updateDoc(staffRef, {
          name: currentStaff.value.name,
          email: currentStaff.value.email,
          role: currentStaff.value.role,
          level: currentStaff.value.level,
          branch: currentStaff.value.branch
        })
        const index = staffList.value.findIndex((s) => s.id === currentStaff.value.id)
        if (index !== -1) staffList.value[index] = { ...currentStaff.value }
        toast.success('Staff member updated successfully!')
      } else {
        await addDoc(collection(db, "staff"), {
          name: currentStaff.value.name,
          email: currentStaff.value.email,
          role: currentStaff.value.role,
          level: currentStaff.value.level,
          branch: currentStaff.value.branch
        })
        staffList.value.push({ ...currentStaff.value, id: Date.now().toString() })
        toast.success('Staff member added successfully!')
      }

      showModal.value = false
    }

    return {
      staffList,
      branches,
      showModal,
      currentStaff,
      openAddModal,
      openEditModal,
      deleteStaff,
      saveStaff
    }
  }
}
</script>

<template>
  <div class="flex flex-col md:flex-row bg-slate-900 min-h-screen">
    <OwnerSidebar />

    <main class="flex-1 p-4 md:p-8">
      <!-- Header -->
      <div class="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-white mb-1">Staff Management</h1>
          <p class="text-slate-400 text-sm md:text-base">Manage staff accounts and roles at both office and branch level</p>
        </div>
        <button
          @click="openAddModal"
          class="bg-gold-600 hover:bg-gold-700 text-white px-4 py-2 rounded transition w-full md:w-auto"
        >
          Add Staff
        </button>
      </div>

      <!-- Staff Table -->
      <div class="bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700 overflow-x-auto">
        <table class="w-full text-left min-w-[500px] sm:min-w-[700px] border-collapse">
          <thead>
            <tr class="text-slate-400 uppercase text-xs sm:text-sm border-b border-slate-700">
              <th class="py-2 px-2 sm:py-3 sm:px-4">Name</th>
              <th class="py-2 px-2 sm:py-3 sm:px-4">Email</th>
              <th class="py-2 px-2 sm:py-3 sm:px-4">Role</th>
              <th class="py-2 px-2 sm:py-3 sm:px-4">Level</th>
              <th class="py-2 px-2 sm:py-3 sm:px-4">Branch</th>
              <th class="py-2 px-2 sm:py-3 sm:px-4">Actions</th>
            </tr>
          </thead>
          <tbody class="text-white">
            <tr
              v-for="staff in staffList"
              :key="staff.id"
              class="hover:bg-slate-700 transition-colors"
            >
              <td class="py-2 px-2 sm:py-3 sm:px-4 font-medium">{{ staff.name }}</td>
              <td class="py-2 px-2 sm:py-3 sm:px-4">{{ staff.email }}</td>
              <td class="py-2 px-2 sm:py-3 sm:px-4">{{ staff.role }}</td>
              <td class="py-2 px-2 sm:py-3 sm:px-4">{{ staff.level }}</td>
              <td class="py-2 px-2 sm:py-3 sm:px-4">{{ staff.level === 'Branch' ? staff.branch : '-' }}</td>
              <td class="py-2 px-2 sm:py-3 sm:px-4 flex flex-wrap gap-2">
                <button
                  @click="openEditModal(staff)"
                  class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition flex-1 sm:flex-none"
                >
                  Edit
                </button>
                <button
                  @click="deleteStaff(staff.id)"
                  class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition flex-1 sm:flex-none"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <Modal :isOpen="showModal" panelClass="bg-slate-800 text-white w-full max-w-md" @close="showModal = false">
        <template #header>
          <h2 class="text-xl font-semibold text-white">
            {{ currentStaff.id ? 'Edit Staff' : 'Add Staff' }}
          </h2>
        </template>

        <template #body>
          <form class="space-y-4">
            <div>
              <label class="block text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                v-model="currentStaff.name"
                placeholder="Enter full name"
                class="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-slate-400 mb-1">Email</label>
              <input
                type="email"
                v-model="currentStaff.email"
                placeholder="Enter email"
                class="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-slate-400 mb-1">Role</label>
              <input
                type="text"
                v-model="currentStaff.role"
                placeholder="Enter role (e.g., Nurse, Manager)"
                class="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-slate-400 mb-1">Level</label>
              <select
                v-model="currentStaff.level"
                class="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Branch</option>
                <option>Office</option>
              </select>
            </div>

            <div v-if="currentStaff.level === 'Branch'">
              <label class="block text-slate-400 mb-1">Branch</label>
              <select
                v-model="currentStaff.branch"
                class="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>Select branch</option>
                <option v-for="b in branches" :key="b">{{ b }}</option>
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
              @click="saveStaff"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              {{ currentStaff.id ? 'Update' : 'Add' }}
            </button>
          </div>
        </template>
      </Modal>
    </main>
  </div>
</template>
