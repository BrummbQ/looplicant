import "server-only";

import { Experience, Skills } from "./actions";
import { getDbDriver } from "@/db";
import { verifyAuthSession } from "@/lib/verify-auth";

function getSession() {
  return getDbDriver().session();
}

export async function saveExperience(experience: Experience[]) {
  const auth = await verifyAuthSession();
  const session = getSession();

  try {
    await session.executeWrite(async (tx) => {
      // Delete ONLY the user's existing experiences
      await tx.run(
        `
        MATCH (u:User {email: $userEmail})-[:HAS_EXPERIENCE]->(e:Experience)
        DETACH DELETE e
        `,
        { userEmail: auth.user.email }
      );

      for (const exp of experience) {
        // Merge Experience node
        await tx.run(
          `
              MATCH (u:User {email: $userEmail})
              MERGE (e:Experience {id: $id})
              SET e.title = $title,
                  e.company = $company,
                  e.startDate = $startDate,
                  e.endDate = $endDate,
                  e.description = $description,
                  e.location = $location,
                  e.bulletPoints = $bulletPoints,
                  e.skills = $skills
              MERGE (u)-[:HAS_EXPERIENCE]->(e)
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
            userEmail: auth.user.email,
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
  await verifyAuthSession();
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
