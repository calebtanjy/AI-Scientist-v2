import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Scientist v2 | Autonomous Scientific Discovery",
  description:
    "Workshop-level automated scientific discovery via agentic tree search. Generate ideas, run experiments, and produce research papers autonomously.",
  keywords: [
    "AI",
    "Machine Learning",
    "Scientific Discovery",
    "Research Automation",
    "Paper Generation",
  ],
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
