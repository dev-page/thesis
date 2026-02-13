<script setup>
    function toggleAccordion(id) {
      const content = document.getElementById(id);
      const icon = document.getElementById('icon-' + id);

      if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
      } else {
        content.classList.add('hidden');
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
      }
    }
</script>
<template>
<main class="font-sans bg-gradient-to-br from-gray-100 to-gray-300 min-h-screen flex flex-col">

  <div class="container mx-auto max-w-3xl p-6 flex-1">
    <h1 class="text-center text-3xl font-bold mb-6 text-indigo-900">Frequently Asked Questions</h1>

    <div class="space-y-4">
      <div class="border rounded-lg overflow-hidden">
        <button class="w-full flex items-center justify-between px-4 py-3 bg-white text-gray-800 font-medium focus:outline-none"
                onclick="toggleAccordion('faq1')">
          <span><i class="fas fa-question-circle text-yellow-500 mr-2"></i>What makes our services stand out?</span>
          <i id="icon-faq1" class="fas fa-chevron-down"></i>
        </button>
        <div id="faq1" class="hidden px-4 py-3 bg-gray-50 border-t border-indigo-700">
          Our commitment to innovation, quality, and customer satisfaction sets us apart. We leverage cutting-edge technologies to deliver tailored solutions that exceed expectations.
        </div>
      </div>

      <div class="border rounded-lg overflow-hidden">
        <button class="w-full flex items-center justify-between px-4 py-3 bg-white text-gray-800 font-medium focus:outline-none"
                onclick="toggleAccordion('faq2')">
          <span><i class="fas fa-lightbulb text-yellow-500 mr-2"></i>How do we ensure project success?</span>
          <i id="icon-faq2" class="fas fa-chevron-down"></i>
        </button>
        <div id="faq2" class="hidden px-4 py-3 bg-gray-50 border-t border-indigo-700">
          Through meticulous planning, agile methodologies, and continuous communication, we ensure every project is delivered on time, within budget, and meets all requirements.
        </div>
      </div>

      <div class="border rounded-lg overflow-hidden">
        <button class="w-full flex items-center justify-between px-4 py-3 bg-white text-gray-800 font-medium focus:outline-none"
                onclick="toggleAccordion('faq3')">
          <span><i class="fas fa-users text-yellow-500 mr-2"></i>Do you offer ongoing support?</span>
          <i id="icon-faq3" class="fas fa-chevron-down"></i>
        </button>
        <div id="faq3" class="hidden px-4 py-3 bg-gray-50 border-t border-indigo-700">
          Absolutely! We provide comprehensive post-launch support, including maintenance, updates, and 24/7 technical assistance to keep your solutions running smoothly.
        </div>
      </div>

      <div class="border rounded-lg overflow-hidden">
        <button class="w-full flex items-center justify-between px-4 py-3 bg-white text-gray-800 font-medium focus:outline-none"
                onclick="toggleAccordion('faq4')">
          <span><i class="fas fa-shield-alt text-yellow-500 mr-2"></i>How secure are our solutions?</span>
          <i id="icon-faq4" class="fas fa-chevron-down"></i>
        </button>
        <div id="faq4" class="hidden px-4 py-3 bg-gray-50 border-t border-indigo-700">
          Security is paramount. We implement industry-standard encryption, regular audits, and best practices to protect your data and ensure compliance with global standards.
        </div>
      </div>

      <div class="border rounded-lg overflow-hidden">
        <button class="w-full flex items-center justify-between px-4 py-3 bg-white text-gray-800 font-medium focus:outline-none"
                onclick="toggleAccordion('faq5')">
          <span><i class="fas fa-rocket text-yellow-500 mr-2"></i>What technologies do you specialize in?</span>
          <i id="icon-faq5" class="fas fa-chevron-down"></i>
        </button>
        <div id="faq5" class="hidden px-4 py-3 bg-gray-50 border-t border-indigo-700">
          We specialize in modern web technologies, including React, Node.js, Python, cloud services, and more. Our team stays ahead of trends to deliver future-proof solutions.
        </div>
      </div>
    </div>
  </div>
  </main>   

  <footer class="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white text-center py-4 mt-auto">
    <p class="text-sm">&copy; 2026 AesthetiCare. All rights reserved.</p>
  </footer>

</template>