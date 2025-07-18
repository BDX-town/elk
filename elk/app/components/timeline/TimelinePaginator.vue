<script setup lang="ts">
import type { akkoma } from '@bdxtown/akko'
// @ts-expect-error missing types
import { DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const { account, buffer = 10, endMessage = true, followedTags = [], paginator } = defineProps<{
  paginator: akkoma.Paginator<akkoma.v1.Status[], akkoma.rest.v1.ListAccountStatusesParams>
  stream?: akkoma.streaming.Subscription
  context?: akkoma.v2.FilterContext
  account?: akkoma.v1.Account
  followedTags?: akkoma.v1.Tag[]
  preprocess?: (items: akkoma.v1.Status[]) => akkoma.v1.Status[]
  buffer?: number
  endMessage?: boolean | string
}>()

const userSettings = useUserSettings()
const willChange = computed(() => getPreferences(userSettings.value, 'optimizeForLowPerformanceDevice') ? 'unset' : 'transform')

const virtualScroller = usePreferences('experimentalVirtualScroller')

const showOriginSite = computed(() =>
  account && account.id !== currentUser.value?.account.id && getServerName(account) !== currentServer.value,
)

const dedupPaginator = ref(new DedupCachePaginator(paginator))

watch(() => paginator, () => dedupPaginator.value = new DedupCachePaginator(paginator))

function getFollowedTag(status: akkoma.v1.Status): string | null {
  const followedTagNames = followedTags.map(tag => tag.name)
  const followedStatusTags = status.tags.filter(tag => followedTagNames.includes(tag.name))
  return followedStatusTags.length > 0 ? followedStatusTags[0]?.name : null
}
</script>

<template>
  <CommonPaginator v-bind="{ paginator: dedupPaginator, stream, preprocess, buffer, endMessage }" :virtual-scroller="virtualScroller">
    <template #updater="{ number, update }">
      <CommonShowNewItems :number="number" :update="update" />
    </template>
    <template #default="{ item, older, newer, active }">
      <template v-if="virtualScroller">
        <DynamicScrollerItem :item="item" :active="active" tag="article">
          <StatusCard :followed-tag="getFollowedTag(item)" :status="item" :context="context" :older="older" :newer="newer" :account="account" />
        </DynamicScrollerItem>
      </template>
      <template v-else>
        <StatusCard :followed-tag="getFollowedTag(item)" :status="item" :context="context" :older="older" :newer="newer" :account="account" />
      </template>
    </template>
    <template v-if="context === 'account' " #done="{ items }">
      <div
        v-if="showOriginSite || items.length === 0"
        p5 text-secondary text-center flex flex-col items-center gap1
      >
        <template v-if="showOriginSite">
          <span italic>{{ $t('timeline.view_older_posts') }}</span>
          <NuxtLink
            :href="account!.url" target="_blank" external
            flex="~ gap-1" items-center text-primary
            hover="underline text-primary-active"
          >
            <div i-ri:external-link-fill />
            {{ $t('menu.open_in_original_site') }}
          </NuxtLink>
        </template>
        <span v-else-if="items.length === 0">{{ $t('timeline.no_posts') }}</span>
      </div>
    </template>
  </CommonPaginator>
</template>

<style lang="css">
.vue-recycle-scroller.ready .vue-recycle-scroller__item-view {
  will-change: v-bind('willChange');
}
</style>
