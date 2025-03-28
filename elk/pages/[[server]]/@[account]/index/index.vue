<script setup lang="ts">
import type { akkoma } from '@bdxtown/akko'

const params = useRoute().params
const handle = computed(() => params.account as string)

definePageMeta({ name: 'account-index' })

const { t } = useI18n()

const account = await fetchAccountByHandle(handle.value)

// we need to ensure `pinned === true` on status
// because this prop is appeared only on current account's posts
function applyPinned(statuses: akkoma.v1.Status[]) {
  return statuses.map((status) => {
    status.pinned = true
    return status
  })
}

function reorderAndFilter(items: akkoma.v1.Status[]) {
  return reorderedTimeline(items, 'account')
}

const pinnedPaginator = useAkkoClient().v1.accounts.$select(account.id).statuses.list({ pinned: true })
const postPaginator = useAkkoClient().v1.accounts.$select(account.id).statuses.list({ limit: 30, excludeReplies: true })

if (account) {
  useHydratedHead({
    title: () => `${t('nav.profile')} | ${getDisplayName(account)} (@${account.acct})`,
  })
}
</script>

<template>
  <div>
    <AccountTabs />
    <TimelinePaginator :paginator="pinnedPaginator" :preprocess="applyPinned" context="account" :account="account" :end-message="false" />
    <!-- Upper border -->
    <div h="1px" w-auto bg-border mb-1 />
    <TimelinePaginator :paginator="postPaginator" :preprocess="reorderAndFilter" context="account" :account="account" />
  </div>
</template>
