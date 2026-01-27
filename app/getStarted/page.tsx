"use client";

import { apiFetch } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useRef, useState, forwardRef, useEffect } from "react";
import Image from "next/image";
import { includes } from "zod";

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
          h-11 rounded-md border border-[var(--gray)] px-3
          text-sm focus:outline-none
          focus:ring-2 focus:ring-[var(--focus)]
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
        const res = await apiFetch("/api/me", {
          method: "GET",
          credentials:"include"
        });

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
        credentials: "include",
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-(--background)">
      <div className="w-full max-w-md rounded-xl bg-(--white) shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-center text-(--primary)">
          Let&apos;s get started
        </h1>

        {step === 1 && (
          <section>
            <p className="mt-7 text-center text-sm text-(--dark-gray)">
              Who are you?
            </p>

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => setStatus("BUYER")}
                className="flex-1 rounded-md bg-(--focus) py-2 font-semibold text-(--white) hover:bg-(--secondary)"
              >
                I&apos;m a buyer
              </button>

              <button
                type="button"
                onClick={() => setStatus("SELLER")}
                className="flex-1 rounded-md bg-(--dark-gray) py-2 font-semibold text-(--white) hover:bg-(--dark-gray)"
              >
                I&apos;m a seller
              </button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="mt-6 flex flex-col items-center gap-4">
            <p className="text-sm text-(--dark-gray)">
              Choose a profile picture
            </p>

            <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-(--primary)">
              <Image
                src={
                  avatarPreview ??
                  (userStatus === "BUYER"
                    ? "/default-avatar-buyer.png"
                    : "/default-avatar-seller.png")
                }
                alt="Profile"
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            </div>

            <label className="cursor-pointer rounded-md bg-(--focus) px-4 py-2 text-sm font-semibold text-(--white) hover:bg-(--secondary)">
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
          </section>
        )}

        {error && (
          <p className="mt-5 text-center text-sm font-medium text-(--danger)">
            {error}
          </p>
        )}

        <section className="mt-5 flex justify-between">
          {step > 1 && (
            <button
              type="button"
              className="text-sm text-(--blue) hover:underline"
              onClick={() => setStep(step - 1)}
            >
              back
            </button>
          )}

          {step > 1 && (
            <button
              type="button"
              className="text-sm text-(--blue) hover:underline"
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
