<script lang="ts">
  import Modal from "../modal/Modal.svelte";
  import type { SkillNode } from "./map-helper";
  import SkillModalContent from "./SkillModalContent.svelte";
  import type { Experience } from "@lct/looplicant-types";

  export type SkillModalData = {
    data: SkillNode;
    source: EventTarget;
  };

  type Props = {
    skillModalData?: SkillModalData;
    experience?: Experience[];
    host: HTMLElement;
    handleClose: () => void;
  };

  let { skillModalData, experience, host, handleClose }: Props = $props();
</script>

{#if skillModalData}
  <Modal
    id="skillPopover"
    isOpen
    onClose={handleClose}
    title={skillModalData.data.title}
    source={skillModalData.source}
  >
    {#if skillModalData.data.skill && experience}
      <SkillModalContent
        skill={skillModalData.data.skill}
        {experience}
        {host}
      />
    {/if}
  </Modal>
{/if}
