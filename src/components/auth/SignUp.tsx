"use client";

import { useActionState, useEffect, useState } from "react";
import Form from "next/form";
import { Loader2 } from "lucide-react";
import { formatTime } from "@/lib/utils";

const initialState = {
  message: "",
};

type SignUpProps = {
  action: (
    prevState: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    formData: FormData
  ) => Promise<{ message: string } | undefined>;
};

function getTimeRemaining() {
  const minute = new Date().getMinutes();
  const hour = minute < 30 ? new Date().getHours() : new Date().getHours() + 1;
  const total = new Date().setHours(hour, minute < 30 ? 30 : 0, 0) - Date.now();
  return { remainingTime: total / 1000, halfNumber: minute > 30 ? 2 : 1 };
}

export default function SignUp({ action }: SignUpProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  const [time, setTime] = useState({ remainingTime: 0, halfNumber: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getTimeRemaining());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Form
      action={formAction}
      className="max-w-md mx-auto my-16 bg-white rounded-lg shadow-md px-8 py-2"
    >
      <h1 className="text-2xl font-bold text-center mb-2">Sign Up</h1>
      <p className="text-center mb-2 text-sm text-rose-600 font-semibold uppercase">
        🔥 Limited time offer 🔥
      </p>
      <p className="text-center text-sm text-gray-600 mb-6">
        Join us now and get 50% OFF your first order!
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
            ⚡ Only{" "}
            {10 +
              Math.ceil(
                (new Date()
                  .toLocaleDateString()
                  .split("")
                  .reduce((a, b) => a + b.charCodeAt(0), 0) %
                  400) *
                  ((24 - new Date().getHours()) / 24)
              )}{" "}
            welcome bonus packages remaining!
          </p>
          {time.remainingTime ? (
            <p className="text-xs text-gray-500 mb-2">
              🕔 Offer expires in:{" "}
              {formatTime(Math.floor((time.remainingTime % 3600) / 60))}:
              {formatTime(Math.floor(time.remainingTime % 60))}
            </p>
          ) : (
            <></>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={`w-full bg-rose-600 text-white py-3 rounded-md hover:bg-rose-700 transition-colors font-medium flex items-center justify-center gap-2 uppercase cursor-pointer ${
            isPending ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
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
