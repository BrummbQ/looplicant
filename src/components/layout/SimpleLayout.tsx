import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { ToastProvider } from "@/components/ui/ToastContext";
import Footer from "@/components/layout/Footer";
import Header from "./Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Looplicant - AI Powered Application Assistant",
  description:
    "Generate compelling job applications and CVs with AI using Looplicant.",
};

export default function SimpleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          <div className="min-h-screen bg-background text-foreground items-center flex flex-col px-4 sm:px-6 md:px-8">
            <Header minimal={true} />

            <main className="w-full max-w-2xl space-y-8 flex-1 pt-16">
              {children}
            </main>

            <Footer />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
