import { auth } from "@/auth";
import { getExperience, getSkills } from "@/import/lib/dal";
import ImportForm from "@/import/ui/ImportForm";
import { handleSignIn } from "@/lib/actions";
import { Suspense } from "react";

export default async function ImportPage() {
  const session = await auth();
  if (!session) {
    await handleSignIn();
  }

  const experience = getExperience();
  const skills = getSkills();

  return (
    <Suspense fallback={<></>}>
      <ImportForm experiencePromise={experience} skillsPromise={skills} />
    </Suspense>
  );
}
