import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

const metadataBase: Metadata = {
  title: "Teacher Prompt Studio | One-tap AI missions for Indian teachers",
  description:
    "Create question papers, DPPs, notes, mind maps, lesson packs and deeper teacher prompts with tap-first recipes for Indian classrooms.",
  applicationName: "Teacher Prompt Studio",
  keywords: [
    "teacher prompt builder",
    "CBSE question paper generator prompt",
    "ICSE teacher AI prompts",
    "DPP prompt generator",
    "Indian teacher AI tools",
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
    icon: "/og.png",
    shortcut: "/og.png",
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
        "From classroom idea to AI-ready masterpiece—tap-first recipes, Indian board context and 79 expert teacher workflows.",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Teacher Prompt Studio — from classroom idea to AI-ready masterpiece.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Teacher Prompt Studio",
      description:
        "Question papers, DPPs, notes, mind maps and 79 expert workflows for Indian teachers.",
      images: [imageUrl],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#061511",
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
