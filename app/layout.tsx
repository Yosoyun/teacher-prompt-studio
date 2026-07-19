import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

const metadataBase: Metadata = {
  title: "Teacher Prompt Studio | Adaptive prompts for every teacher",
  description:
    "Build next-level teacher prompts with adaptive reasoning, pedagogy, cognitive demand, evidence alignment, source boundaries and built-in quality checks.",
  applicationName: "Teacher Prompt Studio",
  keywords: [
    "teacher prompt builder",
    "lesson plan prompt",
    "assessment prompt",
    "JEE prompt builder",
    "teaching AI tools",
    "AI prompt architect for teachers",
    "Socratic tutor prompt",
    "curriculum and assessment design",
  ],
  authors: [{ name: "Indrajeet Yadav" }],
  creator: "Indrajeet Yadav",
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
  const imageUrl = `${origin}/og-v2.png`;

  return {
    ...metadataBase,
    metadataBase: new URL(origin),
    openGraph: {
      type: "website",
      url: origin,
      siteName: "Teacher Prompt Studio",
      title: "Teacher Prompt Studio",
      description:
        "Describe the teaching challenge. Get a prompt that thinks ahead—79 expert workflows with adaptive reasoning and built-in quality checks.",
      images: [
        {
          url: imageUrl,
          width: 1731,
          height: 909,
          alt: "Teacher Prompt Studio — describe the teaching challenge and get a prompt that thinks ahead.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Teacher Prompt Studio",
      description:
        "79 expert teacher workflows powered by adaptive prompt architecture.",
      images: [imageUrl],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3efe5",
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
