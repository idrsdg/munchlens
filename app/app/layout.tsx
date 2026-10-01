import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MunchLens — Fotoğrafla Kalori Takibi",
  description: "Yemek fotoğrafını çek, yapay zeka kalori ve besin değerlerini hesaplasın. Akıllı beslenme takibi.",
  keywords: ["kalori takibi", "diyet", "beslenme", "yapay zeka", "fotoğraf analizi"],
  manifest: "/manifest.json",
  openGraph: {
    title: "MunchLens — Fotoğrafla Kalori Takibi",
    description: "Yemek fotoğrafını çek, yapay zeka kalori ve besin değerlerini hesaplasın. Akıllı beslenme takibi.",
    type: "website",
    siteName: "MunchLens",
    locale: "tr_TR",
  },
  twitter: {
    card: "summary_large_image",
    title: "MunchLens — Fotoğrafla Kalori Takibi",
    description: "Yemek fotoğrafını çek, yapay zeka kalori ve besin değerlerini hesaplasın.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f97316",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
