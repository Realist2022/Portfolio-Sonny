import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import AiChatBot from "../components/modals/AiChatBot";
import SocialDrips from "../components/SocialDrips";
import CursorGlow from "../components/CursorGlow";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sonny Tapara | Full-Stack Developer",
  description:
    "Portfolio site for Sonny Tapara, a full-stack developer focused on resilient software, strong systems thinking, and polished product experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#050507] text-[#f4ebe6]">
        <CursorGlow />
        <div className="flex min-h-full flex-col bg-[radial-gradient(circle_at_top,rgba(255,90,55,0.16),transparent_22%),radial-gradient(circle_at_bottom,rgba(255,90,55,0.08),transparent_28%),linear-gradient(180deg,#09090b_0%,#050507_100%)]">
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <SocialDrips />
          <AiChatBot />
        </div>
      </body>
    </html>
  );
}
