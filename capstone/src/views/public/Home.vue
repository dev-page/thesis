<template>
  <div class="bg-gradient-to-br from-gold-100 via-cream-200 to-gold-300 text-charcoal-800 overflow-x-hidden">
    <nav class="fixed top-0 inset-x-0 z-50 bg-gradient-to-r from-gold-50 via-cream-100 to-gold-200 backdrop-blur-xl border-b border-gold-400/30">
      <div class="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 h-16">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-gold-500 to-gold-700"></div>
          <span class="text-lg tracking-wide text-charcoal-900">AesthetiCare</span>
        </div>

        <ul class="hidden md:flex items-center gap-6 lg:gap-10 text-[11px] tracking-[0.2em] uppercase text-charcoal-600">
          <li>
            <a class="relative text-charcoal-700 hover:text-gold-700 hover:font-bold transition-all duration-300
                      before:absolute before:left-0 before:bottom-[-4px] before:w-0 before:h-[2px] before:bg-gold-700
                      before:transition-all before:duration-300 hover:before:w-full">
              Features
            </a>
          </li>

          <li>
            <a class="relative text-charcoal-700 hover:text-gold-700 hover:font-bold transition-all duration-300
                      before:absolute before:left-0 before:bottom-[-4px] before:w-0 before:h-[2px] before:bg-gold-700
                      before:transition-all before:duration-300 hover:before:w-full">
              Solutions
            </a>
          </li>
          <li>
            <router-link to="/subscription" class="relative text-charcoal-700 hover:text-gold-700 hover:font-bold transition-all duration-300
                      before:absolute before:left-0 before:bottom-[-4px] before:w-0 before:h-[2px] before:bg-gold-700
                      before:transition-all before:duration-300 hover:before:w-full">
              Pricing
            </router-link>
          </li>
          <li>
            <router-link to="/centers"
              class="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-gold-500 text-gold-500 font-medium
                    hover:bg-gold-500 hover:text-white transition-all duration-300"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11a2 2 0 110-4 2 2 0 010 4z"
                />
              </svg>
              Centers
            </router-link>
          </li>
        </ul>

        <div class="flex items-center gap-2 sm:gap-4">
          <router-link
            to="/login"
            class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gold-700 text-gold-700 text-xs sm:text-sm tracking-widest uppercase hover:bg-gold-700 hover:text-white transition"
          >
            Login
          </router-link>
          <button
            @click="showSubscriptionPopup = true"
            class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gold-700 text-white text-xs sm:text-sm tracking-widest uppercase hover:bg-gold-800 transition"
          >
            Free Trial
          </button>
        </div>
      </div>
    </nav>

    <section class="relative min-h-screen flex items-center pt-24 sm:pt-28 md:pt-32 pb-16 overflow-hidden bg-gradient-to-tr from-gold-50 via-cream-100 to-gold-200">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-32 -right-32 w-64 h-64 sm:w-80 sm:h-80 bg-cream-200/30 rounded-full blur-3xl animate-parallaxSlow"></div>
        <div class="absolute -bottom-32 -left-32 w-64 h-64 sm:w-80 sm:h-80 bg-gold-300/30 rounded-full blur-3xl animate-parallaxSlow"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          <span class="inline-block mb-3 sm:mb-4 text-xs sm:text-sm tracking-[0.3em] uppercase text-gold-700">Aesthetic Center Platform</span>
          <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-4 sm:mb-6">
            A Smarter System for Modern Aesthetic Centers
          </h1>
          <p class="text-charcoal-600 max-w-full sm:max-w-lg mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
            Designed specifically for aesthetic clinics and med spas to manage patients, treatments, staff, and growth — all in one elegant platform.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap">
            <button @click="showSubscriptionPopup = true" class="bg-gold-700 text-white px-5 sm:px-10 py-2 sm:py-4 rounded-full text-xs sm:text-sm tracking-widest uppercase hover:bg-gold-800 transition w-full sm:w-auto text-center">
              Free Trial
            </button>
            <router-link to="/centers" class="px-5 sm:px-10 py-2 sm:py-4 rounded-full border border-gold-700 text-gold-700 text-xs sm:text-sm tracking-widest uppercase hover:bg-gold-700 hover:text-white transition w-full sm:w-auto text-center">
              View Centers
            </router-link>
          </div>
        </div>

        <div class="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-3xl overflow-hidden border border-white/20 bg-gradient-to-br from-cream-100 to-gold-50 backdrop-blur-xl">
          <div class="absolute inset-0 bg-center bg-cover" style="background-image: url('../img/beauty.jpg');"></div>
          <div class="absolute inset-0 bg-gold-200/30"></div>
        </div>
      </div>
    </section>

    <section
      class="h-[50vh] sm:h-[60vh] md:h-[70vh] bg-fixed bg-center bg-cover bg-gradient-to-br from-gold-100 via-cream-200 to-gold-300"
      style="background-image: url('../img/bg.jpg');">
    </section>

    <!-- SOLUTIONS -->
    <section class="py-16 sm:py-24 md:py-32 bg-gradient-to-tr from-gold-50 via-cream-100 to-gold-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center">
        <h2 class="text-2xl sm:text-3xl md:text-4xl mb-12 sm:mb-16">Built for the Aesthetic Industry</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <!-- Card 1 -->
          <div class="solution-card delay-0">
            <div class="h-10 w-10 mb-3 sm:mb-4 rounded-xl bg-gold-500/20 flex items-center justify-center text-gold-500 font-semibold">1</div>
            <h3 class="text-lg mb-2">Aesthetic Clinics</h3>
            <p class="text-charcoal-600/80 text-sm sm:text-base">Tailored workflows and features designed specifically for this practice type.</p>
          </div>
          <!-- Card 2 -->
          <div class="solution-card delay-1">
            <div class="h-10 w-10 mb-3 sm:mb-4 rounded-xl bg-gold-500/20 flex items-center justify-center text-gold-500 font-semibold">2</div>
            <h3 class="text-lg mb-2">Med Spas</h3>
            <p class="text-charcoal-600/80 text-sm sm:text-base">Tailored workflows and features designed specifically for this practice type.</p>
          </div>
          <!-- Card 3 -->
          <div class="solution-card delay-2">
            <div class="h-10 w-10 mb-3 sm:mb-4 rounded-xl bg-gold-500/20 flex items-center justify-center text-gold-500 font-semibold">3</div>
            <h3 class="text-lg mb-2">Cosmetic Dermatology</h3>
            <p class="text-charcoal-600/80 text-sm sm:text-base">Tailored workflows and features designed specifically for this practice type.</p>
          </div>
          <!-- Card 4 -->
          <div class="solution-card delay-3">
            <div class="h-10 w-10 mb-3 sm:mb-4 rounded-xl bg-gold-500/20 flex items-center justify-center text-gold-500 font-semibold">4</div>
            <h3 class="text-lg mb-2">Laser & Skin Centers</h3>
            <p class="text-charcoal-600/80 text-sm sm:text-base">Tailored workflows and features designed specifically for this practice type.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES / PLATFORM CAPABILITIES WITH SCROLL-BASED SLIDE -->
    <section class="py-16 sm:py-24 md:py-32 bg-gold-50/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h2 class="text-2xl sm:text-3xl md:text-4xl text-center mb-12 sm:mb-16">Platform Capabilities</h2>

        <div
          v-for="(capability, index) in capabilities"
          :key="index"
          :class="['grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-center mb-12 sm:mb-16 capability-row', index % 2 === 1 ? 'lg:flex-row-reverse' : '']"
          ref="capabilityRows"
        >
          <div class="capability-text translate-x-[-30px] sm:translate-x-[-50px] opacity-0">
            <h3 class="text-xl sm:text-2xl mb-3 sm:mb-4 text-gold-600 font-semibold">{{ capability.title }}</h3>
            <p class="text-charcoal-600/80 text-base sm:text-lg leading-relaxed">{{ capability.description }}</p>
          </div>
          <div class="capability-image translate-x-[30px] sm:translate-x-[50px] opacity-0 w-full h-48 sm:h-64 lg:h-80 rounded-2xl overflow-hidden border border-gold-200/30 bg-gold-50/20 backdrop-blur-xl">
            <img :src="capability.image" :alt="capability.title" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="relative min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center text-white overflow-hidden">
      <!-- Background image -->
      <div class="absolute inset-0 bg-center bg-cover" style="background-image: url('../img/room.jpg');"></div>
      <!-- Blur layer -->
      <div class="absolute inset-0 backdrop-blur-sm"></div>
      <!-- Color overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-lavender-900/80 via-gold-900/70 to-rose-800/40"></div>

      <!-- Content -->
      <div class="relative z-10 max-w-4xl text-center px-4 sm:px-6 md:px-8">
        <h2 class="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 text-gold-300">Elevate Your Aesthetic Operations</h2>
        <p class="text-white/80 mb-6 sm:mb-8 text-sm sm:text-base">
          Join modern aesthetic centers using intelligent systems to scale with confidence.
        </p>
        <button @click="showSubscriptionPopup = true" class="bg-gold-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-gold-800 transition text-sm sm:text-base">
          Try 14-Day Free Trial
        </button>
      </div>

      <div class="absolute top-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-gold-400/20 rounded-full blur-[60px] sm:blur-[80px] animate-parallaxSlow"></div>
      <div class="absolute bottom-0 right-0 w-56 sm:w-72 h-56 sm:h-72 bg-lavender-500/20 rounded-full blur-[90px] sm:blur-[120px] animate-parallaxSlow"></div>
    </section>

    <Modal
      :isOpen="showSubscriptionPopup"
      @close="showSubscriptionPopup = false"
      :showConfirm="false"
      panelClass="bg-white"
    >
      <SubscriptionPopup @close="showSubscriptionPopup = false" />
    </Modal>
  </div>
