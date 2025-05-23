import { Bone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Skills } from "../lib/actions";
import * as d3 from "d3";
import { cn } from "@/lib/utils";
import CardLoader from "@/components/ui/CardLoader";
import { createSimulation, SkillNode } from "../lib/map-helper";

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
  const simulationRef = useRef<d3.Simulation<SkillNode, any> | null>(null);
  const [nodes, setNodes] = useState<any[]>([]);

  const toggleCategory = (category: string) => {
    const sim = simulationRef.current;
    if (!sim || !skills) return;

    const skillNodes = skills.filter((s) => s.category === category);
    const currentNodes = sim.nodes();
    const categoryNode = currentNodes.find((n) => n.id === `cat-${category}`);
    if (!categoryNode) return;

    // fix category node
    const fx = categoryNode.x;
    const fy = categoryNode.y;
    currentNodes.forEach((n) => {
      n.fx = undefined;
      n.fy = undefined;
    });
    categoryNode.fx = fx;
    categoryNode.fy = fy;

    // filter nodes not in category
    const filteredNodes = currentNodes.filter((n) => n.type === "category");

    // add new nodes for category
    const newSkillNodes = skillNodes.map((skill, i) => ({
      id: skill.title,
      title: skill.title,
      category: skill.category,
      type: "skill",
      color: colors[i % colors.length],
      x: fx,
      y: fy,
    }));
    // link skills to categories
    const links = newSkillNodes.map((skill) => ({
      source: skill.title,
      target: `cat-${skill.category}`,
    }));

    const updatedNodes = [...filteredNodes, ...newSkillNodes];

    sim.nodes(updatedNodes as SkillNode[]);
    sim.force(
      "link",
      d3
        .forceLink(links)
        .id((d: any) => d.id)
        .distance(500)
        .strength(55)
    );

    for (let i = 0; i < 300; ++i) sim.tick();
    setNodes(updatedNodes);
  };

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

  useEffect(() => {
    if (!skills) return;

    const [simulation, categoryNodes] = createSimulation(skills, width, height);
    simulationRef.current = simulation;
    setNodes(categoryNodes);
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
            onClick={() => {
              if (type === "category") toggleCategory(title);
            }}
          >
            {title}
          </div>
        ))}
      </div>
    </CardLoader>
  );
}
