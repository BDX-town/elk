<script setup lang="ts">
import type { akkoma } from '@bdxtown/akko'

const { status } = defineProps<{
  status: akkoma.v1.Status
}>()
const poll = reactive({ ...status.poll! })

function toPercentage(num: number) {
  const percentage = 100 * num
  return `${percentage.toFixed(1).replace(/\.?0+$/, '')}%`
}
const timeAgoOptions = useTimeAgoOptions()
const expiredTimeAgo = useTimeAgo(poll.expiresAt!, timeAgoOptions)
const expiredTimeFormatted = useFormattedDateTime(poll.expiresAt!)
const { formatPercentage } = useHumanReadableNumber()
const loading = ref(false)

const { client } = useAkko()

async function vote(e: Event) {
  const formData = new FormData(e.target as HTMLFormElement)
  const choices = formData.getAll('choices').map(i => +i) as number[]

  // Update the poll optimistically
  for (const [index, option] of poll.options.entries()) {
    if (choices.includes(index))
      option.votesCount = (option.votesCount || 0) + 1
  }
  poll.voted = true
  poll.votesCount++

  if (!poll.votersCount && poll.votesCount)
    poll.votesCount = poll.votesCount + 1
  else
    poll.votersCount = (poll.votersCount || 0) + 1

  cacheStatus({ ...status, poll }, undefined, true)

  await client.value.v1.polls.$select(poll.id).votes.create({ choices })
}

async function refresh() {
  if (loading.value) {
    return
  }

  loading.value = true
  try {
    const newPoll = await client.value.v1.polls.$select(poll.id).fetch()
    Object.assign(poll, newPoll)
    cacheStatus({ ...status, poll: newPoll }, undefined, true)
  }
  catch (e) {
    console.error(e)
  }
  finally {
    loading.value = false
  }
}

const votersCount = computed(() => poll.votesCount ?? poll.votersCount ?? 0)
</script>

<template>
  <div flex flex-col w-full items-stretch gap-2 py3 dir="auto" class="poll-wrapper">
    <form v-if="!poll.voted && !poll.expired" flex="~ col gap3" accent-primary @click.stop="noop" @submit.prevent="vote">
      <label v-for="(option, index) of poll.options" :key="index" flex="~ gap2" items-center>
        <input name="choices" :value="index" :type="poll.multiple ? 'checkbox' : 'radio'" cursor-pointer>
        {{ option.title }}
      </label>
      <button btn-solid mt-1>
        {{ $t('action.vote') }}
      </button>
    </form>
    <template v-else>
      <div
        v-for="(option, index) of poll.options"
        :key="index" py-1 relative
        :style="{ '--bar-width': toPercentage(votersCount === 0 ? 0 : (option.votesCount ?? 0) / votersCount) }"
      >
        <div flex justify-between pb-2 w-full>
          <span inline-flex align-items>
            {{ option.title }}
            <span v-if="poll.voted && poll.ownVotes?.includes(index)" ms-2 mt-1 inline-block i-ri:checkbox-circle-line />
          </span>
          <span text-primary-active> {{ formatPercentage(votersCount > 0 ? (option.votesCount || 0) / votersCount : 0) }}</span>
        </div>
        <div class="bg-gray/40" rounded-l-sm rounded-r-lg h-5px w-full>
          <div bg-primary-active h-full min-w="1%" class="w-[var(--bar-width)]" />
        </div>
      </div>
    </template>
    <div text-sm text-secondary flex justify-between items-center gap-3>
      <div flex gap-x-1 flex-wrap>
        <div inline-block>
          <CommonLocalizedNumber
            keypath="status.poll.count"
            :count="poll.votesCount"
          />
        </div>
        &middot;
        <div inline-block>
          <CommonTooltip v-if="poll.expiresAt" :content="expiredTimeFormatted" class="inline-block" placement="right">
            <time :datetime="poll.expiresAt!">{{ $t(poll.expired ? 'status.poll.finished' : 'status.poll.ends', [expiredTimeAgo]) }}</time>
          </CommonTooltip>
        </div>
      </div>
      <div>
        <button whitespace-nowrap flex gap-1 items-center hover:text-primary @click="refresh">
          <div text-xs :class="loading ? 'animate-spin' : ''" i-ri:loop-right-line />
          {{ $t('status.poll.update') }}
        </button>
      </div>
    </div>
  </div>
</template>
