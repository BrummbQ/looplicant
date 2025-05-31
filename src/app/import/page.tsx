import { auth } from "@/auth";
import ImportForm from "@/import/ui/ImportForm";
import { handleSignIn } from "@/lib/actions";

export default async function ImportPage() {
  const session = await auth();
  if (!session) {
    await handleSignIn();
  }

  return <ImportForm />;
}
