<script setup lang="ts">
const paginator = useAkkoClient().v1.accounts.$select(currentUser.value!.account.id).statuses.list({ pinned: true })
</script>

<template>
  <TimelinePaginator :paginator="paginator" />
</template>
