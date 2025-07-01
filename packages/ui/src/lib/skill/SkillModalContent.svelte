<script lang="ts">
  import type { Skill, Experience } from "@lct/looplicant-types";

  type Props = {
    skill: Skill;
    experience: Experience[];
    host: HTMLElement;
  };

  let { skill, experience, host }: Props = $props();

  // derived skill with matching experience references
  const skillWithExperience = $derived.by(() => ({
    ...skill,
    sources: skill.sources.map((src) => ({
      ...src,
      experience: experience.find((exp) => exp.id === src.experienceId),
    })),
  }));

  function scrollToExperience(evt: MouseEvent, expId: string) {
    const expHeader = host.shadowRoot?.getElementById(expId);
    expHeader?.scrollIntoView();
  }
</script>

<div class="space-y-2 max-w-24 min-w-xs">
  <p class="text-xs text-gray-500 italic mb-1">{skill.category}</p>
  <p class="text-sm text-gray-700">{skill.description}</p>

  <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
    <div class="h-full bg-accent" style={`width: ${skill.level}%`}></div>
  </div>

  <div class="text-xs text-gray-500">
    <p class="mt-4 mb-2">See experience:</p>
    <ul class="list-disc list-inside">
      {#each skillWithExperience.sources as src (src.experienceId)}
        <li class="">
          <button
            type="button"
            class="truncate"
            onmousedown={(evt) => scrollToExperience(evt, src.experienceId)}
            style="max-width: 22em"
          >
            {src.experience?.title} - {src.experience?.company}
          </button>
        </li>
      {/each}
    </ul>
  </div>
</div>
