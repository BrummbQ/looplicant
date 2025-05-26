import { Modal } from "@/components/ui/Modal";
import SkillModalContent from "./SkillModalContent";
import { SkillNode } from "../lib/map-helper";
import { Experience } from "../lib/actions";

export type SkillModalData = {
  x: number;
  y: number;
  data: SkillNode;
};

export default function SkillModal({
  skillModalData,
  experience,
  handleClose,
}: {
  skillModalData?: SkillModalData;
  experience?: Experience[];
  handleClose: () => void;
}) {
  return (
    <>
      {skillModalData && (
        <Modal
          isOpen={!!skillModalData}
          onClose={handleClose}
          x={skillModalData.x}
          y={skillModalData.y}
          title={skillModalData.data.title}
        >
          {skillModalData?.data.skill && experience && (
            <SkillModalContent
              skill={skillModalData.data.skill}
              experience={experience}
            />
          )}
        </Modal>
      )}
    </>
  );
}
