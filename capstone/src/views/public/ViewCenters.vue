<template>
  <div class="min-h-screen bg-gray-50">
    <!-- HEADER -->
    <header class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-6 py-6">
        <h1 class="text-3xl font-semibold">
          Aesthetic Centers in <span class="text-gold">Cavite</span>
        </h1>
        <p class="text-gray-600 mt-1">
          Discover, compare, and book aesthetic services near you
        </p>
      </div>
    </header>

    <!-- FILTERS -->
    <section class="bg-white border-b">
      <div
        class="max-w-7xl mx-auto px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <!-- Search -->
        <input
          v-model="search"
          type="text"
          placeholder="Search aesthetic center or service..."
          class="input md:col-span-2"
        />

        <!-- City Filter -->
        <select v-model="city" class="input">
          <option value="">All Cities</option>
          <option v-for="c in cities" :key="c" :value="c">
            {{ c }}
          </option>
        </select>

        <!-- Service Filter -->
        <select v-model="service" class="input">
          <option value="">All Services</option>
          <option v-for="s in services" :key="s" :value="s">
            {{ s }}
          </option>
        </select>
      </div>
    </section>

    <!-- FEED -->
    <main class="max-w-7xl mx-auto px-6 py-8">
      <div
        v-if="filteredCenters.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="center in filteredCenters"
          :key="center.id"
          class="bg-white border rounded-lg overflow-hidden hover:shadow-md transition"
        >
          <!-- Image -->
          <div class="h-40 bg-gray-200"></div>

          <!-- Content -->
          <div class="p-4">
            <h3 class="text-lg font-semibold">
              {{ center.name }}
            </h3>

            <p class="text-sm text-gray-600 mt-1">
              {{ center.city }}, Cavite
            </p>

            <div class="flex flex-wrap gap-2 mt-3">
              <span
                v-for="tag in center.services"
                :key="tag"
                class="text-xs px-2 py-1 bg-gray-100 rounded"
              >
                {{ tag }}
              </span>
            </div>

            <div class="flex items-center justify-between mt-4">
              <span class="text-sm text-gray-500">
                ⭐ {{ center.rating }}
              </span>

              <button
                class="text-sm text-gold border border-gold px-4 py-1 hover:bg-gold hover:text-white transition"
              >
                View Center
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- EMPTY STATE -->
      <div v-else class="text-center py-20 text-gray-500">
        No aesthetic centers found.
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

/* Filters */
const search = ref('')
const city = ref('')
const service = ref('')

/* Static data (replace with API later) */
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

/* Filter options */
const cities = [...new Set(centers.value.map(c => c.city))]
const services = [
  ...new Set(centers.value.flatMap(c => c.services)),
]

/* Computed Filtered Results */
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
