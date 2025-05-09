<script setup lang="ts">
import type { akkoma } from '@bdxtown/akko'
import { useForm } from 'slimeform'

const emit = defineEmits<{
  (e: 'listUpdated', list: akkoma.v1.List): void
  (e: 'listRemoved', id: string): void
}>()
const list = defineModel<akkoma.v1.List>({ required: true })

const { t } = useI18n()
const client = useAkkoClient()

const { form, isDirty, submitter, reset } = useForm({
  form: () => ({ ...list.value }),
})

const isEditing = ref<boolean>(false)
const deleting = ref<boolean>(false)
const actionError = ref<string | undefined>(undefined)

const input = ref<HTMLInputElement>()
const editBtn = ref<HTMLButtonElement>()
const deleteBtn = ref<HTMLButtonElement>()

async function prepareEdit() {
  isEditing.value = true
  actionError.value = undefined
  await nextTick()
  input.value?.focus()
}
async function cancelEdit() {
  isEditing.value = false
  actionError.value = undefined

  await nextTick()
  reset()
  editBtn.value?.focus()
}

const { submit, submitting } = submitter(async () => {
  try {
    list.value = await client.v1.lists.$select(form.id).update({
      title: form.title,
    })
    cancelEdit()
  }
  catch (err) {
    console.error(err)
    actionError.value = (err as Error).message
    await nextTick()
    input.value?.focus()
  }
})

async function removeList() {
  if (deleting.value)
    return

  const confirmDelete = await openConfirmDialog({
    title: t('confirm.delete_list.title'),
    description: t('confirm.delete_list.description', [list.value.title]),
    confirm: t('confirm.delete_list.confirm'),
    cancel: t('confirm.delete_list.cancel'),
  })

  deleting.value = true
  actionError.value = undefined
  await nextTick()

  if (confirmDelete.choice === 'confirm') {
    await nextTick()
    try {
      await client.v1.lists.$select(list.value.id).remove()
      emit('listRemoved', list.value.id)
    }
    catch (err) {
      console.error(err)
      actionError.value = (err as Error).message
      await nextTick()
      deleteBtn.value?.focus()
    }
    finally {
      deleting.value = false
    }
  }
  else {
    deleting.value = false
  }
}

async function clearError() {
  actionError.value = undefined
  await nextTick()
  if (isEditing.value)
    input.value?.focus()
  else
    deleteBtn.value?.focus()
}

onDeactivated(cancelEdit)
</script>

<template>
  <form
    hover:bg-active flex justify-between items-center gap-x-2
    :aria-describedby="actionError ? `action-list-error-${list.id}` : undefined"
    :class="actionError ? 'border border-base border-rounded rounded-be-is-0 rounded-be-ie-0 border-b-unset border-$c-danger-active' : null"
    @submit.prevent="submit"
  >
    <div
      v-if="isEditing"
      bg-base border="~ base" h10 m2 ps-1 pe-4 rounded-3 w-full flex="~ row"
      items-center relative focus-within:box-shadow-outline gap-3
    >
      <CommonTooltip v-if="isEditing" :content="$t('list.cancel_edit')">
        <button
          type="button"
          rounded-full text-sm p2 transition-colors
          hover:text-primary
          @click="cancelEdit()"
        >
          <span block text-current i-ri:close-fill />
        </button>
      </CommonTooltip>
      <input
        ref="input"
        v-model="form.title"
        rounded-3 w-full bg-transparent
        outline="focus:none" pe-4 pb="1px"
        flex-1 placeholder-text-secondary
        @keydown.esc="cancelEdit()"
      >
    </div>
    <NuxtLink v-else :to="`list/${list.id}`" block grow p4>
      {{ form.title }}
    </NuxtLink>
    <div mr4 flex gap2>
      <CommonTooltip v-if="isEditing" :content="$t('list.save')">
        <button
          type="submit"
          text-sm p2 border-1 transition-colors
          border-dark hover:text-primary
          btn-action-icon
          :disabled="deleting || !isDirty || submitting"
        >
          <template v-if="isEditing">
            <span v-if="submitting" aria-hidden="true" block animate animate-spin preserve-3d class="rtl-flip">
              <span block i-ri:loader-2-fill aria-hidden="true" />
            </span>
            <span v-else block text-current i-ri:save-2-fill class="rtl-flip" />
          </template>
        </button>
      </CommonTooltip>
      <CommonTooltip v-else :content="$t('list.edit')">
        <button
          ref="editBtn"
          type="button"
          text-sm p2 border-1 transition-colors
          border-dark hover:text-primary
          btn-action-icon
          @click.prevent="prepareEdit"
        >
          <span block text-current i-ri:edit-2-line class="rtl-flip" />
        </button>
      </CommonTooltip>
      <CommonTooltip :content="$t('list.delete')">
        <button
          type="button"
          text-sm p2 border-1 transition-colors
          border-dark hover:text-primary
          btn-action-icon
          :disabled="isEditing"
          @click.prevent="removeList"
        >
          <span v-if="deleting" aria-hidden="true" block animate animate-spin preserve-3d class="rtl-flip">
            <span block i-ri:loader-2-fill aria-hidden="true" />
          </span>
          <span v-else block text-current i-ri:delete-bin-2-line class="rtl-flip" />
        </button>
      </CommonTooltip>
    </div>
  </form>
  <CommonErrorMessage
    v-if="actionError"
    :id="`action-list-error-${list.id}`"
    :described-by="`action-list-failed-${list.id}`"
    class="rounded-bs-is-0 rounded-bs-ie-0 border-t-dashed m-b-2"
  >
    <header :id="`action-list-failed-${list.id}`" flex justify-between>
      <div flex items-center gap-x-2 font-bold>
        <div aria-hidden="true" i-ri:error-warning-fill />
        <p>{{ $t(`list.${isEditing ? 'edit_error' : 'delete_error'}`) }}</p>
      </div>
      <CommonTooltip placement="bottom" :content="$t('list.clear_error')">
        <button
          flex rounded-4 p1 hover:bg-active cursor-pointer transition-100 :aria-label="$t('list.clear_error')"
          @click="clearError"
        >
          <span aria-hidden="true" w="1.75em" h="1.75em" i-ri:close-line />
        </button>
      </CommonTooltip>
    </header>
    <ol ps-2 sm:ps-1>
      <li flex="~ col sm:row" gap-y-1 sm:gap-x-2>
        <strong sr-only>{{ $t('list.error_prefix') }}</strong>
        <span>{{ actionError }}</span>
      </li>
    </ol>
  </CommonErrorMessage>
</template>
