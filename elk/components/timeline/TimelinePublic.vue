<script setup lang="ts">
import type { akkoma } from '@bdxtown/akko'

const replyVisibility = usePreferences('replyVisibility')
const paginator = useAkkoClient().v1.timelines.public.list({ limit: 30, replyVisibility: replyVisibility.value })

const stream = useStreaming(client => client.public.subscribe())
function reorderAndFilter(items: akkoma.v1.Status[]) {
  return reorderedTimeline(items, 'public')
}
</script>

<template>
  <div>
    <TimelinePaginator v-bind="{ paginator, stream }" :preprocess="reorderAndFilter" context="public" />
  </div>
</template>
