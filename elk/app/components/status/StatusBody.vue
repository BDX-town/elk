<script setup lang="ts">
import type { akkoma } from '@bdxtown/akko'

const {
  status,
  newer,
  withAction = true,
} = defineProps<{
  status: akkoma.v1.Status | akkoma.v1.StatusEdit
  newer?: akkoma.v1.Status
  withAction?: boolean
}>()

const { translation } = await useTranslation(status, getLanguageCode())

const emojisObject = useEmojisFallback(() => status.emojis)
const vnode = computed(() => {
  if (!status.content)
    return null
  return contentToVNode(status.content, {
    emojis: emojisObject.value,
    mentions: 'mentions' in status ? status.mentions : undefined,
    hideQuoteInBody: true,
    markdown: true,
    collapseMentionLink: !!('inReplyToId' in status && status.inReplyToId),
    status: 'id' in status ? status : undefined,
    inReplyToStatus: newer,
  })
})
</script>

<template>
  <div class="status-body" my-2 whitespace-pre-wrap break-words :class="{ 'with-action': withAction }" relative>
    <span
      v-if="status.content"
      class="content-rich line-compact" dir="auto"
      :lang="('language' in status && status.language) || undefined"
    >
      <component :is="vnode" v-if="vnode" />
    </span>
    <div v-else />
    <template v-if="translation.visible">
      <div my2 h-px border="b base" bg-base />
      <ContentRich v-if="translation.success" class="line-compact" :content="translation.text" :emojis="status.emojis" />
      <div v-else text-red-4>
        Error: {{ translation.error }}
      </div>
    </template>
  </div>
</template>

<style>
.status-body.with-action p {
  cursor: pointer;
}
</style>
