"use client";

import { apiFetch } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useRef, useState, forwardRef, useEffect } from "react";
import Image from "next/image";

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

export default function GetStarted() {
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<"BUYER" | "SELLER">("SELLER");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiFetch("/api/me");

        if (!res.ok) {
          router.replace("/login");
        }
      } catch {
        router.replace("/login");
      }
    };
    checkAuth();
  }, []);

  const setStatus = async (status: "BUYER" | "SELLER") => {
    try {
      const res = await apiFetch('/api/v1/getStarted/setStatus', {
        method: 'POST',
        body: JSON.stringify({
          status
        })
      });

      if (!res.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await res.json();
      console.log('Profile data:', data);
      setStep(2);
      setUserStatus(status);
      setError(null);
    } catch {
      setError("Failed to set status");
    }
  }

  const handleNext = async () => {
    if (step === 2 && avatarFile) {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      
      try {
        const res = await apiFetch("/api/v1/getStarted/uploadAvatar", {
          method: "POST",
          body: formData,
        })

        if(!res.ok) {
          throw new Error('Failed to upload image');
        }

        setError(null);
        setStep(3);
      } catch {
        setError("Failed to upload Image");
        setAvatarFile(null);
        setAvatarPreview(null);
        setStep(2);
      }
    }

    if (step != 2) {
      setStep(step + 1);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-center text-amber-800">
          Let&apos;s get started
        </h1>

        {step === 1 && (
          <section>
            <p className="mt-7 text-center text-sm text-gray-500">
              Who are you?
            </p>

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => setStatus("BUYER")}
                className="flex-1 rounded-md bg-amber-600 py-2 font-semibold text-white hover:bg-amber-700"
              >
                I&apos;m a buyer
              </button>

              <button
                type="button"
                onClick={() => setStatus("SELLER")}
                className="flex-1 rounded-md bg-gray-800 py-2 font-semibold text-white hover:bg-gray-900"
                >
                I&apos;m a seller
              </button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="mt-6 flex flex-col items-center gap-4">
            <p className="text-sm text-gray-500">Choose a profile picture</p>

            {/* Profile preview */}
            <div className="h-24 w-24 rounded-full overflow-hidden border-amber-800 border-4">
              <Image
                src={
                  avatarPreview ?? (
                    userStatus === "BUYER" ? "/default-avatar-buyer.png" : "/default-avatar-seller.png"
                  )
                }
                alt="Profile"
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Upload */}
            <label className="cursor-pointer rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700">
              Upload photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  setAvatarFile(file);
                  setAvatarPreview(URL.createObjectURL(file));
                }}
              />
            </label>

            {/* Skip */}
          </section>

        )}
        
        {/* <div className="mt-8 flex flex-col gap-5">
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
        </div> */}
        {error && (
          <p className="mt-5 text-center text-sm font-medium text-red-500">
            {error}
          </p>
        )}
        
        <section
          className="mt-5 flex justify-between"
        >
          {step > 1 && (
            <button
            type="button"
            className="text-sm text-blue-400 hover:underline"
            onClick={() => setStep(step - 1)}
            >
              back
            </button>
          )}

          {step > 1 && (
            <button
            type="button"
            className="text-sm text-blue-400 hover:underline"
            onClick={handleNext}
            >
              next
            </button>
          )}
        </section>

      </div>
    </div>
  );
}
