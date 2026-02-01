<template>
  <div class="min-h-screen bg-gradient-to-br from-gold-100 via-cream-200 to-rose-100 flex flex-col items-center py-16 px-4">
+
    <div class="text-center mb-12">
      <h1 class="text-3xl sm:text-4xl font-playfair text-gold-700 mb-4">Choose Your Plan</h1>
      <p class="text-gray-700 max-w-xl mx-auto">
        Start with a plan that suits your clinic. Upgrade anytime and enjoy full access to all features.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">

      <div
        @click="selectPlan('Free Trial')"
        class="cursor-pointer bg-white/50 backdrop-blur-xl border border-white/40 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition transform hover:scale-105"
      >
        <h3 class="text-lg font-semibold text-gold-700 mb-2">Free Trial</h3>
        <p class="text-3xl font-bold mb-4">₱0</p>
        <p class="text-gray-600">Try all features for 7 days. No credit card required.</p>
      </div>

      <div
        @click="selectPlan('Basic')"
        class="cursor-pointer bg-white/50 backdrop-blur-xl border border-white/40 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition transform hover:scale-105"
      >
        <h3 class="text-lg font-semibold text-charcoal-700 mb-2">Basic</h3>
        <p class="text-3xl font-bold mb-4">₱499<span class="text-sm font-normal">/month</span></p>
        <p class="text-gray-600">One branch only. Includes essential features for your clinic.</p>
      </div>

      <div
        @click="selectPlan('Premium')"
        class="cursor-pointer bg-white/50 backdrop-blur-xl border border-white/40 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition transform hover:scale-105 relative"
      >
        <div class="absolute top-4 right-4 bg-gold-700 text-white text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wide">Recommended</div>
        <h3 class="text-lg font-semibold text-charcoal-700 mb-2">Premium</h3>
        <p class="text-3xl font-bold mb-4">₱999<span class="text-sm font-normal">/month</span></p>
        <p class="text-gray-600">Multiple branches. Full features including advanced analytics.</p>
      </div>

    </div>

    <button
      @click="proceedToFreeTrial"
      class="mt-12 w-full max-w-md py-3 rounded-xl bg-gold-700 text-white font-semibold text-lg hover:bg-gold-800 transition transform hover:scale-105"
    >
      Proceed to 14-day Free Trial
    </button>

  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const selectPlan = (plan) => {
  router.push("/subscription");
};

import { defineEmits } from "vue";

const emit = defineEmits(["close"]);

const proceedToFreeTrial = () => {
  emit("close");

  router.push("/clinic/register");
};
</script>

<style scoped>
button:hover {
  transform: scale(1.02);
  transition: transform 0.2s;
}
</style>
