import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";
import { SiteHeader } from "@/components/common/site-header";
import { SiteFooter } from "@/components/common/site-footer";
import { AuthProvider } from "@/components/providers/auth-provider";
import { BookingProvider } from "@/components/providers/booking-provider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001"),
  title: "Field Door",
  description: "Production-ready turf booking demo for a single premium venue.",
  openGraph: {
    title: "Field Door",
    description: "Book cricket, football, badminton, tennis, bowling, drift bikes, and paintball in one place.",
    images: ["/media/hero-poster.svg"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className={`${outfit.className} font-sans text-ink`}>
        <AuthProvider>
          <BookingProvider>
            <a href="#content" className="sr-only focus:not-sr-only">
              Skip to content
            </a>
            <SiteHeader />
            <main id="content">{children}</main>
            <SiteFooter />
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
