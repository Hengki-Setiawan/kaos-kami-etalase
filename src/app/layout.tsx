import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { PromoBanner } from "@/components/PromoBanner";
import { Chatbot } from "@/components/Chatbot";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Kaos Kami",
    template: "%s | Kaos Kami"
  },
  description: "Streetwear dengan sentuhan anime & musik. Koleksi kaos eksklusif dengan QR label digital. Temukan style unikmu!",
  keywords: ["kaos", "streetwear", "anime", "music", "fashion", "indonesia", "bandung", "t-shirt"],
  authors: [{ name: "Kaos Kami" }],
  creator: "Kaos Kami",
  publisher: "Kaos Kami",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kaos Kami",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://kaoskami.com",
    siteName: "Kaos Kami",
    title: "Kaos Kami",
    description: "Streetwear dengan sentuhan anime & musik. Koleksi kaos eksklusif dengan QR label digital.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kaos Kami"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaos Kami",
    description: "Streetwear dengan sentuhan anime & musik.",
    images: ["/og-image.jpg"]
  },
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
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
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#00d4ff',
          colorBackground: '#0a0a0c',
          colorText: '#ffffff',
          colorTextSecondary: '#ffffff80',
          colorInputBackground: '#141418',
          colorInputText: '#ffffff',
          borderRadius: '0px',
        },
        elements: {
          card: 'bg-[#0f0f12] border border-white/10 shadow-2xl',
          formButtonPrimary: 'bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-black font-bold uppercase tracking-wider',
          footerActionLink: 'text-[#00d4ff] hover:text-[#00d4ff]/80',
          headerTitle: 'text-white font-black uppercase tracking-tight',
          headerSubtitle: 'text-white/40',
          socialButtonsBlockButton: 'border-white/10 hover:bg-white/5',
          formFieldLabel: 'text-white/60 uppercase tracking-wider text-xs font-bold',
          formFieldInput: 'bg-white/5 border-white/10 text-white',
        },
      }}
    >
      <html lang="id" suppressHydrationWarning>
        <head>
          <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/logo.png" />
          <link rel="shortcut icon" href="/logo.png" />
          <link rel="apple-touch-icon" href="/logo.png" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        </head>
        <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
          <PromoBanner />
          {children}
          <Analytics />
          <Chatbot />
        </body>
      </html>
    </ClerkProvider>
  );
}
