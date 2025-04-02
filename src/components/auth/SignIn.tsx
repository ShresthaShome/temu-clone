"use client";

import { useActionState } from "react";
import Form from "next/form";
import { Loader2 } from "lucide-react";

const initialState = {
  message: "",
};

type SignInProps = {
  action: (
    prevState: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    formData: FormData
  ) => Promise<{ message: string } | undefined>;
};

export default function SignIn({ action }: SignInProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <Form
      action={formAction}
      className="max-w-md mx-auto my-16 bg-white rounded-lg shadow-md px-8 py-2"
    >
      <h1 className="text-2xl font-bold text-center mb-2">Sign In</h1>
      <p className="text-center mb-2 text-sm text-rose-600 font-semibold uppercase">
        🔥 Members Exclusive 🔥
      </p>
      <p className="text-center text-sm text-gray-600 mb-6">
        Log in to access your exclusive member deals!
      </p>

      <div className="space-y-6 pb-2">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm text-gray-700">
            Email address
          </label>

          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
            placeholder="Enter your email address"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm text-gray-700">
            Password
          </label>

          <input
            type="password"
            id="password"
            name="password"
            autoComplete="new-password"
            minLength={6}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
            placeholder="Create a password"
          />
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">
            ⚡ Members save an extra 10% on all orders!
          </p>
          <p className="text-xs text-gray-500 mb-2">
            🛍️ Plus get free shipping on orders over $50.00
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={`w-full bg-rose-600 text-white py-3 rounded-md hover:bg-rose-700 transition-colors font-medium flex items-center justify-center gap-2 uppercase ${
            isPending ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>

        {!!state?.message && (
          <p className="text-center text-sm text-red-600 mb-2">
            {state.message}
          </p>
        )}
      </div>
    </Form>
  );
}
