<script setup lang="ts">
const paginator = useAkkoClient().v1.blocks.list()
</script>

<template>
  <AccountPaginator :paginator="paginator" />
</template>
