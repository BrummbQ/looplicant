<script lang="ts">
  import { onMount, onDestroy, type Snippet } from "svelte";

  interface ModalProps {
    id: string;
    isOpen: boolean;
    title: string;
    source: EventTarget;
    onClose?: () => void;
    children: Snippet;
  }

  let { id, isOpen, title, source, onClose, children }: ModalProps = $props();

  let dialogEl: HTMLDialogElement | null = null;

  // Open/close popover on state change
  $effect(() => {
    if (!dialogEl) return;
    isOpen ? dialogEl.showPopover({ source: source }) : dialogEl.hidePopover();
  });

  function handleClickOutside(e: MouseEvent) {
    if (!dialogEl?.contains(e.target as Node)) {
      handleCloseModal();
    }
  }

  function handleCloseModal() {
    if (onClose) {
      onClose();
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      handleCloseModal();
    }
  }

  onMount(() => {
    if (isOpen) {
      document.addEventListener("mouseup", handleClickOutside);
    }
  });

  onDestroy(() => {
    document.removeEventListener("mouseup", handleClickOutside);
  });
</script>

<dialog
  bind:this={dialogEl}
  {id}
  onkeydown={handleKeyDown}
  class="z-50 rounded-lg p-4 bg-white border shadow-xl text-sm"
  style="position-area: bottom"
  popover="auto"
>
  <div class="flex justify-between items-center mb-2">
    <h3 class="text-lg font-semibold text-gray-800">{title}</h3>
    <button
      class="text-md text-gray-600 cursor-pointer hover:text-black"
      onclick={handleCloseModal}
    >
      ✕
    </button>
  </div>

  {@render children?.()}
</dialog>
