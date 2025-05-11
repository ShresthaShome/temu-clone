import { wheelOfFortuneSetup } from "@/actions/wheel-of-fortune-actions";
import SalesCampaignBanner from "@/components/SalesCampaignBanner";
import WheelOfFortune from "@/components/WheelOfFortune";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { getRandomProducts, winningIndex } = await wheelOfFortuneSetup();

  return (
    <main>
      <SalesCampaignBanner />
      <WheelOfFortune
        products={getRandomProducts}
        winningIndex={winningIndex}
      />
      {children}
    </main>
  );
}
