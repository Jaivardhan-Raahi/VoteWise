import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VoteWise | Find Your Alignment",
  description: "Objective, distraction-free determination of voter alignment with candidates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
