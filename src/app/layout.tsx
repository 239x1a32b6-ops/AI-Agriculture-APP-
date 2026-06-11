import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AgriVision AI – Agriculture & Environment Intelligence",
  description: "AI-powered crop disease detection, pest identification, soil health advisor, weather-based farming guidance, and environment monitoring assistant.",
  keywords: ["agriculture", "crop disease", "pest detection", "soil health", "smart farming", "climate advisory", "sustainability"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full select-none">
      <body className={`${inter.variable} font-sans bg-slate-900 text-slate-100 min-h-full flex flex-col items-center justify-start antialiased`}>
        <AppProvider>
          {/* Centered layout wrapper to enforce premium mobile-first experience */}
          <div className="w-full max-w-md min-h-screen bg-slate-950 flex flex-col shadow-2xl shadow-emerald-950/20 border-x border-slate-800/40 relative">
            <main className="flex-1 pb-20 flex flex-col overflow-y-auto">
              {children}
            </main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
