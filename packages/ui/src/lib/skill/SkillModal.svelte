<script lang="ts">
  import Modal from "../modal/Modal.svelte";
  import type { SkillNode } from "./map-helper";
  import SkillModalContent from "./SkillModalContent.svelte";
  import type { Experience } from "@lct/looplicant-types";

  export type SkillModalData = {
    x: number;
    y: number;
    data: SkillNode;
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
    isOpen
    onClose={handleClose}
    x={skillModalData.x}
    y={skillModalData.y}
    title={skillModalData.data.title}
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
