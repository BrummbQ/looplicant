"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useActionState, useState } from "react";
import { signIn } from "next-auth/react";
import { AuthError } from "next-auth";
import { AlertBox } from "@/components/ui/AlertBox";

const provider = { id: "nodemailer", name: "Email" };

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const login = async () => {
    try {
      await signIn(provider.id, { email, redirectTo: "/import" });
    } catch (error) {
      // Signin can fail for a number of reasons, such as the user
      // not existing, or the user not having the correct role.
      // In some cases, you may want to redirect to a custom error
      if (error instanceof AuthError) {
        console.error("AuthError:", error);
        return "Error signing in. Please try again.";
      }
    }
  };

  const [message, loginAction, isPending] = useActionState(login, null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login with Email</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex space-x-4" action={loginAction}>
          <Input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button disabled={isPending}>Send Email</Button>
        </form>
        {message && <AlertBox message={message} className="mt-4" />}
      </CardContent>
    </Card>
  );
}
