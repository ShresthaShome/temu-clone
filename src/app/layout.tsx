import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { getCurrentSession } from "@/actions/auth";
import { SanityLive } from "@/sanity/lib/live";
import Cart from "@/components/Cart";
import Script from "next/script";
import { Suspense } from "react";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import HeaderCategorySelector from "@/components/HeaderCategorySelector";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Temu Clone", template: "%s | Temu Clone" },
  description: "Made by Ullas Shome",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getCurrentSession();

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-white min-h-[125vh]`}>
        <Header user={user} categorySelector={<HeaderCategorySelector />} />
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="1ba6356b-607a-4f5a-9234-99930847e7b6"
          strategy="afterInteractive"
        />

        <Suspense>
          <AnalyticsTracker user={user} />
        </Suspense>

        {children}

        <Cart />
        <SanityLive />
      </body>
    </html>
  );
}
