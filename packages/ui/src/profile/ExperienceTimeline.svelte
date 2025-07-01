<script lang="ts">
  import { Activity } from "lucide-svelte";
  import CardLoader from "../lib/card/CardLoader.svelte";
  import { type Experience } from "@lct/looplicant-types";

  import { onMount } from "svelte";

  let {
    userId,
    experienceLoaded,
  }: { userId: string; experienceLoaded?: (exp: Experience[]) => void } =
    $props();

  let experience = $state<Experience[]>([]);
  let isLoading = $state(true);
  let error = $state<string | null>(null);

  onMount(async () => {
    isLoading = true;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_LOOPLICANT_API_BASE ?? ""}/api/experience/${userId}`
      );
      if (!res.ok) throw new Error("Failed to fetch experience");
      const data = await res.json();
      experienceLoaded?.(data);
      experience = data;
    } catch (err: any) {
      console.error("Error loading experience", err);
      error = err;
    } finally {
      isLoading = false;
    }
  });

  const formatDate = (date?: Date): string => {
    if (!date) return "Present";
    return new Date(date).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "short",
    });
  };
</script>

{#if isLoading || experience}
  <CardLoader
    title="Experience"
    loadingTitle="Extracting Experience..."
    {isLoading}
    icon={Activity}
  >
    <div class="border-l border-muted pl-6 space-y-12">
      {#each experience as exp (exp.id)}
        <section id={exp.id} class="relative group">
          <div
            class="absolute -left-9 top-3 w-6 h-6 rounded-full bg-primary border-4 border-secondary"
          ></div>
          <div class="text-sm text-muted-foreground">
            <div class="flex justify-between items-center">
              <div>
                <p class="italic">{exp.company}</p>
                <h3 id={exp.id} class="text-lg font-semibold text-foreground">
                  {exp.title}
                </h3>
              </div>
              <span>
                {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
              </span>
            </div>

            <p class="my-4 text-accent">{exp.description}</p>

            {#if exp.bulletPoints?.length}
              <ul class="list-disc list-inside text-foreground space-y-1">
                {#each exp.bulletPoints as point}
                  <li>{point}</li>
                {/each}
              </ul>
            {/if}

            <div class="flex flex-wrap gap-2 pt-4">
              {#each exp.skills as kw}
                <span
                  class="px-2 py-0.5 text-xs rounded-full bg-accent text-accent-foreground"
                >
                  {kw}
                </span>
              {/each}
            </div>
          </div>
        </section>
      {/each}
    </div>
  </CardLoader>
{/if}

<style>
  :host {
    display: block;
  }
</style>
