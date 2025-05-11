"use client";

import { logoutUser } from "@/actions/auth";
import { User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import HeaderSearchBar from "@/components/HeaderSearchBar";
import { useCartStore } from "@/stores/cart-stores";
import { useShallow } from "zustand/shallow";
import { UserCircle } from "lucide-react";
import Nav from "@/components/Nav";

const AnnouncementBar = () => {
  return (
    <div className="w-full bg-black py-2">
      <div className="container mx-auto flex items-center justify-center px-8">
        <span className="text-center text-sm font-medium tracking-wide text-white uppercase">
          Free shipping on orders over $50.00 • Free returns
        </span>
      </div>
    </div>
  );
};

type HeaderProps = {
  user: Omit<User, "passwordHash"> | null;
  categorySelector: ReactNode;
};

export default function Header({ user, categorySelector }: HeaderProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [prevScrollY, setPrevScrollY] = useState<number>(0);

  const { open, getTotalItems } = useCartStore(
    useShallow((state) => ({
      open: state.open,
      getTotalItems: state.getTotalItems,
    }))
  );

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < prevScrollY) {
        setIsOpen(true);
      } else if (currentScrollY > 100) {
        setIsOpen(false);
      }

      setPrevScrollY(currentScrollY);
    };

    setPrevScrollY(window.scrollY);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollY]);

  return (
    <header className="w-full sticky top-0 z-50">
      <div
        className={`w-full transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <AnnouncementBar />

        <div className="w-full flex justify-between items-center py-3 sm:py-4 bg-white/80 shadow-sm border-b border-gray-100 backdrop-blur-sm min-h-[50px]">
          <div className="flex items-center justify-between container mx-auto px-8">
            <Nav categorySelector={categorySelector} />

            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 -translate-y-[22%]"
            >
              <span className="inline-flex items-center justify-center h-12 w-20 text-xl font-bold sm:text-2xl tracking-tight uppercase bg-orange-400 text-white rounded-xl px-2 mt-10 opacity-90">
                Temu
              </span>
            </Link>

            <div className="flex flex-1 justify-end items-center gap-2 sm:gap-4">
              <HeaderSearchBar />

              {user ? (
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="flex flex-row items-center justify-center gap-1">
                    <UserCircle className="h-6 w-6" />
                    <span className="text-xs text-gray-700 hidden md:block">
                      {user.email}
                    </span>
                  </div>
                  <Link
                    href="#"
                    className="text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900"
                    onClick={async (e) => {
                      e.preventDefault();
                      await logoutUser();
                      router.refresh();
                    }}
                  >
                    Sign Out
                  </Link>
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/sign-in"
                    className="text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    className="text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Sign Up
                  </Link>
                </>
              )}

              <button
                onClick={open}
                className="text-gray-700 hover:text-gray-900 relative"
              >
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
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>

                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] sm:text-sm w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center">
                  {getTotalItems()}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
