import { auth } from "@/auth";
import { getUserId } from "@/import/lib/dal";
import ImportForm from "@/import/ui/ImportForm";
import { handleSignIn } from "@/lib/actions";
import { Suspense } from "react";

export default async function ImportPage() {
  const session = await auth();
  if (!session) {
    await handleSignIn();
  }

  const userId = await getUserId();

  return (
    <Suspense fallback={<></>}>
      <ImportForm userId={userId} />
    </Suspense>
  );
}
