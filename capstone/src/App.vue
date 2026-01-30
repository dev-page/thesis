<template>
  <router-view />
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

// Initialize auth state globally
useAuth()
</script>
