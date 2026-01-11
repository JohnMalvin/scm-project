"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, forwardRef } from "react";
import validator from "validator";

type FieldProps = {
  label: string;
  type: string;
  id: string;
  placeholder?: string;
};

const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, type, id, placeholder }, ref) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete="off"
        className="
          h-11 rounded-md border border-gray-300 px-3
          text-sm focus:outline-none
          focus:ring-2 focus:ring-amber-600
        "
      />
    </div>
  )
);

Field.displayName = "Field";

export default function LoginPage() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const identifierRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  /* -------------------- Validation -------------------- */

  const validateLogin = async () => {
    const identifier = identifierRef.current?.value;
    const password = passRef.current?.value;

    if (!identifier || !password) {
      return setError("All fields are required");
    }

    // If it looks like an email, validate it
    if (identifier.includes("@") && !validator.isEmail(identifier)) {
      return setError("Please enter a valid email");
    }

    setError(null);
    await login(identifier, password);
  };

  /* -------------------- API -------------------- */

  const login = async (identifier: string, password: string) => {
    try {
        setLoading(true);

        const res = await fetch("/api/v1/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ identifier, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Invalid credentials");
            return;
        }

        router.push("/dashboard");
    } catch {
        setError("Network error. Please try again");
    } finally {
        setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-center text-amber-800">
          Welcome back
        </h1>
        <p className="mt-1 text-center text-sm text-gray-500">
          Log in to continue 🔐
        </p>

        <div className="mt-8 flex flex-col gap-5">
          <Field
            ref={identifierRef}
            id="identifier"
            label="Email or Username"
            type="text"
            placeholder="you@example.com"
          />

          <Field
            ref={passRef}
            id="password"
            label="Password"
            type="password"
          />

          <button
            type="button"
            onClick={validateLogin}
            disabled={loading}
            className="
              mt-2 rounded-md bg-amber-700 py-3
              text-lg font-bold text-white
              hover:bg-amber-800 disabled:opacity-70
            "
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          {error && (
            <p className="text-center text-sm font-medium text-red-500">
              {error}
            </p>
          )}

          <p className="text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <button
              onClick={() => router.push("/signup")}
              className="font-semibold text-amber-700 hover:underline"
            >
              Sign up
            </button>
          </p>

            <p className="text-left text-sm text-gray-500 -mb-5 -ml-3">
            <button
              onClick={() => router.push("/forgetPassword")}
              className=" text-amber-700 hover:underline"
            >
              Forget password?
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
