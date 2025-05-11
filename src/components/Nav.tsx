import Link from "next/link";
import { type ReactNode } from "react";

export default function Nav({
  categorySelector,
}: {
  categorySelector: ReactNode;
}) {
  return (
    <div className="flex flex-1 justify-start items-center gap-4 sm:gap-6">
      <div className="group">
        <button className="text-gray-700 group-hover:text-orange-800 md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="absolute top-[100%-10px] left-3 opacity-0 block md:hidden invisible group-hover:opacity-100 group-hover:visible hover:opacity-100 hover:visible transition-all duration-100">
          <div className="w-50 bg-yellow-50 rounded-lg shadow-xl border border-gray-100">
            <div className="py-2">
              <Link
                href="/sales"
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-100"
              >
                Sales
              </Link>
              <Link
                href="/newest"
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-100"
              >
                Newest
              </Link>
              <div className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-100">
                {categorySelector}
              </div>
              <Link
                href="/shop"
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-100"
              >
                Shop
              </Link>
            </div>
          </div>
        </div>
      </div>

      <nav className="hidden md:flex gap-4 lg:gap-6 text-sm font-medium">
        <Link href="/sales">Sales</Link>
        <Link href="/newest">Newest</Link>
        {categorySelector}
        <Link href="/shop">Shop</Link>
      </nav>
    </div>
  );
}
