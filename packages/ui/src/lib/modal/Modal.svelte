<script lang="ts">
  import { onMount, onDestroy, type Snippet } from "svelte";

  interface ModalProps {
    isOpen: boolean;
    x: number;
    y: number;
    title: string;
    onClose?: () => void;
    children: Snippet;
  }

  let { isOpen, x, y, title, onClose, children }: ModalProps = $props();

  let dialogEl: HTMLDialogElement | null = null;
  let pos = $state({ left: x, top: y });

  // Open/close popover on state change
  $effect(() => {
    if (!dialogEl) return;
    isOpen ? dialogEl.showPopover() : dialogEl.hidePopover();
  });

  // Reposition if x/y change
  $effect(() => {
    if (!dialogEl) return;

    const { offsetWidth, offsetHeight } = dialogEl;

    let newLeft = x;
    let newTop = y;

    // Adjust if near edges
    if (x + offsetWidth > window.innerWidth) {
      newLeft = window.innerWidth - offsetWidth - 10;
    }
    if (y + offsetHeight > window.innerHeight) {
      newTop = window.innerHeight - offsetHeight - 10;
    }

    pos = { left: newLeft, top: newTop };
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
  onkeydown={handleKeyDown}
  class="z-50 rounded-lg p-4 bg-white border shadow-xl text-sm"
  popover="auto"
  style={`position: absolute; left: ${pos.left}px; top: ${pos.top}px;`}
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
