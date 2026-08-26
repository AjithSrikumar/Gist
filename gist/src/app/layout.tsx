import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { OverlayHost } from "@/components/overlays/OverlayHost";
import { SwRegister } from "@/components/SwRegister";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gist — Key ideas from the world's best nonfiction",
  description:
    "Gist gives you the key ideas from bestselling nonfiction books in minutes. Read, build a streak, grow every day.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Gist", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#F7F3EA",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-dvh">
        {children}
        <OverlayHost />
        <SwRegister />
      </body>
    </html>
  );
}
