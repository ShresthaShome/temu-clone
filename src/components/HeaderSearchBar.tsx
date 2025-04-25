import Form from "next/form";

export default function HeaderSearchBar() {
  return (
    <Form action="/search" className="max-md:mx-auto">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none max-md:pointer-events-auto peer-focus:pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-400 z-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          type="text"
          name="query"
          placeholder="Search..."
          className="hidden md:static md:block focus:block hover:block hover:z-50 focus:z-50 focus:w-40 w-24 lg:w-60 lg:focus:w-60 pl-8 pr-2 py-1 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-black focus:border-transparent transition-colors overflow-hidden max-md:group-hover:w-24 max-md:focus:group-hover:w-40 max-md:group-hover:z-50 max-md:group-hover:block peer"
        />
      </div>
    </Form>
  );
}
