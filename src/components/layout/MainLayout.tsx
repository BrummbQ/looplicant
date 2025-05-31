import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { ToastProvider } from "@/components/ui/ToastContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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

export default function MainLayout({
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
          <div className="min-h-screen bg-background text-foreground flex flex-col items-center px-4 sm:px-6 md:px-8">
            <Header />

            <main className="w-full max-w-4xl space-y-8">{children}</main>

            <Footer />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
