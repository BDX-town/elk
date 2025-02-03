<script lang="ts" setup>
const { config, update } = useFrontendConfig()
const links = ref(config.value?.links || [])

watch(config, () => {
  if (config.value)
    links.value = config.value?.links
})

function insertEmoji(url: string, emoji: string) {
  const ls = [...links.value]
  const index = ls.findIndex(l => l.url === url)
  ls.splice(index, 1, { ...ls[index], icon: emoji })
  links.value = ls
  update({ links: ls })
}
</script>

<template>
  <div flex flex-col gap-3>
    <template v-for="link in links" :key="link.url">
      <div flex items-center gap-3>
        <EmojiPicker :hide-custom-emojis="true" @select="(emoji) => insertEmoji(link.url, emoji)">
          <button grayscale input-base w-auto>
            {{ link.icon }}
          </button>
        </EmojiPicker>
        <input
          v-model="link.text"
          shrink-1
          type="text" placeholder-text-secondary
          :placeholder="$t('settings.profile.appearance.profile_metadata_label')"
          input-base
          w-auto
        >
        <input
          v-model="link.url"
          grow
          type="text" placeholder-text-secondary
          :placeholder="$t('settings.profile.appearance.profile_metadata_value')"
          w-auto
          input-base
        >
      </div>
    </template>
  </div>
</template>
