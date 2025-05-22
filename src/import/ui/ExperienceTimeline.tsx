import CardLoader from "@/components/ui/CardLoader";
import { Experience } from "../lib/actions";
import { Activity } from "lucide-react";

const formatDate = (date?: Date): string => {
  if (!date) return "Present";

  return new Date(date).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "short",
  });
};

export default function ExperienceTimeline({
  experience,
  isLoading,
}: {
  experience?: Experience[];
  isLoading: boolean;
}) {
  if (experience == null && !isLoading) {
    return;
  }

  return (
    <CardLoader
      title="Experience"
      loadingTitle="Extracting Experience..."
      isLoading={isLoading}
      icon={Activity}
    >
      <div className="border-l border-muted pl-6 space-y-12">
        {experience?.map((exp, i) => (
          <section key={i} className="relative group">
            <div className="absolute -left-9 top-3 w-6 h-6 rounded-full bg-primary border-4 border-secondary" />
            <div className="text-sm text-muted-foreground">
              <div className="flex justify-between items-center">
                <div>
                  <p className="italic">{exp.company}</p>
                  <h3 className="text-lg font-semibold text-foreground">
                    {exp.title}
                  </h3>
                </div>
                <span>
                  {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                </span>
              </div>

              <p className="my-4 text-accent">{exp.description}</p>

              {exp.bulletPoints && (
                <ul className="list-disc list-inside text-foreground space-y-1">
                  {exp.bulletPoints.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap gap-2 pt-4">
                {exp.skills.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-xs rounded-full bg-accent text-accent-foreground"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </CardLoader>
  );
}
