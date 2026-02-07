<script setup>

</script>

<template>
    <nav class="fixed top-0 inset-x-0 z-50 bg-gold-800/90 bg-gradient-to-r from-gold-800 via-gold-700 to-rose-800 backdrop-blur-md border-b border-gold-600/50 shadow-md">
    <div class="relative max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2 text-white hover:text-yellow-100 transition-colors rounded-md px-2 py-1 hover:bg-white/20">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span class="hidden sm:inline text-sm font-montserrat">Home</span>
      </router-link>

      <span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-playfair text-lg sm:text-xl tracking-wide">
        AesthetiCare
      </span>
      <div class="w-8"></div>
    </div>
  </nav>

  <div class="flex flex-col items-center py-12 px-6 mt-20">
    <div class="text-center mb-14">
      <h1 class="text-4xl font-playfair text-gold-700 mb-4">Choose Your Plan</h1>
      <p class="text-gray-700 max-w-2xl mx-auto">
        Start with a plan that suits your clinic. Upgrade anytime and enjoy full access to all features.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-7xl">

      <div class="cursor-pointer bg-gray-100/70 backdrop-blur-xl border border-gold-600 rounded-2xl p-10 text-center shadow-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] transition transform hover:scale-105">
        <h3 class="text-xl font-semibold text-gold-700 mb-2">Free Trial</h3>
        <p class="text-4xl font-bold mb-4">₱0</p>
        <p class="text-gray-600 mb-6">Try all Premium features for 14 days. No credit card required.</p>
        <ul class="text-left text-gray-700 space-y-2 text-sm">
          <li>✔ Everything in Premium</li>
          <li>✔ 14-day full access</li>
          <li>✔ Cancel anytime</li>
        </ul>
      </div>

      <div class="relative overflow-hidden group cursor-pointer
               bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600
               text-white rounded-2xl p-10 text-center
               transition transform hover:scale-105">
        <span
          class="pointer-events-none absolute inset-0
                 -translate-x-full group-hover:translate-x-full
                 bg-gradient-to-r from-transparent via-white/40 to-transparent
                 transition-transform duration-700 ease-out"
        ></span>

        <h3 class="text-xl font-semibold mb-2">Basic</h3>
        <p class="text-4xl font-bold mb-4">
          ₱499<span class="text-sm font-normal">/month</span>
        </p>
        <p class="text-yellow-100 mb-6">Perfect for single-branch clinics.</p>
        <ul class="text-left text-yellow-50 space-y-2 text-sm">
          <li>✔ Single Branch Management</li>
          <li>✔ Branch-level Staff Management</li>
          <li>✔ Appointments & Billings</li>
          <li>✔ Financial Reports</li>
          <li>✔ Mobile Application</li>
        </ul>
      </div>

      <div class="relative overflow-hidden group cursor-pointer
               bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700
               rounded-2xl p-10 text-center
               shadow-lg hover:shadow-[0_0_45px_rgba(255,215,0,1)]
               transition transform hover:scale-105
               border-2 border-yellow-400">
        <span class="pointer-events-none absolute inset-0
                 -translate-x-full group-hover:translate-x-full
                 bg-gradient-to-r from-transparent via-white/40 to-transparent
                 transition-transform duration-700 ease-out">
        </span>

        <div class="absolute top-4 right-4 z-10 bg-gold-700 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
          Recommended
        </div>

        <h3 class="text-xl font-semibold mb-2 text-white">Premium</h3>
        <p class="text-4xl font-bold mb-4 text-white">
          ₱999<span class="text-sm font-normal">/month</span>
        </p>
        <p class="text-yellow-100 mb-6">Best for multi-branch clinics and enterprises.</p>
        <ul class="text-left text-yellow-50 space-y-2 text-sm">
          <li>✔ Multi-Branch Management</li>
          <li>✔ Office & Branch-level Staff Management</li>
          <li>✔ Appointments & Billings</li>
          <li>✔ Chat Support</li>
          <li>✔ Online Consultation</li>
          <li>✔ Financial Reports</li>
          <li>✔ Mobile Application</li>
        </ul>
      </div>
    </div>
  </div>
</template>
