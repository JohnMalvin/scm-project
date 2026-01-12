"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, forwardRef } from "react";

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

export default function ForgetPasswordPage() { 
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [usernameVerified, setUsernameVerified] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);
  const [codeVerified, setCodeVerified] = useState(false);


  const usernameRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const confPassRef = useRef<HTMLInputElement>(null);

  const validateUsername = async () => { 
    const username = usernameRef.current?.value;

    if (!username || username.length < 3) {
      setUsernameVerified(false);
      return setError("Invalid username");
    }

    try {
      const res = await fetch(`/api/v1/checkUsername?username=${encodeURIComponent(username)}`, {
        method: 'GET',
      });

      const data = await res.json();

      if (!res.ok) {
        setUsernameVerified(false);
        setError(data.error || "Invalid username");
        return;
      }

      if (!data.exists) {
        setUsernameVerified(false);
        setError("Username does not exist");
        return;
      }

      setUsernameVerified(true);
      setError(null);
      setUserEmail(data.email);
      setMaskedEmail(maskEmail(data.email));

    } catch {
      setUsernameVerified(false);
      setError("Network error. Please try again later.");
    }
  };

  const requestCode = async () => {
    const email = userEmail;

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
    const email = userEmail;

    if (!code || code.length !== 6) {
      return setError("Invalid verification code");
    }

    try {
      const res = await fetch("/api/v1/emailVerification/verifyEmailCode", {
        method: "POST",
        credentials: "include",
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

  const resetPassword = async () => {
    const password = passRef.current?.value;
    const confirmPassword = confPassRef.current?.value;
    const email = userEmail;

    if (!password || !confirmPassword) {
      return setError("Please fill in all fields");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const res = await fetch("/api/v1/auth/resetPassword", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: password }),
      });

      if (!res.ok) {
        setError("Failed to reset password");
        return;
      }

      router.push("/login");
      setError(null);
    } catch {
      setError("Network error");
    }
  };
  
  const maskEmail = (email: string): string => {
    const [local, domain] = email.split("@");

    if (!local || !domain) return "";

    const visibleStart = local.slice(0, 2);
    const visibleEnd = local.slice(-2);
    const masked = "*".repeat(Math.max(local.length - 4, 1));

    return `${visibleStart}${masked}${visibleEnd}@${domain}`;
  }


  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-gray-100 px-4">
        <div className="w-full max-w-md rounded-xl bg-white shadow-lg p-8">
          <h1 className="text-3xl font-extrabold text-center text-amber-800">
            Forget your Password?
          </h1>
          <p className="mt-1 text-center text-sm text-gray-500">
            Let&apos;s reset your password 🔐
          </p>
          <div className="mt-1 flex flex-col gap-5"></div>

          {!usernameVerified && (
          <div className="mt-8 flex flex-col gap-2 mb-5">

            <label htmlFor="username" className="text-center text-sm font-semibold text-gray-700">
              enter your username:
            </label>
            <input
              ref={usernameRef}
              id="username"
              type="text"
              placeholder="username"
              autoComplete="off"
              className="
                h-11 rounded-md border border-gray-300 px-3
                text-sm focus:outline-none
                focus:ring-2 focus:ring-amber-600
                "
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.toLowerCase();
                }}
            />
            <button
              type="button"
              onClick={validateUsername}
              className="
                mt-2 rounded-md bg-amber-700 py-3
                text-lg font-bold text-white
                hover:bg-amber-800
              "
            >
              Continue
            </button>
            </div>
          )}

          {usernameVerified && (
            <div className="mt-8 flex flex-col gap-2">
              <p className="text-center text-sm text-gray-700 mb-4">
                An email has been sent to <span className="font-semibold">{maskedEmail}</span> with instructions to reset your password.
              </p>

              <input
                ref={codeRef}
                id="veriCode"
                type="text"
                autoComplete="off"
                placeholder="XXXXXX"
                maxLength={6}
                className="
                uppercase tracking-widest text-center
                h-11 rounded-md border border-gray-300
                focus:ring-2 focus:ring-amber-600 outline-0 font-bold
                "
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.toUpperCase();
                }}
              />
            </div>
          )}

          {usernameVerified && (
            <div className="mt-8 flex flex-col gap-1 mb-5">
              {codeVerified && (
                <p className="text-sm font-semibold text-green-600">
                  ✔ Email verified successfully
                </p>
              )}

              <div className="flex gap-3 mb-2.5">
                <button
                  type="button"
                  onClick={requestCode}
                  className="flex-1 rounded-md bg-amber-600 py-2 font-semibold text-white hover:bg-amber-700"
                >
                  Resend Code
                </button>

                <button
                  type="button"
                  onClick={verifyCode}
                  className="flex-1 rounded-md bg-gray-800 py-2 font-semibold text-white hover:bg-gray-900"
                >
                  Verify
                </button>
              </div>

              <div className="mt-2 flex flex-col gap-5">
                <Field
                  ref={passRef}
                  id="password"
                  label="New password"
                  type="password"
                  // placeholder="••••••••"
                  />
                <Field
                  ref={confPassRef}
                  id="confirm"
                  label="Confirm new password"
                  type="password"
                  // placeholder="••••••••"
                  />
              </div>
              {codeVerified && (
                <button
                  type="button"
                  onClick={resetPassword}
                  className="
                  mt-2 rounded-md bg-amber-700 py-3
                  text-lg font-bold text-white
                  hover:bg-amber-800
                "
                >
                  Reset password
                </button>
              )}
            </div>
          )}

          {error && (
            <p className="text-center text-sm font-medium text-red-500">
              {error}
            </p>
          )}
        </div>
      </div>
    </>
  )
}