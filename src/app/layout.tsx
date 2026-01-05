import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Kaos Kami — Streetwear Anime & Music",
    template: "%s | Kaos Kami"
  },
  description: "Streetwear dengan sentuhan anime & musik. Koleksi kaos eksklusif dengan QR label digital. Temukan style unikmu!",
  keywords: ["kaos", "streetwear", "anime", "music", "fashion", "indonesia", "bandung", "t-shirt"],
  authors: [{ name: "Kaos Kami" }],
  creator: "Kaos Kami",
  publisher: "Kaos Kami",
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://kaoskami.com",
    siteName: "Kaos Kami",
    title: "Kaos Kami — Streetwear Anime & Music",
    description: "Streetwear dengan sentuhan anime & musik. Koleksi kaos eksklusif dengan QR label digital.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kaos Kami - Streetwear Anime & Music"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaos Kami — Streetwear Anime & Music",
    description: "Streetwear dengan sentuhan anime & musik.",
    images: ["/og-image.jpg"]
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png"
  }
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
