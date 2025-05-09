<script setup lang="ts">
const { enabled, filter, sensitiveNonSpoiler } = defineProps<{
  enabled?: boolean
  filter?: boolean
  isDM?: boolean
  sensitiveNonSpoiler?: boolean
}>()

const expandSpoilers = computed(() => {
  const expandCW = currentUser.value ? getExpandSpoilersByDefault(currentUser.value.account) : false
  const expandMedia = currentUser.value ? getExpandMediaByDefault(currentUser.value.account) : false

  return !filter // always prevent expansion if filtered
    && ((sensitiveNonSpoiler && expandMedia)
      || (!sensitiveNonSpoiler && expandCW))
})

const hideContent = enabled || sensitiveNonSpoiler
const showContent = ref(expandSpoilers.value ? true : !hideContent)
const toggleContent = useToggle(showContent)

watchEffect(() => {
  showContent.value = expandSpoilers.value ? true : !hideContent
})
function getToggleText() {
  if (sensitiveNonSpoiler)
    return 'status.spoiler_media_hidden'
  return filter ? 'status.filter_show_anyway' : 'status.spoiler_show_more'
}
</script>

<template>
  <div v-if="hideContent" flex flex-col items-start>
    <div class="content-rich" p="x-4 b-2.5" text-center text-secondary w-full border="~ base" border-0 border-b-dotted border-b-3 mt-2>
      <slot name="spoiler" />
    </div>
    <div flex="~ gap-1 center" w-full :mb="isDM && !showContent ? '4' : ''" mt="-4.5">
      <button btn-text px-2 py-1 rounded-lg :bg="isDM ? 'transparent' : 'base'" flex="~ center gap-2" :class="showContent ? '' : 'text-secondary hover:text-primary'" :aria-expanded="showContent" @click="toggleContent()">
        <div v-if="showContent" i-ri:eye-line />
        <div v-else i-ri:eye-close-line />
        {{ showContent ? $t('status.spoiler_show_less') : $t(getToggleText()) }}
      </button>
    </div>
  </div>
  <slot v-if="!hideContent || showContent" />
</template>
