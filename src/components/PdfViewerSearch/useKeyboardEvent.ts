import { ref } from 'vue'

export function useKeyboardEvent() {
  const searchBoxRef = ref<HTMLDivElement>()

  function closeSearchBox() {
    searchBoxRef.value?.classList.add('hidden')
  }
  function keyboardEventListener(event: KeyboardEvent) {
    // Ctrl+F or Cmd+F to show or hide search box
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
      event.preventDefault()
      searchBoxRef.value?.classList.toggle('hidden')
      if (!searchBoxRef.value?.classList.contains('hidden')) {
        searchBoxRef.value?.querySelector('input')?.focus()
        searchBoxRef.value?.querySelector('input')?.select()
      }
    }
    else if (event.key === 'Escape') {
      event.preventDefault()
      searchBoxRef.value?.classList.add('hidden')
    }
  }
  function registerKeyboardEvent() {
    window.addEventListener('keydown', keyboardEventListener)
  }

  function unregisterKeyboardEvent() {
    window.removeEventListener('keydown', keyboardEventListener)
  }

  return {
    searchBoxRef,
    registerKeyboardEvent,
    unregisterKeyboardEvent,
    closeSearchBox,
  }
}
