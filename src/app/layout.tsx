import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import '@/styles/globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Apex Consulting | Transforming Complexity Into Clarity',
  description: 'Premium consulting services delivering strategic clarity, operational excellence, and transformative insights for Fortune 500 companies.',
  keywords: ['consulting', 'strategy', 'digital transformation', 'operations', 'M&A', 'sustainability'],
  authors: [{ name: 'Apex Consulting' }],
  openGraph: {
    title: 'Apex Consulting | Premium Strategic Consulting',
    description: 'Transforming complexity into clarity for industry leaders.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
