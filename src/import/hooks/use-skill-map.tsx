import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import {
  categoryDefaultBgColor,
  categoryDefaultTextColor,
  createSimulation,
  SkillNode,
  skillNodeId,
} from "../lib/map-helper";
import { Skills } from "../lib/actions";

export function useSkillMap(height: number, width: number, skills?: Skills) {
  const simulationRef = useRef<d3.Simulation<SkillNode, any> | null>(null);
  const [nodes, setNodes] = useState<SkillNode[]>([]);

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
      n.color = categoryDefaultBgColor;
      n.textColor = categoryDefaultTextColor;
    });
    categoryNode.fx = fx;
    categoryNode.fy = fy;
    categoryNode.color = "bg-primary";
    categoryNode.textColor = "text-primary-foreground";

    // filter nodes not in category
    const filteredNodes = currentNodes.filter((n) => n.type === "category");

    // add new nodes for category
    const newSkillNodes = skillNodes.map(
      (skill) =>
        ({
          id: skillNodeId(skill),
          title: skill.title,
          category: skill.category,
          type: "skill",
          color: "bg-accent",
          textColor: "text-accent-foreground",
          x: fx,
          y: fy,
          skill,
        } as SkillNode)
    );
    // link skills to categories
    const links = newSkillNodes.map((skill) => ({
      source: skillNodeId(skill),
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
    if (!skills) return;

    const [simulation, categoryNodes] = createSimulation(skills, width, height);
    simulationRef.current = simulation;
    setNodes(categoryNodes);
  }, [skills, width]);

  return { toggleCategory, nodes };
}
