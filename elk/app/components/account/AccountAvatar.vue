<script setup lang="ts">
import type { akkoma } from '@bdxtown/akko'

const { account } = defineProps<{
  account: akkoma.v1.Account
  square?: boolean
}>()

const loaded = ref(false)
const error = ref(false)

const preferredMotion = usePreferredReducedMotion()
const accountAvatarSrc = computed(() => {
  return preferredMotion.value === 'reduce' ? (account?.avatarStatic ?? account.avatar) : account.avatar
})
</script>

<template>
  <img
    :key="account.avatar"
    width="400"
    height="400"
    select-none
    :src="(error || !loaded) ? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' : accountAvatarSrc"
    :alt="$t('account.avatar_description', [account.username])"
    loading="lazy"
    class="account-avatar object-cover"
    :class="(loaded ? 'bg-base' : 'bg-gray:10') + (square ? ' ' : ' rounded-full')"
    :style="{ 'clip-path': square ? `url(#avatar-mask)` : 'none' }"
    v-bind="$attrs"
    @load="loaded = true"
    @error="error = true"
  >
</template>
