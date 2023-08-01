import { ref } from 'vue'

export function useKeyboardEvent() {
  const searchBoxRef = ref<HTMLDivElement>()
  function keyboardEventListener(event: KeyboardEvent) {
    // Ctrl+F or Cmd+F to show or hide search box
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
      event.preventDefault()
      searchBoxRef.value?.classList.toggle('hidden')
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
  }
}
