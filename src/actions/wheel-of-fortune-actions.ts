"use server";

import { Product } from "@/sanity.types";
import { createClient } from "next-sanity";

export const wheelOfFortuneSetup = async () => {
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    useCdn: true,
  });

  const getRandomProducts = (
    await client.fetch<Product[]>(`*[_type == "product"]`)
  )
    .sort(() => 0.5 - Math.random())
    .slice(0, 6);

  const today = new Date();
  const [day, month, year] = [
    today.getDate(),
    today.getMonth(),
    today.getFullYear(),
  ];

  const winningIndex =
    (day * 31 + month * 12 + year) % getRandomProducts.length;

  return { getRandomProducts, winningIndex };
};
