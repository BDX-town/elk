<script lang="ts" setup>
const { config, update } = useFrontendConfig()
const links = ref(config.value?.links || [])
const isLoading = ref(false)

watch(config, () => {
  if (config.value)
    links.value = config.value?.links
})

function add() {
  links.value = [...links.value, { icon: '🔗', text: '', url: '' }]
}

function save() {
  update({ links: links.value }, isLoading)
}

function insertEmoji(url: string, emoji: string) {
  const ls = [...links.value]
  const index = ls.findIndex(l => l.url === url)
  ls.splice(index, 1, { ...ls[index], icon: emoji })
  links.value = ls
}

function onChange(e: Event, link: FrontendConfiguration['links'][number]) {
  const ls = [...links.value]
  const index = ls.findIndex(l => l.url === link.url)
  const data = new FormData(e.currentTarget as HTMLFormElement)
  ls.splice(index, 1, { ...ls[index], text: data.get('text') as string, url: data.get('url') as string })
  links.value = ls
}
</script>

<template>
  <div>
    <div flex flex-col gap-3>
      <template v-for="link in links" :key="link.url">
        <div flex items-center gap-3>
          <EmojiPicker :hide-custom-emojis="true" @select="(emoji) => insertEmoji(link.url, emoji)">
            <button grayscale input-base w-auto h-full>
              {{ link.icon }}
            </button>
          </EmojiPicker>
          <form grow flex items-center gap-3 @input="(e) => onChange(e, link)">
            <input
              :value="link.text"
              name="text"
              shrink-1
              type="text" placeholder-text-secondary
              :placeholder="$t('settings.profile.appearance.profile_metadata_label')"
              input-base
              w-auto
            >
            <input
              :value="link.url"
              name="url"
              grow
              type="text" placeholder-text-secondary
              :placeholder="$t('settings.profile.appearance.profile_metadata_value')"
              w-auto
              input-base
            >
          </form>
        </div>
      </template>
      <button
        btn-outline font-bold py2 full-w sm-wa flex="~ gap2 center"
        type="button"
        :disabled="!!links.find(l => !l.url || !l.text)"
        :class="!!links.find(l => !l.url || !l.text) ? 'border-none' : undefined"
        @click="add"
      >
        <span aria-hidden="true" class="block i-ri:add-line" />
        {{ $t('admin.add_link') }}
      </button>
    </div>
    <button
      btn-outline font-bold py2 full-w sm-wa flex="~ gap2 center" ml-auto mt-3
      type="button"
      :disabled="isLoading"
      :class="isLoading ? 'border-none' : undefined"
      @click="save"
    >
      <span v-if="!isLoading" aria-hidden="true" class="block i-ri:add-line" />
      <span v-else i-ri:loader-4-line animate-spin />
      {{ $t('action.save') }}
    </button>
  </div>
</template>
