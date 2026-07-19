import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

const metadataBase: Metadata = {
  title: "Teacher Prompt Studio | Prompts for every classroom",
  description:
    "Build clear, review-ready AI prompts for lessons, assessments, resources, differentiation, feedback, communication and professional learning.",
  applicationName: "Teacher Prompt Studio",
  keywords: [
    "teacher prompt builder",
    "lesson plan prompt",
    "assessment prompt",
    "JEE prompt builder",
    "teaching AI tools",
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
  const imageUrl = `${origin}/og.png`;

  return {
    ...metadataBase,
    metadataBase: new URL(origin),
    openGraph: {
      type: "website",
      url: origin,
      siteName: "Teacher Prompt Studio",
      title: "Teacher Prompt Studio",
      description:
        "Start with the teaching job. We’ll build the prompt—43 workflows for any subject and learner level.",
      images: [
        {
          url: imageUrl,
          width: 1731,
          height: 909,
          alt: "Teacher Prompt Studio — start with the teaching job, and we’ll build the prompt.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Teacher Prompt Studio",
      description:
        "43 review-ready prompt workflows for teachers in any subject.",
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
