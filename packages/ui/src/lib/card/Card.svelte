<svelte:options
  customElement={{
    tag: "lct-card",
    props: { class: { type: "Object" } },
  }}
/>

<script lang="ts">
  import type { Snippet } from "svelte";
  import type { ClassValue } from "svelte/elements";

  let props: { class: ClassValue; header: Snippet; content: Snippet } =
    $props();
</script>

<section
  class={["rounded-lg bg-card text-card-foreground shadow-sm", props.class]}
>
  {@render props.header?.()}
  {@render props.content?.()}
</section>
