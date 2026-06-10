<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string
  options: readonly string[]
  placeholder?: string
  disabled?: boolean
  accentFocusClass?: string
  addLabel?: string
  canDelete?: (option: string) => boolean
}>(), {
  placeholder: 'Search or type...',
  disabled: false,
  accentFocusClass: 'focus:border-slate-400 focus:ring-slate-100 dark:focus:ring-slate-700',
  addLabel: 'Add',
  canDelete: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'add-option': [value: string]
  'delete-option': [value: string]
}>()

const rootRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const searchQuery = ref('')

const availableOptions = computed(() => {
  const merged = [...props.options]
  if (props.modelValue && !merged.includes(props.modelValue)) {
    merged.unshift(props.modelValue)
  }
  return merged
})

const normalizedQuery = computed(() => searchQuery.value.trim().toLowerCase())

const filteredOptions = computed(() => {
  if (!normalizedQuery.value) {
    return availableOptions.value
  }

  return availableOptions.value.filter(option =>
    option.toLowerCase().includes(normalizedQuery.value),
  )
})

const hasExactMatch = computed(() =>
  availableOptions.value.some(option => option.toLowerCase() === normalizedQuery.value),
)

const canAddCustom = computed(() =>
  searchQuery.value.trim().length > 0 && !hasExactMatch.value,
)

function isOptionDeletable(option: string): boolean {
  return props.canDelete?.(option) ?? false
}

function openDropdown() {
  if (props.disabled) {
    return
  }
  isOpen.value = true
}

function syncSearchFromValue() {
  searchQuery.value = props.modelValue
}

function onInputFocus() {
  openDropdown()
  syncSearchFromValue()
}

function onInput(event: Event) {
  searchQuery.value = (event.target as HTMLInputElement).value
  openDropdown()

  if (props.modelValue && searchQuery.value.trim() !== props.modelValue) {
    emit('update:modelValue', '')
  }
}

function selectOption(value: string) {
  emit('update:modelValue', value)
  searchQuery.value = value
  isOpen.value = false
}

function addCustomOption() {
  const value = searchQuery.value.trim()
  if (!value) {
    return
  }

  emit('add-option', value)
  selectOption(value)
}

function clearSelection() {
  emit('update:modelValue', '')
  searchQuery.value = ''
  isOpen.value = false
  inputRef.value?.focus()
}

function deleteOption(option: string) {
  emit('delete-option', option)

  if (props.modelValue === option) {
    emit('update:modelValue', '')
    searchQuery.value = ''
  }
}

function onClickOutside(event: MouseEvent) {
  if (!rootRef.value?.contains(event.target as Node)) {
    isOpen.value = false
    syncSearchFromValue()
  }
}

function onInputKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    isOpen.value = false
    syncSearchFromValue()
    return
  }

  if (event.key === 'Enter') {
    event.preventDefault()
    if (canAddCustom.value) {
      addCustomOption()
      return
    }
    if (filteredOptions.value[0]) {
      selectOption(filteredOptions.value[0])
    }
  }
}

watch(() => props.modelValue, (value) => {
  if (!isOpen.value) {
    searchQuery.value = value
  }
})

onMounted(() => {
  searchQuery.value = props.modelValue
  document.addEventListener('click', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <div
    ref="rootRef"
    class="relative"
  >
    <div class="relative">
      <input
        ref="inputRef"
        :value="searchQuery"
        type="text"
        autocomplete="off"
        role="combobox"
        :aria-expanded="isOpen"
        aria-autocomplete="list"
        :placeholder="placeholder"
        class="touch-target w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-3 text-sm outline-none focus:ring-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        :class="[
          accentFocusClass,
          modelValue ? 'pr-10' : 'pr-3',
        ]"
        :disabled="disabled"
        @focus="onInputFocus"
        @input="onInput"
        @keydown="onInputKeydown"
      >

      <button
        v-if="modelValue"
        type="button"
        class="touch-target absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
        aria-label="Clear selection"
        :disabled="disabled"
        @click.stop="clearSelection"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <ul
      v-if="isOpen && (filteredOptions.length > 0 || canAddCustom)"
      role="listbox"
      class="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
    >
      <li
        v-for="option in filteredOptions"
        :key="option"
        role="option"
        :aria-selected="option === modelValue"
        class="flex items-center"
      >
        <button
          type="button"
          class="touch-target min-w-0 flex-1 px-3 py-2.5 text-left text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800"
          :class="option === modelValue
            ? 'bg-slate-100 font-medium text-slate-900 dark:bg-slate-800 dark:text-slate-100'
            : 'text-slate-700 dark:text-slate-300'"
          @mousedown.prevent
          @click="selectOption(option)"
        >
          {{ option }}
        </button>

        <button
          v-if="isOptionDeletable(option)"
          type="button"
          class="touch-target mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-rose-500 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
          :aria-label="`Delete ${option}`"
          @mousedown.prevent
          @click.stop="deleteOption(option)"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </li>

      <li
        v-if="canAddCustom"
        role="option"
      >
        <button
          type="button"
          class="touch-target flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2.5 text-left text-sm font-medium text-emerald-600 transition hover:bg-emerald-50 dark:border-slate-800 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
          @mousedown.prevent
          @click="addCustomOption"
        >
          <svg
            class="h-4 w-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {{ addLabel }} "{{ searchQuery.trim() }}"
        </button>
      </li>
    </ul>

    <p
      v-else-if="isOpen && normalizedQuery && filteredOptions.length === 0"
      class="absolute z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-500 shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
    >
      No results. Press Enter to add.
    </p>
  </div>
</template>
