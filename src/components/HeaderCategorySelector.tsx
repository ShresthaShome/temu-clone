import { getAllCategories } from "@/sanity/lib/client";
import Link from "next/link";

export default async function HeaderCategorySelector() {
  const categories = await getAllCategories();

  return (
    <div className="relative inline-block w-full group/categories">
      <button className="peer  text-gray-700 hover:text-gray-900 text-sm font-medium flex items-center gap-1">
        Categories
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 group-hover/categories:rotate-180`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div className="absolute top-full left-10 pt-2 opacity-0 invisible group-hover/categories:opacity-100 group-hover/categories:visible peer-hover:opacity-100 peer-hover:visible hover:opacity-100 hover:visible transition-all duration-100 z-1000">
        <div className="w-64 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
          <div className="py-2">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/category/${category.slug?.current}`}
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-100"
                prefetch
              >
                {category.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
