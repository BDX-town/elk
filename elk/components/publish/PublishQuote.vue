<script lang="ts" setup>
import type { akkoma } from '@bdxtown/akko'

const { quote } = defineProps<{
  quote: akkoma.v1.Status | undefined
}>()
</script>

<template>
  <StatusCard
    v-if="quote"
    :status="quote"
    :actions="false"
    :hover="false"
    :is-preview="true"
    class="bg-border rounded"
  />
  <div v-else mx-auto i-ri:loader-2-fill animate-spin />
</template>
