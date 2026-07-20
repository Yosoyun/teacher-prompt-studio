import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

const metadataBase: Metadata = {
  title: "Teacher Prompt Studio | Dependable assessment production",
  description:
    "Turn an Indian board, class and chapter into a production brief for separate student files, an editable master and teacher key—then reuse what works.",
  applicationName: "Teacher Prompt Studio",
  keywords: [
    "teacher prompt builder",
    "CBSE question paper generator prompt",
    "ICSE teacher AI prompts",
    "DPP prompt generator",
    "Indian teacher AI tools",
    "AI teaching artifact maker",
    "interactive classroom simulation builder",
    "teacher PDF and DOCX generator",
    "lesson plan prompt",
    "assessment prompt",
    "JEE prompt builder",
    "teaching AI tools",
    "AI prompt architect for teachers",
    "Socratic tutor prompt",
    "curriculum and assessment design",
  ],
  authors: [{ name: "Teacher Prompt Studio" }],
  creator: "Teacher Prompt Studio",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host");
  const requestedHost = (forwardedHost || requestHeaders.get("host") || "localhost:3000")
    .split(",")[0]
    .trim();
  const host = /^[a-z0-9.-]+(?::\d+)?$/i.test(requestedHost)
    ? requestedHost
    : "localhost:3000";
  const forwardedProto = requestHeaders.get("x-forwarded-proto");
  const requestedProto = (forwardedProto || "").split(",")[0].trim();
  const protocol =
    requestedProto === "http" || requestedProto === "https"
      ? requestedProto
      : host.startsWith("localhost")
        ? "http"
        : "https";
  const origin = `${protocol}://${host}`;
  const imageUrl = `${origin}/og-beast.png`;

  return {
    ...metadataBase,
    metadataBase: new URL(origin),
    openGraph: {
      type: "website",
      url: origin,
      siteName: "Teacher Prompt Studio",
      title: "Teacher Prompt Studio",
      description:
        "Turn an Indian board, class and chapter into an exact assessment-production brief, hand it to your AI and reuse the setups that return usable files.",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Teacher Prompt Studio — artifact-first AI creation for teachers.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Teacher Prompt Studio",
      description:
        "A four-step assessment-production system for Indian teachers, with real-file contracts and a private proof loop.",
      images: [imageUrl],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f1efe8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
