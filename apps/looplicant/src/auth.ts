import NextAuth from "next-auth";
import { Neo4jAdapter } from "@auth/neo4j-adapter";
import { getDbDriver } from "./db";
import authConfig from "./auth.config";

const dbDriver = getDbDriver();

const neo4jSession = dbDriver.session();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: Neo4jAdapter(neo4jSession),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  ...authConfig,
});
