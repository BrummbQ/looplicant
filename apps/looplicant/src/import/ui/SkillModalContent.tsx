import { Skill, Experience } from "@lct/looplicant-types";
import { useMemo } from "react";

export default function SkillModalContent({
  skill,
  experience,
}: {
  skill: Skill;
  experience: Experience[];
}) {
  const skillWithExperience = useMemo(() => {
    return {
      ...skill,
      sources: skill.sources.map((src) => ({
        ...src,
        experience: experience.find((exp) => exp.id === src.experienceId),
      })),
    };
  }, [skill, experience]);

  return (
    <div className="space-y-2 max-w-24 min-w-xs">
      <p className="text-xs text-gray-500 italic">{skill.category}</p>
      <p className="text-sm text-gray-700">{skill.description}</p>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent"
          style={{ width: `${skill.level}%` }}
        />
      </div>
      <div className="text-xs text-gray-500">
        <p className="mt-4 mb-2">See experience:</p>
        <ul className="list-disc list-inside">
          {skillWithExperience.sources.map((src) => (
            <li key={src.experienceId} className="truncate">
              <a href={`#${src.experienceId}`}>
                {src.experience?.title} - {src.experience?.company}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
