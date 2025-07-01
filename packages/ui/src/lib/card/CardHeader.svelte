<svelte:options
  customElement={{
    tag: "lct-card-header",
    props: { class: { type: "Object" } },
  }}
/>

<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ClassValue } from "svelte/elements";

  let props: { class?: ClassValue; children: Snippet } = $props();
</script>

<div class={["flex flex-col space-y-1.5 p-6", props.class]}>
  {@render props.children?.()}
</div>
