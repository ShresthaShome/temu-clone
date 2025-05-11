import { LoaderCircle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loading...",
};

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-transparent">
      <div className="w-full h-dvh grid place-content-center">
        <LoaderCircle className="h-48 w-48 animate-spin bg-transparent text-orange-400/40" />
      </div>
    </div>
  );
}
