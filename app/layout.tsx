// app/layout.tsx

import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Setup font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Safta Nas | Smart Contract Developer",
  description: "Portfolio of Safta Nasdalihin, a self-taught Smart Contract Developer focused on Solidity, EVM systems, protocol design, testing, and security-minded development.",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex flex-col min-h-screen"> 
              <Navbar />
              <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10 xl:px-12 grow"> 
                {children}
              </main>
              <Footer />
            </div>
        </ThemeProvider>
      </body>
    </html>
  )
}