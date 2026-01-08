"use client";
import { useRef, useState } from "react";
import { forwardRef } from "react";
import validator from "validator";

type FieldProps = {
  label: string;
  type: string;
  id: string;
};

const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, type, id }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          type={type}
          autoComplete="off"
          className="
            h-10 w-full rounded-md border border-gray-300
            px-3 text-base
            focus:outline-none focus:ring-2 focus:ring-amber-600 
          "
        />
      </div>
    );
  }
);

Field.displayName = "Field";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [codeVerified, setCodeVerified] = useState<boolean>(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const veriCodeRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const confPassRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  const validateSignUp = async () => {
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passRef.current?.value;
    const confirm = confPassRef.current?.value;
    
    if (!username || !email || !password || !confirm) {
      setError("All fields are required");
      return;
    }
    
    if (!validator.isEmail(email)) {
      setError("Invalid email adress");
      return;
    }

    if (!codeVerified) {
      setError("Email was not verified");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setError(null);
    await signUp(username, email, password);
  };

  const signUp = async (username: string, email: string, password: string) => {
    try {
      const response = await fetch("/api/v1/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username, email, password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setError(null);
      console.log("User created", data.userId);

    } catch {
      setError("Network error. Please try again");
    }
  }

  const requestCode = async () => {
    const email = emailRef.current?.value;
    if (!email || !validator.isEmail(email)) {
      setError("Please enter a valid email to request code");
      return;
    }

    try {
      const response = await fetch("/api/v1/sendEmailVerification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email
        })
      })

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong");
      }

    } catch {
      setError("Network error. Please try again");
    }
  }

  const verifyCode = async () => {
    const veriCode = veriCodeRef.current?.value.trim().toUpperCase();
    const email = emailRef.current?.value;

    if (veriCode?.length !== 6) {
      setError("Invalid verification code");
      return;
    }

    try {
      const response = await fetch("/api/v1/verifyEmailCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: veriCode
        })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || data.message || "Invalid verification code");
        return;
      }
      setCodeVerified(true);
      setError(null);
    } catch {
      setError("Network error. Please try again");
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="
        w-full max-w-sm
        rounded-lg border border-amber-900
        bg-white p-6
        shadow-md
      ">
        <h1 className="
          mb-6 rounded-md bg-amber-800 py-2
          text-center text-2xl font-bold text-white
        ">
          Sign up
        </h1>

        <form className="flex flex-col gap-4">
          <Field ref={usernameRef} id="username" label="Username" type="text" />
          <Field ref={emailRef} id="email" label="Email" type="email" />
          <Field ref={veriCodeRef} id="veriCode" label="Verification code" type="text" />
          <button
            type="button"
            onClick={requestCode}
            className="
              mt-4 rounded-md bg-red-500 py-2
              text-lg font-semibold text-white
              transition hover:bg-red-600
              focus:outline-none focus:ring-2 focus:ring-red-400
            "
          >
            Request Code
          </button>
          <button
            type="button"
            onClick={verifyCode}
            className="
              mt-4 rounded-md bg-red-500 py-2
              text-lg font-semibold text-white
              transition hover:bg-red-600
              focus:outline-none focus:ring-2 focus:ring-red-400
            "
          >
            Verify Code
          </button>
          <Field ref={passRef} id="password" label="Password" type="password" />
          <Field
            ref={confPassRef}
            id="confirmPassword"
            label="Confirm password"
            type="password"
          />

          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={validateSignUp}
            className="
              mt-4 rounded-md bg-red-500 py-2
              text-lg font-semibold text-white
              transition hover:bg-red-600
              focus:outline-none focus:ring-2 focus:ring-red-400
            "
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}
