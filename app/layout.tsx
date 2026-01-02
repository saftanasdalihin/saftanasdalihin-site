// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Setup font
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Safta Nas | Smart Contract Developer",
  description: "Safta Nasdalihin's professional portfolio, a Smart Contract Developer specializing in secure and audited Solidity development across various blockchain platforms.",
  alternates: {
    canonical: 'https://saftanasdalihin-site.vercel.app/',
  },
  keywords: ['Safta Nasdalihin', 'Safta Nasdalihin site', 'Safta Portfolio' ,'Smart Contract Developer', 'Solidity Developer', 'Blockchain Developer', 'DeFi', 'DApp', 'Ethereum', 'Portfolio'],
  authors: [{ name: 'Safta Nasdalihin', url: 'https://saftanasdalihin-site.vercel.app/' }],
  other: {
    'google-site-verification': '063gYNyEVLVWAtoIgLMJOrSK0baeVDUvPAjuSoUZvZc',
  },

  openGraph: {
    title: 'Safta Nasdalihin | Smart Contract Developer',
    description: "Safta Nasdalihin's professional portfolio, Smart Contract Developer.",
    url: 'https://saftanasdalihin-site.vercel.app/',
    siteName: 'Safta Nasdalihin Portfolio',
    images: [
      {
        url: 'https://saftanasdalihin-site.vercel.app/images/preview.png',
        width: 1200,
        height: 630,
        alt: 'Safta Nasdalihin Portfolio Image',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Safta Nasdalihin | Smart Contract Developer',
    description: "Safta Nasdalihin's professional portfolio, Smart Contract Developer.",
    images: ['https://saftanasdalihin-site.vercel.app/images/preview.png'],
  }, 

  // === DYNAMIC FAVICON ===
  icons: [
    {
      rel: 'icon',
      url: '/images/favicon-dark.png', 
      media: '(prefers-color-scheme: light)',
    },
    {
      rel: 'icon',
      url: '/images/favicon-light.png', 
      media: '(prefers-color-scheme: dark)',
    },
  ],
  // ========================
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex flex-col min-h-screen"> 
              <Navbar />
              <main className="container mx-auto px-4 py-8 grow"> 
                {children}
              </main>
              <Footer />
            </div>
        </ThemeProvider>
      </body>
    </html>
  )
}