"use client";

import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Error - Something went wrong",
};

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div className="px-2 mx-auto py-4 w-full flex flex-col justify-between items-center gap-10 my-5">
      <h2 className="text-center font-bold text-xl">Something went wrong!</h2>

      <Image
        className="m-0 rounded-xl max-w-full"
        src="/images/error.png"
        height={256}
        width={256}
        sizes="256px"
        alt="Error"
        priority={true}
        title="Error"
      />
      {error && <p className="text-center">{error.message}</p>}
    </div>
  );
}
