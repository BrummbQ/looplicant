import "server-only";

import { getDbDriver } from "@/db";
import { verifyAuthSession } from "@/lib/verify-auth";
import { Experience, Skill, Skills } from "@lct/looplicant-types";

function getSession() {
  return getDbDriver().session();
}

export async function getUserId(): Promise<string> {
  const auth = await verifyAuthSession();
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User {email: $email})
      RETURN u.id AS userId
      `,
      { email: auth.user.email }
    );

    if (!result.records.length) {
      throw new Error(`No user found for: ${auth.user.email}`);
    }

    return result.records[0]?.get("userId");
  } catch (error) {
    console.error("Neo4j error:", error);
    throw new Error("Failed to fetch user id from Neo4j");
  } finally {
    await session.close();
  }
}

export async function getExperience(userId: string): Promise<Experience[]> {
  const session = getSession();

  try {
    const result = await session.executeRead(async (tx) => {
      const res = await tx.run(
        `
        MATCH (u:User {id: $userId})-[:HAS_EXPERIENCE]->(e:Experience)
        ORDER BY e.endDate DESC
        RETURN e
        `,
        { userId }
      );
      return res.records.map((record) => {
        const e = record.get("e").properties;
        return {
          id: e.id,
          title: e.title,
          company: e.company,
          startDate: e.startDate,
          endDate: e.endDate ?? null,
          description: e.description,
          location: e.location ?? null,
          bulletPoints: e.bulletPoints ?? [],
          skills: e.skills ?? [],
        } as Experience;
      });
    });

    return result;
  } catch (error) {
    console.error("Neo4j error:", error);
    throw new Error("Failed to fetch experience from Neo4j");
  } finally {
    await session.close();
  }
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

export async function getSkills(userId: string): Promise<Skills> {
  const session = getSession();

  try {
    const result = await session.executeRead(async (tx) => {
      const res = await tx.run(
        `
        MATCH (u:User {id: $userId})-[:HAS_EXPERIENCE]->(e:Experience)-[:USED]->(s:Skill)
        RETURN s, e.id AS experienceId
        `,
        { userId }
      );

      // Map: skillId -> skill object
      const skillMap = new Map<string, Skill>();

      for (const record of res.records) {
        const s = record.get("s").properties;
        const experienceId = record.get("experienceId");

        const skillId = s.id;

        if (!skillMap.has(skillId)) {
          skillMap.set(skillId, {
            title: s.title,
            description: s.description,
            category: s.category,
            level: s.level,
            sources: [],
          });
        }

        skillMap.get(skillId)?.sources.push({ experienceId });
      }

      return Array.from(skillMap.values());
    });

    return result;
  } catch (error) {
    console.error("Neo4j error:", error);
    throw new Error("Failed to load skills from Neo4j");
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
