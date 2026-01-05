import type { Metadata } from "next";
import "./globals.css";
import { FavoritesProvider } from '@/app/context/FavoritesContext';
import { ThemeProvider } from '@/app/context/ThemeContext';
import { RecentlyViewedProvider } from '@/app/context/RecentlyViewedContext';

export const metadata: Metadata = {
  title: "Property Portal Pro - Find Your Next Home",
  description: "Advanced property search with favorites, statistics, and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <FavoritesProvider>
            <RecentlyViewedProvider>
              {children}
            </RecentlyViewedProvider>
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
