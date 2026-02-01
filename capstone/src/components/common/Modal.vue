<template>
  <teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>
      <div class="relative bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div class="flex justify-end p-2">
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-2 overflow-y-auto flex-1">
          <slot />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'
import Button from './Button.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  showConfirm: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'confirm'])

const closeModal = () => {
  emit('close')
}
</script>