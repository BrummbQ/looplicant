import * as d3 from "d3";
import { Skill, Skills } from "./actions";

export type SkillNode = d3.SimulationNodeDatum & {
  id: string;
  title: string;
  type: "category" | "skill";
  color: string;
  textColor: string;
  category?: string;
  skill?: Skill;
};

export const categoryDefaultBgColor = "bg-secondary";
export const categoryDefaultTextColor = "text-secondary-foreground";

export const skillNodeId = (skill: {
  title: string;
  category?: string;
}): string => `${skill.title}-${skill.category}`;

export function createSimulation(
  skills: Skills,
  width: number,
  height: number
): [d3.Simulation<SkillNode, any>, SkillNode[]] {
  const categories = [...new Set(skills.map((s) => s.category))];
  const categoryNodes = categories.map((cat, i) => ({
    id: `cat-${cat}`,
    type: "category",
    title: cat,
    color: categoryDefaultBgColor,
    textColor: categoryDefaultTextColor,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
  })) as SkillNode[];

  const simulation = d3
    .forceSimulation(categoryNodes)
    .force("charge", d3.forceManyBody().strength(5))
    .force(
      "collision",
      d3.forceCollide(() => 50)
    )
    .force("center", d3.forceCenter(width / 2, height / 2).strength(0.05))
    .force("attract", () => {
      for (const node of simulation.nodes()) {
        const strength = 0.01;
        if (
          node.vx != null &&
          node.vy != null &&
          node.x != null &&
          node.y != null
        ) {
          node.vx += (width / 2 - node.x) * strength;
          node.vy += (height / 2 - node.y) * strength;
        }
      }
    })
    .stop();

  for (let i = 0; i < 300; ++i) simulation.tick();

  return [simulation, categoryNodes];
}
