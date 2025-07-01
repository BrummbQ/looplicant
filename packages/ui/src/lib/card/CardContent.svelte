<svelte:options
  customElement={{
    tag: "lct-card-content",
    props: { class: { type: "Object" } },
  }}
/>

<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ClassValue } from "svelte/elements";

  let props: { class?: ClassValue; children: Snippet } = $props();
</script>

<div class={["p-6 pt-0", props.class]}>
  {@render props.children?.()}
</div>
