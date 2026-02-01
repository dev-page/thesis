<template>
  <nav class="fixed top-0 inset-x-0 z-50 bg-gradient-to-r from-gold-50 via-cream-100 to-gold-200 backdrop-blur-xl border-b border-gold-400/30">
      <div class="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 h-16">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-gold-500 to-gold-700"></div>
          <span class="text-lg tracking-wide text-charcoal-900">AesthetiCare</span>
        </div>

        <div class="hidden md:flex items-center gap-6 lg:gap-10">
          <ul class="flex items-center gap-6 lg:gap-10 text-[11px] tracking-[0.2em] uppercase text-charcoal-600">
            <li>
              <router-link to="/"
                class="relative text-charcoal-700 hover:text-gold-700 hover:font-bold transition-all duration-300
                      before:absolute before:left-0 before:bottom-[-4px] before:w-0 before:h-[2px] before:bg-gold-700
                      before:transition-all before:duration-300 hover:before:w-full"
              >
                Homepage
              </router-link>
            </li>
          </ul>

          <div class="relative inline-block text-left">
            <button
              @click="toggleDropdown"
              class="inline-flex justify-center w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gold-700 text-gold-700 text-xs sm:text-sm tracking-widest uppercase hover:bg-gold-700 hover:text-white transition focus:outline-none"
            >
              Guest Account
              <svg
                class="ml-2 -mr-1 h-4 w-4 text-gold-700 group-hover:text-white transition"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              v-show="isOpen"
              class="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
            >
              <div class="py-1">
                <button
                  @click="select('Guest Account')"
                  class="w-full text-left px-4 py-2 text-sm text-gold-700 bg-gold-50 font-medium"
                >
                  Guest Account
                </button>
                <router-link
                  to="/login"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gold-100 hover:text-gold-700 transition"
                >
                  Login
                </router-link>
                <router-link
                  to="/register"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gold-100 hover:text-gold-700 transition"
                >
                  Register
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

<main class="max-w-7xl mx-auto px-6 py-8 pt-24">
  <div class="bg-white rounded-2xl shadow-md p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
    <div class="md:col-span-2 relative">
      <input
        v-model="search"
        type="text"
        placeholder="Search aesthetic center or service..."
        class="peer input h-14 w-full pl-12 pr-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition"
      />
      <svg
        class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"/>
      </svg>
    </div>

    <select v-model="city" class="input h-14 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition">
      <option value="">All Cities</option>
      <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
    </select>

    <select v-model="service" class="input h-14 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition">
      <option value="">All Services</option>
      <option v-for="s in services" :key="s" :value="s">{{ s }}</option>
    </select>
  </div>

  <div v-if="filteredCenters.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="center in filteredCenters"
      :key="center.id"
      class="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transform hover:-translate-y-1 transition"
    >
      <div class="h-44 w-full bg-gray-200 rounded-t-2xl overflow-hidden">
        <!--Image dito-->
      </div>

      <div class="p-5 flex flex-col justify-between h-60">
        <div>
          <h3 class="text-xl font-semibold text-charcoal-800">{{ center.name }}</h3>
          <p class="text-gray-500 mt-1">{{ center.city }}, Cavite</p>

          <div class="flex flex-wrap gap-2 mt-3">
            <span
              v-for="tag in center.services"
              :key="tag"
              class="text-xs px-2 py-1 bg-gold-100 text-gold-700 rounded-full font-medium"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between mt-4">
          <span class="flex items-center text-sm text-gray-500">
            <svg
              class="w-4 h-4 mr-1 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.95c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.285-3.95a1 1 0 00-.364-1.118L2.075 9.377c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.951-.69l1.285-3.95z"/>
            </svg>
            {{ center.rating }}
          </span>

          <button
            class="px-4 py-2 bg-gold-700 text-white rounded-xl font-medium hover:bg-gold-800 transition w-28 sm:w-auto"
          >
            View Center
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- No Results -->
  <div v-else class="text-center py-20 text-gray-400">
    <svg class="mx-auto w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M9 17v-4a4 4 0 018 0v4M5 21h14a2 2 0 002-2v-5a7 7 0 00-14 0v5a2 2 0 002 2z"/>
    </svg>
    No aesthetic centers found.
  </div>
</main>

</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const isOpen = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const select = (option) => {
  // Do nothing when Guest Account is selected
  if (option === 'Guest Account') {
    isOpen.value = false
    return
  }
  alert(`Selected: ${option}`)
  isOpen.value = false
}
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}
onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
})

const search = ref('')
const city = ref('')
const service = ref('')

const centers = ref([
  {
    id: 1,
    name: 'Glow Aesthetic Clinic',
    city: 'Bacoor',
    services: ['Facial', 'Laser', 'Botox'],
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Pure Skin Studio',
    city: 'Imus',
    services: ['Facial', 'Whitening'],
    rating: 4.6,
  },
  {
    id: 3,
    name: 'Radiance Medical Aesthetics',
    city: 'Dasmariñas',
    services: ['Laser', 'Body Contouring'],
    rating: 4.9,
  },
])

const cities = [...new Set(centers.value.map(c => c.city))]
const services = [
  ...new Set(centers.value.flatMap(c => c.services)),
]

const filteredCenters = computed(() => {
  return centers.value.filter(center => {
    const matchesSearch =
      center.name.toLowerCase().includes(search.value.toLowerCase()) ||
      center.services.some(s =>
        s.toLowerCase().includes(search.value.toLowerCase())
      )

    const matchesCity = city.value
      ? center.city === city.value
      : true

    const matchesService = service.value
      ? center.services.includes(service.value)
      : true

    return matchesSearch && matchesCity && matchesService
  })
})
</script>
