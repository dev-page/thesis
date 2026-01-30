<template>
  <div class="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
    <!-- NAVBAR -->
    <nav class="fixed top-0 inset-x-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
      <div class="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 h-16">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-700"></div>
          <span class="text-lg tracking-wide text-white">AesthetiCare</span>
        </div>

        <ul class="hidden md:flex items-center gap-6 lg:gap-10 text-[11px] tracking-[0.2em] uppercase text-white/60">
          <li><a class="hover:text-yellow-400 transition">Centers</a></li>
          <li><a class="hover:text-yellow-400 transition">Features</a></li>
          <li><a class="hover:text-yellow-400 transition">Solutions</a></li>
          <li><a class="hover:text-yellow-400 transition">Pricing</a></li>
        </ul>

        <div class="flex items-center gap-2 sm:gap-4">
          <router-link
            to="/login"
            class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/40 text-white/80 text-xs sm:text-sm tracking-widest uppercase hover:border-yellow-400 hover:text-yellow-400 transition"
          >
            Login
          </router-link>
          <router-link
            to="/register"
            class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-yellow-400 text-yellow-400 text-xs sm:text-sm tracking-widest uppercase hover:bg-yellow-400 hover:text-white transition"
          >
            Free Trial
          </router-link>
        </div>
      </div>
    </nav>

    <!-- HERO -->
    <section class="relative min-h-screen flex items-center pt-24 sm:pt-28 md:pt-32 pb-16 overflow-hidden">
      <!-- Parallax background placeholders -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-32 -right-32 w-64 h-64 sm:w-80 sm:h-80 bg-yellow-400/20 rounded-full blur-3xl animate-parallaxSlow"></div>
        <div class="absolute -bottom-32 -left-32 w-64 h-64 sm:w-80 sm:h-80 bg-purple-500/20 rounded-full blur-3xl animate-parallaxSlow"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
        <!-- Text -->
        <div>
          <span class="inline-block mb-3 sm:mb-4 text-xs sm:text-sm tracking-[0.3em] uppercase text-yellow-400">Aesthetic Center Platform</span>
          <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-4 sm:mb-6">
            A Smarter System for Modern Aesthetic Centers
          </h1>
          <p class="text-white/80 max-w-full sm:max-w-lg mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
            Designed specifically for aesthetic clinics and med spas to manage patients, treatments, staff, and growth — all in one elegant platform.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap">
            <router-link
              to="/register"
              class="bg-yellow-500 text-white px-5 sm:px-10 py-2 sm:py-4 rounded-full text-xs sm:text-sm tracking-widest uppercase hover:bg-yellow-600 transition w-full sm:w-auto text-center"
            >
              Free Trial
            </router-link>
            <button class="px-5 sm:px-10 py-2 sm:py-4 rounded-full border border-white/30 text-white/80 text-xs sm:text-sm tracking-widest uppercase hover:border-yellow-400 hover:text-yellow-400 transition w-full sm:w-auto text-center">
              View Centers
            </button>
          </div>
        </div>

        <!-- Visual mock / placeholder for parallax image -->
        <div class="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-3xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-xl">
          <!-- Image -->
          <div class="absolute inset-0 bg-center bg-cover" style="background-image: url('../img/beauty.jpg');"></div>
          <!-- Optional dark overlay -->
          <div class="absolute inset-0 bg-black/20"></div>
        </div>
      </div>
    </section>

    <!-- PURE PARALLAX IMAGE -->
    <section
      class="h-[50vh] sm:h-[60vh] md:h-[70vh] bg-fixed bg-center bg-cover"
      style="background-image: url('../img/bg.jpg');">
    </section>

    <!-- SOLUTIONS -->
    <section class="py-16 sm:py-24 md:py-32">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center">
        <h2 class="text-2xl sm:text-3xl md:text-4xl mb-12 sm:mb-16">Built for the Aesthetic Industry</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div class="group p-6 sm:p-8 md:p-10 rounded-2xl border border-white/20 bg-white/5 hover:shadow-2xl transition">
            <div class="h-10 w-10 mb-3 sm:mb-4 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-semibold">1</div>
            <h3 class="text-lg mb-2">Aesthetic Clinics</h3>
            <p class="text-white/70 text-sm sm:text-base">Tailored workflows and features designed specifically for this practice type.</p>
          </div>
          <div class="group p-6 sm:p-8 md:p-10 rounded-2xl border border-white/20 bg-white/5 hover:shadow-2xl transition">
            <div class="h-10 w-10 mb-3 sm:mb-4 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-semibold">2</div>
            <h3 class="text-lg mb-2">Med Spas</h3>
            <p class="text-white/70 text-sm sm:text-base">Tailored workflows and features designed specifically for this practice type.</p>
          </div>
          <div class="group p-6 sm:p-8 md:p-10 rounded-2xl border border-white/20 bg-white/5 hover:shadow-2xl transition">
            <div class="h-10 w-10 mb-3 sm:mb-4 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-semibold">3</div>
            <h3 class="text-lg mb-2">Cosmetic Dermatology</h3>
            <p class="text-white/70 text-sm sm:text-base">Tailored workflows and features designed specifically for this practice type.</p>
          </div>
          <div class="group p-6 sm:p-8 md:p-10 rounded-2xl border border-white/20 bg-white/5 hover:shadow-2xl transition">
            <div class="h-10 w-10 mb-3 sm:mb-4 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-semibold">4</div>
            <h3 class="text-lg mb-2">Laser & Skin Centers</h3>
            <p class="text-white/70 text-sm sm:text-base">Tailored workflows and features designed specifically for this practice type.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES / PLATFORM CAPABILITIES WITH SCROLL-BASED SLIDE -->
    <section class="py-16 sm:py-24 md:py-32 bg-white/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h2 class="text-2xl sm:text-3xl md:text-4xl text-center mb-12 sm:mb-16">Platform Capabilities</h2>

        <div
          v-for="(capability, index) in capabilities"
          :key="index"
          :class="['grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-center mb-12 sm:mb-16 capability-row', index % 2 === 1 ? 'lg:flex-row-reverse' : '']"
          ref="capabilityRows"
        >
          <div class="capability-text translate-x-[-30px] sm:translate-x-[-50px] opacity-0">
            <h3 class="text-xl sm:text-2xl mb-3 sm:mb-4 text-yellow-400 font-semibold">{{ capability.title }}</h3>
            <p class="text-white/70 text-base sm:text-lg leading-relaxed">{{ capability.description }}</p>
          </div>
          <div class="capability-image translate-x-[30px] sm:translate-x-[50px] opacity-0 w-full h-48 sm:h-64 lg:h-80 rounded-2xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-xl">
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
      <div class="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-purple-800/70 to-yellow-900/40"></div>

      <!-- Content -->
      <div class="relative z-10 max-w-4xl text-center px-4 sm:px-6 md:px-8">
        <h2 class="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 text-yellow-400">Elevate Your Aesthetic Operations</h2>
        <p class="text-white/80 mb-6 sm:mb-8 text-sm sm:text-base">
          Join modern aesthetic centers using intelligent systems to scale with confidence.
        </p>
        <button class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition text-sm sm:text-base">
          Request Demo
        </button>
      </div>

      <!-- Ambient parallax blobs -->
      <div class="absolute top-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-yellow-400/20 rounded-full blur-[60px] sm:blur-[80px] animate-parallaxSlow"></div>
      <div class="absolute bottom-0 right-0 w-56 sm:w-72 h-56 sm:h-72 bg-purple-500/20 rounded-full blur-[90px] sm:blur-[120px] animate-parallaxSlow"></div>
    </section>
  </div>
