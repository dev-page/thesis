<template>
  <div class="shift-list-page">
    <HRSidebar />

    <div class="shift-list-content">
      <h2>Shift List</h2>
      <button @click="showAddModal = true">+ Add Shift</button>

      <input v-model="searchQuery" placeholder="Search by branch or employee" />

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Start</th>
            <th>End</th>
            <th>Branch</th>
            <th>Employees</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="shift in filteredShifts" :key="shift.id">
            <td>{{ shift.date }}</td>
            <td>{{ shift.start }}</td>
            <td>{{ shift.end }}</td>
            <td>{{ shift.branch }}</td>
            <td>{{ shift.employees?.join(', ') }}</td>
            <td>
              <button @click="editShift(shift)">Edit</button>
              <button @click="assignEmployees(shift)">Assign</button>
              <button @click="deleteShift(shift.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Add Shift Modal -->
      <div v-if="showAddModal" class="modal">
        <h3>Add Shift</h3>
        <form @submit.prevent="addShift">
          <input type="date" v-model="currentShift.date" required />
          <input type="time" v-model="currentShift.start" required />
          <input type="time" v-model="currentShift.end" required />
          <input type="text" v-model="currentShift.branch" placeholder="Branch" required />
          <button type="submit">Save</button>
          <button type="button" @click="showAddModal = false">Cancel</button>
        </form>
      </div>

      <!-- Edit Shift Modal -->
      <div v-if="showEditModal" class="modal">
        <h3>Edit Shift</h3>
        <form @submit.prevent="saveShift">
          <input type="date" v-model="currentShift.date" required />
          <input type="time" v-model="currentShift.start" required />
          <input type="time" v-model="currentShift.end" required />
          <input type="text" v-model="currentShift.branch" required />
          <button type="submit">Update</button>
          <button type="button" @click="showEditModal = false">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { getFirestore, collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { getApp } from 'firebase/app'
import HRSidebar from '@/components/sidebar/HRSidebar.vue'
import { toast } from 'vue3-toastify'

export default {
  name: 'ShiftList',
  components: { HRSidebar },
  setup() {
    const db = getFirestore(getApp())
    const shifts = ref([])
    const searchQuery = ref('')
    const showAddModal = ref(false)
    const showEditModal = ref(false)
    const currentShift = ref({ id: null, date: '', start: '', end: '', branch: '', employees: [] })

    const loadShifts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "shifts"))
        shifts.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      } catch (err) {
        console.error("Error loading shifts:", err)
      }
    }

    onMounted(loadShifts)

    const filteredShifts = computed(() => {
      return shifts.value.filter(s =>
        s.branch?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        s.employees?.some(e => e.toLowerCase().includes(searchQuery.value.toLowerCase()))
      )
    })

    const addShift = async () => {
      try {
        await addDoc(collection(db, "shifts"), { ...currentShift.value })
        toast.success("Shift added successfully!")
        showAddModal.value = false
        await loadShifts()
      } catch (err) {
        toast.error("Failed to add shift.")
      }
    }

    const editShift = (shift) => {
      currentShift.value = { ...shift }
      showEditModal.value = true
    }

    const saveShift = async () => {
      try {
        const shiftRef = doc(db, "shifts", currentShift.value.id)
        await updateDoc(shiftRef, { ...currentShift.value })
        toast.success("Shift updated successfully!")
        showEditModal.value = false
        await loadShifts()
      } catch (err) {
        toast.error("Failed to update shift.")
      }
    }

    const deleteShift = async (id) => {
      try {
        await deleteDoc(doc(db, "shifts", id))
        toast.success("Shift deleted successfully!")
        await loadShifts()
      } catch (err) {
        toast.error("Failed to delete shift.")
      }
    }

    const assignEmployees = (shift) => {
      // Navigate to assignment page with shift ID
      window.location.href = `/shift-assignment/${shift.id}`
    }

    return {
      shifts, searchQuery, filteredShifts,
      showAddModal, showEditModal, currentShift,
      addShift, editShift, saveShift, deleteShift, assignEmployees
    }
  }
}
</script>

<style scoped>
.shift-list-page { display: flex; }
.shift-list-content { flex: 1; padding: 20px; }
.modal { background: #fff; padding: 20px; border: 1px solid #ccc; }
</style>