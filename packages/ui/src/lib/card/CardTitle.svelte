<svelte:options
  customElement={{
    tag: "lct-card-title",
    props: { class: { type: "Object" } },
  }}
/>

<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ClassValue } from "svelte/elements";

  let props: { class?: ClassValue; children: Snippet } = $props();
</script>

<h2 class={["text-2xl font-semibold leading-none tracking-tight", props.class]}>
  {@render props.children?.()}
</h2>
