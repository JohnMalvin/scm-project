"use client";

import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg text-center">
        
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-800">
          Welcome aboard 🎉
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Your account has been created successfully.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => router.push("/profile")}
            className="
              rounded-md bg-amber-700 py-2
              font-semibold text-white
              transition hover:bg-amber-800
            "
          >
            Go to Profile
          </button>

          <button
            onClick={() => router.push("/")}
            className="
              rounded-md border border-gray-300 py-2
              font-semibold text-gray-700
              hover:bg-gray-50
            "
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
