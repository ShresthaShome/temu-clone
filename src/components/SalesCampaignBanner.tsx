"use client";

import { formatTime } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function getTimeRemaining() {
  const total = new Date().setHours(20, 0, 0) - Date.now();
  return total / 1000;
}

export default function SalesCampaignBanner() {
  const router = useRouter();

  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getTimeRemaining());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600 py-3 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-white uppercase">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold animate-bounce">
              🔥
            </span>
            <div className="text-sm sm:text-base font-bold">
              Flash sale ends in:
            </div>
            {time ? (
              <div className="bg-white/20 rounded px-2 py-1 font-mono font-bold">
                {formatTime(Math.floor(time / 3600))}:
                {formatTime(Math.floor((time % 3600) / 60))}:
                {formatTime(Math.floor(time % 60))}
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">⚡️</span>
            <span className="font-bold text-yellow-200 animate-pulse">
              Up to 95% off!
            </span>
          </div>

          <button
            className="bg-white text-red-600 px-4 py-1 rounded-full font-bold text-sm hover:bg-yellow-100 transition-colors shadow-lg hover:cursor-pointer uppercase"
            onClick={() => router.push("/shop")}
          >
            Shop Now!
          </button>
        </div>
      </div>
    </div>
  );
}
