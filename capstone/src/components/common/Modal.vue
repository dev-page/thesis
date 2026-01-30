<template>
  <teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeModal"></div>
      <div class="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div class="flex items-center justify-between p-4 border-b">
          <h3 class="text-lg font-semibold">{{ title }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-4">
          <slot />
        </div>
        <div class="flex justify-end p-4 border-t space-x-2">
          <Button variant="secondary" @click="closeModal">Cancel</Button>
          <Button @click="$emit('confirm')">Confirm</Button>
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
  title: {
    type: String,
    default: 'Modal Title'
  }
})

const emit = defineEmits(['close', 'confirm'])

const closeModal = () => {
  emit('close')
}
</script>