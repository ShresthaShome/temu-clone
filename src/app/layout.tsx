import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { getCurrentSession } from "@/actions/auth";
import { SanityLive } from "@/sanity/lib/live";
import HeaderCategorySelector from "@/components/HeaderCategorySelector";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Temu Clone App",
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

        {children}

        <SanityLive />
      </body>
    </html>
  );
}
