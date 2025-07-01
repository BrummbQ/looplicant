import type { Skills } from "@lct/looplicant-types";
import {
  categoryDefaultBgColor,
  categoryDefaultTextColor,
  createSimulation,
  skillNodeId,
  type SkillNode,
} from "./map-helper";
import * as d3 from "d3";

let simulationRef: d3.Simulation<SkillNode, any> | undefined;
let nodes = $state<SkillNode[]>([]);

export function toggleCategory(category: string, skills: Skills) {
  if (!simulationRef || !skills) return;

  const skillNodes = skills.filter((s) => s.category === category);
  const currentNodes = simulationRef.nodes();
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

  simulationRef.nodes(updatedNodes as SkillNode[]);
  simulationRef.force(
    "link",
    d3
      .forceLink(links)
      .id((d: any) => d.id)
      .distance(500)
      .strength(55)
  );

  for (let i = 0; i < 300; ++i) simulationRef.tick();
  nodes = updatedNodes;
}

export function buildSimulation(skills: Skills, width: number, height: number) {
  if (!skills) {
    nodes = [];
    return;
  }

  const [simulation, categoryNodes] = createSimulation(skills, width, height);
  simulationRef = simulation;
  nodes = categoryNodes;
}

export function getNodes() {
  return nodes;
}
