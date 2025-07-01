<script lang="ts">
  import { Loader2 } from "lucide-svelte";
  import Card from "./Card.svelte";
  import CardHeader from "./CardHeader.svelte";
  import CardTitle from "./CardTitle.svelte";
  import CardContent from "./CardContent.svelte";
  import type { Snippet } from "svelte";
  import type { ClassValue } from "svelte/elements";

  interface Props {
    class?: ClassValue;
    loadingTitle: string;
    title: string;
    isLoading: boolean;
    icon: typeof Loader2;
    children: Snippet;
  }

  let props: Props = $props();
</script>

<Card class={[{ "animate-pulse": props.isLoading }, props.class]}>
  {#snippet header()}
    <CardHeader>
      <div class="flex items-center">
        {#if props.isLoading}
          <Loader2 class="h-7 w-7 text-muted-foreground" />
        {:else}
          <svelte:component this={props.icon} class="h-7 w-7 text-primary" />
        {/if}
        <CardTitle class="text-muted-foreground ml-2">
          {props.isLoading ? props.loadingTitle : props.title}
        </CardTitle>
      </div>
    </CardHeader>
  {/snippet}

  {#snippet content()}
    <CardContent class="space-y-4">
      {#if props.isLoading}
        <div class="h-5 bg-background rounded w-3/4"></div>
        <div class="h-5 bg-background rounded w-full"></div>
        <div class="h-5 bg-background rounded w-5/6"></div>
        <div class="h-5 bg-background rounded w-full"></div>
      {:else}
        {@render props.children?.()}
      {/if}
    </CardContent>
  {/snippet}
</Card>
