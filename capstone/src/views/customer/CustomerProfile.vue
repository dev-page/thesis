<script>
import { ref, computed, onMounted } from 'vue'
import CustomerSidebar from '@/components/sidebar/CustomerSidebar.vue'
import { toast } from 'vue3-toastify'
import Swal from 'sweetalert2'

/* Firebase */
import { getAuth } from 'firebase/auth'
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore'
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage'

export default {
  name: 'CustomerProfile',
  components: { CustomerSidebar },

  setup() {
    const auth = getAuth()
    const db = getFirestore()
    const storage = getStorage()

    const loading = ref(true)
    const saving = ref(false)

    const customer = ref({
      name: '',
      email: '',
      phone: '',
      address: '',
      description: '',
      profilePicture: ''
    })

    /* ===============================
       Computed
    =============================== */

    const userInitial = computed(() => {
      return customer.value.name
        ? customer.value.name.charAt(0).toUpperCase()
        : '?'
    })

    /* ===============================
       Load Profile
    =============================== */

    const loadCustomerProfile = async () => {
      const user = auth.currentUser
      if (!user) {
        loading.value = false
        return
      }

      try {
        const userRef = doc(db, 'users', user.uid)
        const snap = await getDoc(userRef)

        if (snap.exists()) {
          const data = snap.data()

          customer.value = {
            name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
            email: user.email || '',
            phone: data.phone || '',
            address: data.address || '',
            description: data.description || '',
            profilePicture: data.profilePicture || ''
          }
        } else {
          customer.value.email = user.email || ''
        }
      } catch (error) {
        console.error(error)
        toast.error('Failed to load profile')
      } finally {
        loading.value = false
      }
    }

    onMounted(loadCustomerProfile)

    const handleFileUpload = async (event) => {
      const file = event.target.files[0]
      if (!file) return

      const user = auth.currentUser
      if (!user) return

      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file')
        return
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image must be less than 2MB')
        return
      }

      try {
        const imageRef = storageRef(storage, `profilePictures/${user.uid}`)
        await uploadBytes(imageRef, file)

        const downloadURL = await getDownloadURL(imageRef)
        customer.value.profilePicture = downloadURL

        toast.success('Profile picture updated!')
      } catch (error) {
        console.error(error)
        toast.error('Image upload failed')
      }
    }

const saveCustomerProfile = async () => {
  const user = auth.currentUser
  if (!user) {
    Swal.fire({
      icon: 'error',
      title: 'Not Authenticated',
      text: 'Please login again.'
    })
    return
  }

  const confirm = await Swal.fire({
    title: 'Save Changes?',
    text: 'Do you want to update your profile information?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, save it',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33'
  })

  if (!confirm.isConfirmed) return

  saving.value = true

  try {
    const [firstName, ...rest] = customer.value.name.trim().split(' ')
    const lastName = rest.join(' ')

    const userRef = doc(db, 'users', user.uid)

    await setDoc(
      userRef,
      {
        firstName: firstName || '',
        lastName: lastName || '',
        email: customer.value.email || user.email || '',
        phone: customer.value.phone || '',
        address: customer.value.address || '',
        description: customer.value.description || '',
        profilePicture: customer.value.profilePicture || '',
        updatedAt: serverTimestamp()
      },
      { merge: true }
    )

    await Swal.fire({
      icon: 'success',
      title: 'Profile Updated!',
      text: 'Your changes have been saved successfully.',
      timer: 2000,
      showConfirmButton: false
    })

  } catch (error) {
    console.error(error)

    Swal.fire({
      icon: 'error',
      title: 'Update Failed',
      text: 'Something went wrong while saving your profile.'
    })
  } finally {
    saving.value = false
  }
}

    return {
      customer,
      loading,
      saving,
      userInitial,
      handleFileUpload,
      saveCustomerProfile
    }
  }
}
</script>



<template>
  <div class="flex bg-slate-900 min-h-screen">
    <CustomerSidebar />

    <main class="flex-1 flex items-center justify-center p-4">
      <div class="w-full max-w-2xl bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h1 class="text-3xl font-bold text-white mb-2 text-center">Customer Profile</h1>
        <p class="text-slate-400 text-center mb-6">Edit and save your information</p>

        <form @submit.prevent="saveCustomerProfile" class="space-y-6">
          <div class="flex flex-col items-center mb-6">
            <div class="relative w-32 h-32 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center">
              <img
                v-if="customer.profilePicture"
                :src="customer.profilePicture"
                alt="Customer Profile"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-white font-bold text-3xl">{{ customer.name.charAt(0) }}</span>
            </div>
            <label class="mt-3 cursor-pointer text-sm text-purple-400 hover:text-purple-300 transition-colors">
              Upload Profile Picture
              <input type="file" @change="handleFileUpload" class="hidden" />
            </label>
          </div>

          <div>
            <label class="block text-slate-400 text-sm mb-2">Name</label>
            <input
              v-model="customer.name"
              type="text"
              placeholder="Enter full name"
              class="w-full rounded-lg p-3 bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label class="block text-slate-400 text-sm mb-2">Email</label>
            <input
              v-model="customer.email"
              type="email"
              placeholder="customer@example.com"
              class="w-full rounded-lg p-3 bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label class="block text-slate-400 text-sm mb-2">Phone</label>
            <input
              v-model="customer.phone"
              type="tel"
              placeholder="+1 234 567 890"
              class="w-full rounded-lg p-3 bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label class="block text-slate-400 text-sm mb-2">Address</label>
            <textarea
              v-model="customer.address"
              rows="3"
              placeholder="Enter customer address"
              class="w-full rounded-lg p-3 bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block text-slate-400 text-sm mb-2">Description</label>
            <textarea
              v-model="customer.description"
              rows="4"
              placeholder="Brief description"
              class="w-full rounded-lg p-3 bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none">
            </textarea>
          </div>

          <div class="pt-4">
            <button
              type="submit"
              class="w-full bg-gold-600 hover:bg-gold-500 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
input[type="file"]::file-selector-button {
  display: none;
}
</style>