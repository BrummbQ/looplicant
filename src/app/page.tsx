import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Coding Beauty2",
  description:
    "codingbeautydev.com: Coding - the art, the science, and the passion.",
};

export default function RootRedirect() {
  redirect("/cv");
}
