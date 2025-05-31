import { auth } from "@/auth";
import { Button } from "./Button";
import { handleSignIn, handleSignOut } from "@/lib/actions";

export async function SignIn() {
  const session = await auth();

  return (
    <>
      {session ? (
        <form action={handleSignOut}>
          <Button variant="default">Sign Out</Button>
        </form>
      ) : (
        <form action={handleSignIn}>
          <Button variant="default">Sign In</Button>
        </form>
      )}
    </>
  );
}