</template>


<script>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Modal from "@/components/common/Modal.vue";
import SubscriptionPopup from "@/components/common/SubscriptionPopup.vue";
import placeholder from '@/assets/placeholder.svg'

export default {
  name: "HomePage",
  components: {
    Modal,
    SubscriptionPopup,
  },
  setup() {
    const router = useRouter();
    const capabilityRows = ref([]);
    const showSubscriptionPopup = ref(false);
    const capabilities = [
      {
        title: "Appointments & Scheduling",
        description: "Streamline bookings with a visual calendar, staff availability management, and automated reminders.",
        image: placeholder,
      },
      {
        title: "Patient Treatment Records",
        description: "Maintain detailed treatment history, session notes, before-and-after photos, and progress tracking.",
        image: placeholder,
      },
      {
        title: "Appointments & Scheduling",
        description: "Streamline bookings with a visual calendar, staff availability management, and automated reminders.",
        image: placeholder,
      },
      {
        title: "Patient Treatment Records",
        description: "Maintain detailed treatment history, session notes, before-and-after photos, and progress tracking.",
        image: placeholder,
      },
      {
        title: "Appointments & Scheduling",
        description: "Streamline bookings with a visual calendar, staff availability management, and automated reminders.",
        image: placeholder,
      },
      {
        title: "Patient Treatment Records",
        description: "Maintain detailed treatment history, session notes, before-and-after photos, and progress tracking.",
        image: placeholder,
      },
    ];

    onMounted(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const text = entry.target.querySelector(".capability-text");
            const img = entry.target.querySelector(".capability-image");
            if (entry.isIntersecting) {
              text.classList.add("in-view");
              img.classList.add("in-view");
            } else {
              text.classList.remove("in-view");
              img.classList.remove("in-view");
            }
          });
        },
        { threshold: 0.3 }
      );

      capabilityRows.value.forEach((row) => observer.observe(row));
    });

    return { capabilityRows, capabilities, showSubscriptionPopup };
  },
};
</script>

<style scoped>
body {
  font-family: "Playfair Display", serif;
}

/* Parallax animation for blobs */
@keyframes parallaxSlow {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(20px);
  }
  100% {
    transform: translateY(0px);
  }
}
.animate-parallaxSlow {
  animation: parallaxSlow 8s ease-in-out infinite;
}

/* Slide animations for any additional use */
@keyframes slide-in-left {
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes slide-in-right {
  0% {
    opacity: 0;
    transform: translateX(50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
.animate-slide-in-left {
  animation: slide-in-left 1s forwards;
}
.animate-slide-in-right {
  animation: slide-in-right 1s forwards;
}

/* Base transition for capability slide */
.capability-text,
.capability-image {
  transition: transform 0.8s ease-out, opacity 0.8s ease-out;
}

/* Active state when in view */
.in-view {
  transform: translateX(0) !important;
  opacity: 1 !important;
}

/* Floating animation */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
.animate-float {
  animation: float 4s ease-in-out infinite;
}

/* Fade-in upward animation */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

</style>
