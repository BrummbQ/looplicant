import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function verifyAuthSession(): Promise<{
  expires: string;
  user: { email: string };
}> {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  if (!session.user?.email) {
    throw new Error("User email is required for authentication.");
  }

  return { ...session, user: { email: session.user?.email } };
}
