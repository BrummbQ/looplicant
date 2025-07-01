<script lang="ts">
  import { Bone } from "lucide-svelte";
  import { onMount } from "svelte";
  import type { Skills, Experience } from "@lct/looplicant-types";
  import CardLoader from "../lib/card/CardLoader.svelte";
  import SkillModal, {
    type SkillModalData,
  } from "../lib/skill/SkillModal.svelte";
  import {
    buildSimulation,
    getNodes,
    toggleCategory,
  } from "../lib/skill/map-simulation.svelte";
  import type { ClassValue } from "svelte/elements";

  type Props = {
    class?: ClassValue;
    host: HTMLElement;
    userId: string;
    experience?: Experience[];
  };

  let props: Props = $props();

  let skills = $state<Skills>([]);
  let isLoading = $state(true);
  let error = $state<string | null>(null);

  onMount(async () => {
    isLoading = true;
    try {
      const res = await fetch(`/api/skill/${props.userId}`);
      if (!res.ok) throw new Error("Failed to fetch skill");
      const data = await res.json();
      skills = data;
    } catch (err: any) {
      console.error("Error loading skill", err);
      error = err;
    } finally {
      isLoading = false;
    }
  });

  const height = 500;

  let width = $state<number>(0);
  let skillModal = $state<SkillModalData | undefined>(undefined);

  $effect(() => {
    buildSimulation(skills, width, height);
  });

  function handleSkillModalClose() {
    skillModal = undefined;
  }
</script>

{#if skills || isLoading}
  <CardLoader
    class={props.class}
    title="Skills"
    loadingTitle="Extracting Skills..."
    {isLoading}
    icon={Bone}
  >
    <div class="relative w-full h-[600px]" bind:clientWidth={width}>
      {#each getNodes() as n (n.id)}
        <button
          type="button"
          class={`absolute size-20 rounded-full ${n.color} ${n.textColor} cursor-pointer flex items-center justify-center text-center text-xs shadow-md transition-transform duration-300 hover:scale-101 hover:z-30`}
          style={`transform: translate(${n.x}px, ${n.y}px)`}
          title={n.title}
          onclick={(e) => {
            if (n.type === "category") toggleCategory(n.title, skills);
            else skillModal = { x: e.clientX, y: e.clientY, data: n };
          }}
        >
          {n.title}
        </button>
      {/each}
    </div>

    <SkillModal
      experience={props.experience}
      skillModalData={skillModal}
      host={props.host}
      handleClose={handleSkillModalClose}
    />
  </CardLoader>
{/if}

<style>
  :host {
    display: block;
  }
</style>
