<script setup lang="ts">
import type { akkoma } from '@bdxtown/akko'
import type { DraftItem } from '#shared/types'

const {
  draftKey,
  initial = getDefaultDraftItem,
  expanded = false,
} = defineProps<{
  draftKey: string
  initial?: () => DraftItem
  placeholder?: string
  inReplyToId?: string
  inReplyToVisibility?: akkoma.v1.StatusVisibility
  expanded?: boolean
  dialogLabelledBy?: string
}>()

const threadComposer = useThreadComposer(draftKey, initial)

const threadItems = computed(() => threadComposer.threadItems.value)

onDeactivated(() => {
  clearEmptyDrafts()
})

function isFirstItem(index: number) {
  return index === 0
}
</script>

<template>
  <div v-if="isHydrated && currentUser" flex flex-col gap-4>
    <PublishWidget
      v-for="(_, index) in threadItems" :key="`${draftKey}-${index}`"
      v-bind="$attrs"
      :thread-composer="threadComposer"
      :draft-key="draftKey"
      :draft-item-index="index"
      :expanded="isFirstItem(index) ? expanded : true"
      :placeholder="placeholder"
      :dialog-labelled-by="dialogLabelledBy"
      :in-reply-to-id="isFirstItem(index) ? inReplyToId : undefined"
      :in-reply-to-visibility="inReplyToVisibility"
    />
  </div>
</template>
