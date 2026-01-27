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
      <label
        htmlFor={id}
        className="text-sm font-semibold text-(--dark-gray)"
      >
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete="off"
        className="
          h-11 rounded-md border border-(--gray) px-3
          text-sm focus:outline-none
          focus:ring-2 focus:ring-(--focus)
        "
      />
    </div>
  )
);


Field.displayName = "Field";

export default function SignupPage() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [codeVerified, setCodeVerified] = useState(false);
  const [codeRequested, setCodeRequested] = useState(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const confPassRef = useRef<HTMLInputElement>(null);

  /* -------------------- Validation -------------------- */

  const validateSignUp = async () => {
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passRef.current?.value;
    const confirm = confPassRef.current?.value;

    if (!username || !email || !password || !confirm) {
      return setError("All fields are required");
    }

    if (!validator.isEmail(email)) {
      return setError("Please enter a valid email");
    }

    if (!codeVerified) {
      return setError("Please verify your email first");
    }

    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    setError(null);
    await signUp(username, email, password);
  };

  /* -------------------- API -------------------- */

  const signUp = async (username: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      router.push("/login");
    } catch {
      setError("Network error. Please try again");
    }
  };

  const requestCode = async () => {
    const email = emailRef.current?.value;
    if (!email || !validator.isEmail(email)) {
      return setError("Enter a valid email to request a code");
    }

    setCodeRequested(true);
    setError(null);

    try {
      await fetch("/api/v1/emailVerification/sendEmailVerification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      setError("Failed to send verification code");
    }
  };

  const verifyCode = async () => {
    const code = codeRef.current?.value?.trim().toUpperCase();
    const email = emailRef.current?.value;

    if (!code || code.length !== 6) {
      return setError("Invalid verification code");
    }

    try {
      const res = await fetch("/api/v1/emailVerification/verifyEmailCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (!res.ok) {
        setError("Verification failed");
        return;
      }

      setCodeVerified(true);
      setError(null);
    } catch {
      setError("Network error");
    }
  };
  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-(--background)">
      <div className="w-full max-w-md rounded-xl bg-(--white) shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-center text-(--primary)">
          Create your account
        </h1>

        <p className="mt-1 text-center text-sm text-(--dark-gray)">
          Start your journey with us 🚀
        </p>

        <div className="mt-8 flex flex-col gap-5">
          {/* Step 1 */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="username"
              className="text-sm font-semibold text-(--dark-gray)"
            >
              username
            </label>
            <input
              ref={usernameRef}
              id="username"
              type="text"
              placeholder="yourname"
              autoComplete="off"
              className="
                h-11 rounded-md border border-(--gray) px-3
                text-sm focus:outline-none
                focus:ring-2 focus:ring-(--focus)
              "
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.toLowerCase();
              }}
            />
          </div>

          {/* Step 2 */}
          <Field
            ref={emailRef}
            id="email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
          />

          {codeRequested && (
            <input
              ref={codeRef}
              id="veriCode"
              type="text"
              autoComplete="off"
              placeholder="XXXXXX"
              maxLength={6}
              className="
                uppercase tracking-widest text-center
                h-11 rounded-md border border-(--gray)
                focus:ring-2 focus:ring-(--focus)
                outline-0 font-bold
              "
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.toUpperCase();
              }}
            />
          )}

          {codeVerified && (
            <p className="text-sm font-semibold text-(--focus)">
              ✔ Email verified successfully
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={requestCode}
              className="flex-1 rounded-md bg-(--focus) py-2 font-semibold text-(--white) hover:bg-(--secondary)"
            >
              {codeRequested ? "Resend Code" : "Send Code"}
            </button>

            {codeRequested && (
              <button
                type="button"
                onClick={verifyCode}
                className="flex-1 rounded-md bg-(--dark-gray) py-2 font-semibold text-(--white) hover:bg-(--dark-gray)"
              >
                Verify
              </button>
            )}
          </div>

          {/* Step 3 */}
          <Field
            ref={passRef}
            id="password"
            label="Password"
            type="password"
          />
          <Field
            ref={confPassRef}
            id="confirm"
            label="Confirm password"
            type="password"
          />

          <button
            type="button"
            onClick={validateSignUp}
            className="
              mt-2 rounded-md bg-(--secondary) py-3
              text-lg font-bold text-(--white)
              hover:bg-(--primary)
            "
          >
            Create Account
          </button>

          <p className="text-center text-sm text-(--dark-gray)">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="font-semibold text-(--secondary) hover:underline"
            >
              Log in
            </button>
          </p>

          {error && (
            <p className="text-center text-sm font-medium text-(--danger)">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );

}
