import "server-only";

import neo4j from "neo4j-driver";
import { Experience, Skills } from "./actions";

const driver = neo4j.driver(
  process.env.NEO4J_URI!,
  neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!)
);

function getSession() {
  return driver.session();
}

export async function saveExperience(experience: Experience[]) {
  const session = getSession();

  try {
    await session.executeWrite(async (tx) => {
      // Clear all existing nodes and relationships
      await tx.run(`MATCH (n) DETACH DELETE n`);

      for (const exp of experience) {
        // Merge Experience node
        await tx.run(
          `
              MERGE (e:Experience {id: $id})
              SET e.title = $title,
                  e.company = $company,
                  e.startDate = $startDate,
                  e.endDate = $endDate,
                  e.description = $description,
                  e.location = $location,
                  e.bulletPoints = $bulletPoints,
                  e.skills = $skills
              `,
          {
            id: exp.id,
            title: exp.title,
            company: exp.company,
            startDate: exp.startDate,
            endDate: exp.endDate ?? null,
            description: exp.description,
            location: exp.location ?? null,
            bulletPoints: exp.bulletPoints ?? [],
            skills: exp.skills ?? [],
          }
        );
      }
    });
  } catch (error) {
    console.error("Neo4j error:", error);
    throw new Error("Failed to save experience to Neo4j");
  } finally {
    await session.close();
  }
}

export async function saveAndLinkSkills(skills: Skills) {
  const session = getSession();

  try {
    await session.executeWrite(async (tx) => {
      // Link Skills
      for (const skill of skills) {
        for (const skillSrc of skill.sources) {
          await tx.run(
            `
                  MERGE (s:Skill {id: $skillId})
                  SET s.title = $title,
                      s.description = $description,
                      s.category = $category,
                      s.level = $level
                  MERGE (e:Experience {id: $experienceId})
                  MERGE (e)-[:USED]->(s)
              `,
            {
              experienceId: skillSrc.experienceId,
              skillId: `${skill.title}-${skill.category}`,
              title: skill.title,
              description: skill.description,
              category: skill.category,
              level: skill.level,
            }
          );
        }
      }
    });
  } catch (error) {
    console.error("Neo4j error:", error);
    throw new Error("Failed to save skills to Neo4j");
  } finally {
    await session.close();
  }
}