</template>


<script>
import { onMounted, ref } from "vue";

export default {
  name: "HomePage",
  setup() {
    const capabilityRows = ref([]);
    const capabilities = [
      {
        title: "Appointments & Scheduling",
        description: "Streamline bookings with a visual calendar, staff availability management, and automated reminders.",
        image: "https://via.placeholder.com/600x400.png?text=Appointments+Image",
      },
      {
        title: "Patient Treatment Records",
        description: "Maintain detailed treatment history, session notes, before-and-after photos, and progress tracking.",
        image: "https://via.placeholder.com/600x400.png?text=Patient+Records+Image",
      },
      {
        title: "Appointments & Scheduling",
        description: "Streamline bookings with a visual calendar, staff availability management, and automated reminders.",
        image: "https://via.placeholder.com/600x400.png?text=Appointments+Image",
      },
      {
        title: "Patient Treatment Records",
        description: "Maintain detailed treatment history, session notes, before-and-after photos, and progress tracking.",
        image: "https://via.placeholder.com/600x400.png?text=Patient+Records+Image",
      },
      {
        title: "Appointments & Scheduling",
        description: "Streamline bookings with a visual calendar, staff availability management, and automated reminders.",
        image: "https://via.placeholder.com/600x400.png?text=Appointments+Image",
      },
      {
        title: "Patient Treatment Records",
        description: "Maintain detailed treatment history, session notes, before-and-after photos, and progress tracking.",
        image: "https://via.placeholder.com/600x400.png?text=Patient+Records+Image",
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

    return { capabilityRows, capabilities };
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
</style>
