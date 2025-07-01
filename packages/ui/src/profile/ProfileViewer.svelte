<svelte:options customElement="lct-profile-viewer" />

<script lang="ts">
  import { dispatchDataLoadEvent } from "../lib/event-dispatcher";
  import { applyUtilitySheet } from "../lib/style.svelte";
  import ExperienceTimeline from "./ExperienceTimeline.svelte";
  import SkillMap from "./SkillMap.svelte";
  import type { Experience } from "@lct/looplicant-types";

  type Props = {
    userId: string;
  };

  let { userId }: Props = $props();

  let experience = $state<Experience[]>();

  applyUtilitySheet($host());

  function experienceLoaded(exp: Experience[]) {
    experience = exp;
    dispatchDataLoadEvent($host(), exp);
  }
</script>

<SkillMap class="mb-6" {userId} {experience} host={$host()}></SkillMap>
<ExperienceTimeline {userId} {experienceLoaded}></ExperienceTimeline>

<style>
  :host {
    max-width: 900px;
    margin: 0 auto;
    text-align: left;
  }
</style>
