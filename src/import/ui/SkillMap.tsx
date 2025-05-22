import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Bone, UserCircle2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Skills } from "../lib/actions";
import * as d3 from "d3";
import { cn } from "@/lib/utils";
import CardLoader from "@/components/ui/CardLoader";

const colors = [
  "bg-red-600",
  "bg-orange-600",
  "bg-amber-600",
  "bg-yellow-600",
  "bg-lime-600",
  "bg-green-600",
  "bg-emerald-600",
  "bg-teal-600",
  "bg-cyan-600",
  "bg-sky-600",
  "bg-blue-600",
  "bg-indigo-600",
  "bg-violet-600",
  "bg-purple-600",
  "bg-fuchsia-600",
  "bg-pink-600",
  "bg-rose-600",
  "bg-gray-600",
  "bg-slate-600",
  "bg-zinc-600",
];

const height = 500;

export default function SkillMap({
  skills,
  isLoading,
}: {
  skills?: Skills;
  isLoading: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);

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

  const nodes = useMemo(() => {
    if (!skills) return [];

    const categories = [...new Set(skills.map((s) => s.category))];
    const categoryNodes = categories.map((cat, i) => ({
      id: `cat-${cat}`,
      type: "category",
      title: cat,
      color: "bg-gray-700",
      r: 40,
      x: 0,
      y: 0,
    }));

    const skillNodes = skills.map((skill, i) => ({
      id: skill.title,
      title: skill.title,
      category: skill.category,
      type: "skill",
      r: 20,
      color: colors[i % colors.length],
      x: 0,
      y: 0,
    }));

    const allNodes = [...categoryNodes, ...skillNodes];

    // link skills to categories
    const links = skillNodes.map((skill) => ({
      source: skill.title,
      target: `cat-${skill.category}`,
    }));
    const simulation = d3
      .forceSimulation(allNodes as d3.SimulationNodeDatum[])
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(50)
      )
      .force("charge", d3.forceManyBody().strength(-500))
      .force("x", d3.forceX(width / 2))
      .force("y", d3.forceY(height / 2))
      .stop();

    for (let i = 0; i < 300; ++i) simulation.tick();

    return [...allNodes];
  }, [skills, width]);

  if (!skills && !isLoading) return;

  return (
    <CardLoader
      title="Skills"
      loadingTitle="Extracting Skills..."
      isLoading={isLoading}
      icon={Bone}
    >
      <div ref={containerRef} className="relative w-full h-[600px]">
        {nodes.map(({ title, color, x, y, id, type }) => (
          <div
            key={id}
            className={cn(
              { "z-0": type === "skill", "z-20": type !== "skill" },
              `absolute size-20 rounded-full ${color} flex items-center justify-center text-center text-white text-xs shadow-md transition-transform duration-300 hover:scale-101 hover:z-30`
            )}
            style={{ transform: `translate(${x}px, ${y}px)` }}
            title={`${title}`}
          >
            {title}
          </div>
        ))}
      </div>
    </CardLoader>
  );
}
