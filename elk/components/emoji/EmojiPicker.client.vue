<script setup lang="ts">
import type { Picker } from 'emoji-mart'
import importEmojiLang from 'virtual:emoji-mart-lang-importer'

const { hideCustomEmojis } = defineProps<{ hideCustomEmojis?: boolean }>()
const emit = defineEmits<{
  (e: 'select', code: string): void
  (e: 'selectCustom', image: any): void
}>()

const model = defineModel<undefined | boolean>({ default: undefined })

const { locale } = useI18n()

const el = ref<HTMLElement>()
const picker = ref<Picker>()
const colorMode = useColorMode()

async function openEmojiPicker() {
  await updateCustomEmojis()

  if (picker.value) {
    picker.value.update({
      theme: colorMode,
      custom: !hideCustomEmojis ? customEmojisData.value : null,
    })
  }
  else {
    const [Picker, i18n] = await Promise.all([
      import('emoji-mart').then(({ Picker }) => Picker),
      importEmojiLang(locale.value.split('-')[0]),
    ])

    picker.value = new Picker({
      onEmojiSelect({ native, src, alt, name }: any) {
        if (native)
          emit('select', native)
        else
          emit('selectCustom', { src, alt, 'data-emoji-id': name })
      },
      theme: colorMode,
      custom: !hideCustomEmojis ? customEmojisData.value : null,
      i18n,
    })
  }
  await nextTick()
  // TODO: custom picker
  el.value?.appendChild(picker.value as any as HTMLElement)
}

function hideEmojiPicker() {
  if (picker.value)
    el.value?.removeChild(picker.value as any as HTMLElement)
}
</script>

<template>
  <CommonTooltip :content="$t('tooltip.add_emojis')">
    <VDropdown
      :shown="model"
      :triggers="model !== undefined ? [] : undefined"
      auto-boundary-max-size
      @apply-show="openEmojiPicker()"
      @apply-hide="hideEmojiPicker()"
    >
      <slot />

      <template #popper>
        <div ref="el" min-w-10 min-h-10 />
      </template>
    </VDropdown>
  </CommonTooltip>
</template>
