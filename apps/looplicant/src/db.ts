import neo4j, { Driver } from "neo4j-driver";

let dbDriver: Driver | undefined;

export function getDbDriver(): Driver {
  if (dbDriver == null) {
    dbDriver = neo4j.driver(
      process.env.NEO4J_URI!,
      neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!)
    );
  }
  return dbDriver;
}
