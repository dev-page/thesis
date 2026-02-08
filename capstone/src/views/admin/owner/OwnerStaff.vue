<script>
import { ref, onMounted } from 'vue'
import { getFirestore, collection, getDocs, updateDoc, doc, deleteDoc, setDoc } from 'firebase/firestore'
import { getApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import OwnerSidebar from '@/components/sidebar/OwnerSidebar.vue'
import Modal from '@/components/common/Modal.vue'
import { toast } from 'vue3-toastify'

export default {
  name: 'OwnerStaff',
  components: { OwnerSidebar, Modal },
  setup() {
    const db = getFirestore(getApp())
    const auth = getAuth(getApp())
    const staffList = ref([])
    const branches = ref([])

    // Modal state
    const showAddModal = ref(false)
    const showEditModal = ref(false)

    const currentStaff = ref({
      id: null,
      name: '',
      email: '',
      role: '',
      userType: 'Staff',
      level: '',
      branch: '',
      status: 'Active'
    })
    
    // Load staff data from Firestore
    const loadStaff = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      staffList.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).filter((user) => user.userType === 'Staff');
    }

    const loadBranches = async () => {
      const snapshot = await getDocs(collection(db, "clinics"));
      branches.value = snapshot.docs.map((doc) => doc.data().clinicBranch);
    }

    onMounted(() => {
      loadStaff()
      loadBranches()
    })

    // Open Add Staff Modal
    const openAddModal = () => {
      currentStaff.value = {
        id: null,
        name: '',
        email: '',
        role: '',
        userType: 'Staff',
        level: '',
        branch: ''
      }
      showAddModal.value = true
    }

    // Open Edit Staff Modal
    const openEditModal = (staff) => {
      currentStaff.value = { ...staff }
      showEditModal.value = true
    }

    const deactivateStaff = async (staff) => {
      if (confirm('Are you sure you want to deactivate this staff member?')) {
        const staffRef = doc(db, "users", staff.id)
        await updateDoc(staffRef, { status: 'Inactive' })
        staff.status = 'Inactive'
        toast.success(`${staff.name} has been deactivated and cannot log in.`)
      }
    }

    // Delete Staff
    const deleteStaff = async (staff) => {
      if (confirm('Are you sure you want to delete this staff member?')) {
        await deleteDoc(doc(db, "users", staff.id));
        staffList.value = staffList.value.filter((s) => s.id !== staff.id)
        toast.success('Staff member deleted successfully!')
      }
    }

    // Save Staff (Add/Edit)
    const saveStaff = async () => {
      if (!currentStaff.value.name.trim() || !currentStaff.value.email.trim() || !currentStaff.value.role.trim()) {
        toast.error('Name, email, and role are required.')
        return
      }

      const officeRoles = ['HR', 'CRM', 'Supply', 'Finance']
      const branchRoles = ['Cashier', 'Practitioner']

      if (officeRoles.includes(currentStaff.value.role)) {
        currentStaff.value.level = "Office"
      } else if (branchRoles.includes(currentStaff.value.role)) {
        currentStaff.value.level = "Branch"
      } else {
        currentStaff.value.level = "Other"
      } 

      if (currentStaff.value.level === 'Branch' && !currentStaff.value.branch) {
        toast.error('Branch is required for branch-level staff.')
        return
      }

      if (currentStaff.value.id) {
        const staffRef = doc(db, "users", currentStaff.value.id)
        await setDoc(staffRef, {
          name: currentStaff.value.name,
          email: currentStaff.value.email,
          role: currentStaff.value.role,
          userType: 'Staff',
          level: currentStaff.value.level,
          branch: currentStaff.value.branch,
          status: currentStaff.value.status
        }, { merge: true })
        toast.success('Staff member updated successfully!')
      } else {
        const defaultPassword = 'password123'
        const userCredential = await createUserWithEmailAndPassword(auth, currentStaff.value.email, defaultPassword) // In production, generate a secure random password and email it to the staff member
        const uid = userCredential.user.uid

        await setDoc(doc(db, "users", uid), {
          name: currentStaff.value.name,
          email: currentStaff.value.email,
          role: currentStaff.value.role,
          userType: 'Staff',
          level: currentStaff.value.level,
          branch: currentStaff.value.branch,
          status: currentStaff.value.status,
          createdAt: new Date()
        })
        staffList.value.push({ ...currentStaff.value, id: uid, userType: 'Staff', status: 'Active' })
        toast.success('Staff member added successfully!')
      }

      showAddModal.value = false
      showEditModal.value = false
    }

    return {
      staffList,
      branches,
      showAddModal,
      showEditModal,
      currentStaff,
      openAddModal,
      openEditModal,
      deactivateStaff,
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
              <th class="py-2 px-2 sm:py-3 sm:px-4">Status</th>
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
              <td class="py-2 px-2 sm:py-3 sm:px-4">
                <span :class="staff.status === 'Active' ? 'text-green-400' : 'text-red-400'">
                  {{ staff.status }}
              </span>
              </td>
              <td class="py-2 px-2 sm:py-3 sm:px-4 flex flex-wrap gap-2">
                <button
                  @click="openEditModal(staff)"
                  class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition flex-1 sm:flex-none"
                >
                  Edit
                </button>
                <button
                  @click="deactivateStaff(staff)"
                  class="bg-orange-600 hover:bg-red-700 text-white px-3 py-1 rounded transition flex-1 sm:flex-none"
                  v-if="staff.status === 'Active'"
                  >
                  Deactivate
                </button>
                <button
                  @click="deleteStaff(staff)"
                  class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition flex-1 sm:flex-none"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add Modal -->
      <Modal :isOpen="showAddModal" panelClass="bg-slate-800 text-white w-full max-w-md" @close="showAddModal = false">
        <template #header>
          <h2 class="text-xl font-semibold text-white">Add Staff</h2>
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
                placeholder="Enter role (e.g., HR, Cashier)"
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
              @click="showAddModal = false"
              class="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded transition"
            >
              Cancel
            </button>
            <button
              @click="saveStaff"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              Add
            </button>
          </div>
        </template>
      </Modal>

      <!-- Edit Modal -->
      <Modal :isOpen="showEditModal" panelClass="bg-slate-800 text-white w-full max-w-md" @close="showEditModal = false">
        <template #header>
          <h2 class="text-xl font-semibold text-white">Edit Staff</h2>
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
                placeholder="Enter role (e.g., HR, Cashier)"
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

            <div>
              <label class="block text-slate-400 mb-1">Status</label>
              <select
                v-model="currentStaff.status"
                class="w-full px-3 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </form>
        </template>

        <template #footer>
          <div class="flex flex-col sm:flex-row justify-end sm:space-x-2 space-y-2 sm:space-y-0">
            <button
              @click="showEditModal = false"
              class="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded transition"
            >
              Cancel
            </button>
            <button
              @click="saveStaff"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              Update
            </button>
          </div>
        </template>
      </Modal>
    </main>
  </div>
</template>
