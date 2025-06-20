
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppProviders from './providers'; // Import AppProviders
import { PT_Sans, Playfair_Display } from 'next/font/google';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-pt-sans',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair-display',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Content Hub',
    template: '%s | Content Hub',
  },
  description: 'A decent looking blog with CMS feature. Discover insightful articles, tutorials, and reflections on technology, web development, and more.',
  openGraph: {
    title: 'Content Hub',
    description: 'A decent looking blog with CMS feature. Discover insightful articles, tutorials, and reflections on technology, web development, and more.',
    url: SITE_URL,
    siteName: 'Content Hub',
    images: [
      {
        url: `/og-image.png`, // Relative to metadataBase
        width: 1200,
        height: 630,
        alt: 'Content Hub - Your place for insightful articles',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Content Hub',
    description: 'A decent looking blog with CMS feature. Discover insightful articles, tutorials, and reflections on technology, web development, and more.',
    images: [`/og-image.png`], // Relative to metadataBase
    // creator: '@yourtwitterhandle', // Add your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // manifest: "/site.webmanifest", // Optional: If you have a manifest file
  // icons: { // Add if you have a favicon
  //   icon: '/favicon.ico', // Relative to metadataBase
  //   apple: '/apple-touch-icon.png', // Relative to metadataBase
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${ptSans.variable} ${playfairDisplay.variable}`}>
      <head>
        {/* Google Font links removed, next/font handles this */}
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <AppProviders> {/* Wrap children with AppProviders */}
          {children}
        </AppProviders>
        <Toaster />
      </body>
    </html>
  );
}
