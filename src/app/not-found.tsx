import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Error 404 - Page Not Found",
};

export default function NotFound() {
  return (
    <div className="px-2 w-full h-dvh">
      <div className="mx-auto mb-5 py-4 flex flex-col justify-between items-center gap-4">
        <h2 className="text-2xl">Page Not Found</h2>
        <Image
          className="m-0 rounded-xl max-w-full"
          src="/images/not-found.jpg"
          height={400}
          width={400}
          sizes="576px"
          alt="Page not found"
          priority={true}
          title="Page Not Found"
        />
      </div>
      <Link href="/" className="text-center hover:underline">
        <h3>Go Home</h3>
      </Link>
    </div>
  );
}
