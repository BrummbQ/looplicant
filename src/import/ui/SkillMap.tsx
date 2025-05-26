import { Bone } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Experience, Skills } from "../lib/actions";
import { cn } from "@/lib/utils";
import CardLoader from "@/components/ui/CardLoader";
import { useSkillMap } from "../hooks/use-skill-map";
import SkillModal, { SkillModalData } from "./SkillModal";

const height = 500;

export default function SkillMap({
  skills,
  experience,
  isLoading,
}: {
  skills?: Skills;
  experience?: Experience[];
  isLoading: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);
  const { toggleCategory, nodes } = useSkillMap(height, width, skills);
  const [skillModal, setSkillModal] = useState<SkillModalData>();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });

    observer.observe(el);

    return () => observer.disconnect();
    // ref is null if isLoading is true
  }, [isLoading]);

  const handleSkillModalClose = useCallback(() => {
    setSkillModal(undefined);
  }, []);

  if (!skills && !isLoading) return;

  return (
    <CardLoader
      title="Skills"
      loadingTitle="Extracting Skills..."
      isLoading={isLoading}
      icon={Bone}
    >
      <div ref={containerRef} className="relative w-full h-[600px]">
        {nodes.map((n) => (
          <div
            key={n.id}
            className={cn(
              `absolute size-20 rounded-full ${n.color} ${n.textColor} cursor-pointer flex items-center justify-center text-center text-xs shadow-md transition-transform duration-300 hover:scale-101 hover:z-30`
            )}
            style={{ transform: `translate(${n.x}px, ${n.y}px)` }}
            title={`${n.title}`}
            onClick={(e) => {
              if (n.type === "category") toggleCategory(n.title);
              else setSkillModal({ x: e.clientX, y: e.clientY, data: n });
            }}
          >
            {n.title}
          </div>
        ))}
      </div>

      <SkillModal
        skillModalData={skillModal}
        handleClose={handleSkillModalClose}
        experience={experience}
      />
    </CardLoader>
  );
}
