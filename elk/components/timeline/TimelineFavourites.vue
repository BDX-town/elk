<script setup lang="ts">
const paginator = useAkkoClient().v1.favourites.list()
</script>

<template>
  <TimelinePaginator end-message="common.no_favourites" :paginator="paginator" />
</template>
