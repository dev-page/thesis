<script setup>
import { ref } from 'vue'

const tabs = ['About', 'Services', 'Products', 'Reviews']
const activeTab = ref('About')

const services = ref([
  { id: 1, name: 'Facial Treatments', description: 'Deep cleansing and rejuvenating facials.' },
  { id: 2, name: 'Laser Therapy', description: 'Advanced laser treatments for scars and pigmentation.' },
  { id: 3, name: 'Botox & Fillers', description: 'Safe procedures for youthful skin.' },
])

const products = ref([
  { id: 1, name: 'Brightening Serum', price: 1200 },
  { id: 2, name: 'Hydrating Facial Mask', price: 800 },
  { id: 3, name: 'Anti-Aging Cream', price: 1500 },
  { id: 4, name: 'Sunscreen SPF 50', price: 950 },
])

const reviews = ref([
  { id: 1, author: 'Jane Doe', rating: 5, comment: 'Amazing service and results!' },
  { id: 2, author: 'John Smith', rating: 4, comment: 'Professional staff and great treatments.' },
  { id: 3, author: 'Emily Davis', rating: 5, comment: 'Highly recommend for skincare needs!' },
])
</script>

<template>
  <div class="bg-slate-50 min-h-screen">
    <!-- Header -->
    <div class="bg-fuchsia-50 shadow-md">
      <div class="container mx-auto px-6 py-8 flex items-center gap-6">
        <router-link
          to="/customer/home"
          class="flex items-center text-gray-600 hover:text-gold-700 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="hidden sm:inline font-medium">Home</span>
        </router-link>

        <div class="w-28 h-28 rounded-full overflow-hidden border-2 border-gold-500">
          <img
            src="https://via.placeholder.com/150"
            alt="Center Profile"
            class="w-full h-full object-cover"
          />
        </div>

        <div>
          <h1 class="text-2xl font-bold text-charcoal-800">Glow Aesthetic Center</h1>
          <p class="text-gray-600">Dasmariñas, Cavite</p>
          <span
            class="inline-block mt-2 px-3 py-1 bg-gold-100 text-gold-700 rounded-full text-sm font-medium"
          >
            ★ 4.9 Rating
          </span>
        </div>
      </div>


      <div class="border-t border-gray-200">
        <nav class="container mx-auto px-6 flex gap-8 text-gray-600 font-medium">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="['py-4 border-b-2 transition',
              activeTab === tab ? 'border-gold-600 text-gold-700' : 'border-transparent hover:text-gold-600']">
            {{ tab }}
          </button>
        </nav>
      </div>
    </div>

    <div class="container mx-auto px-6 py-10">
      <div v-if="activeTab === 'About'" class="space-y-6">
        <h2 class="text-2xl font-bold text-charcoal-800">About Us</h2>
        <p class="text-gray-700 leading-relaxed">
          Glow Aesthetic Center is dedicated to providing premium skincare and aesthetic treatments.
          Our team of licensed professionals ensures safe, effective, and personalized care for every client.
        </p>
      </div>

      <div v-if="activeTab === 'Services'">
        <h2 class="text-2xl font-bold text-charcoal-800 mb-6">Our Services</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="service in services"
            :key="service.id"
            class="bg-white rounded-xl shadow hover:shadow-lg transition p-6"
          >
            <h3 class="text-lg font-semibold text-charcoal-800">{{ service.name }}</h3>
            <p class="text-gray-600 mt-2">{{ service.description }}</p>
            <button class="mt-4 px-4 py-2 bg-gold-700 text-white rounded-lg hover:bg-gold-800 transition">
              Book Now
            </button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'Products'">
        <h2 class="text-2xl font-bold text-charcoal-800 mb-6">Our Products</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          <div
            v-for="product in products"
            :key="product.id"
            class="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <div class="h-40 bg-gray-200 flex items-center justify-center">
              <span class="text-gray-400">Image</span>
            </div>
            <div class="p-4">
              <h3 class="text-sm font-semibold text-charcoal-800">{{ product.name }}</h3>
              <p class="text-gold-700 font-bold mt-2">₱{{ product.price }}</p>
              <button class="mt-3 w-full px-4 py-2 bg-gold-700 text-white rounded-lg hover:bg-gold-800 transition">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'Reviews'">
        <h2 class="text-2xl font-bold text-charcoal-800 mb-6">Reviews</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          <div
            v-for="review in reviews"
            :key="review.id"
            class="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <div class="p-4">
              <h3 class="text-sm font-semibold text-charcoal-800">{{ review.author }}</h3>
              <p class="text-gold-700 font-bold mt-2">⭐ {{ review.rating }}/5</p>
              <p class="text-gray-600 mt-2">{{ review.comment }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>