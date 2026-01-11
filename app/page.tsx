"use client";
import { useRouter } from "next/navigation";
import Logout from "./logout/page";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <button
        className="m-5 cursor-pointer p-2 font-bold bg-amber-500 rounded-lg"
        onClick={() => { router.push("/signup") }}
      >
        SIGN UP
      </button>

      <Logout />
    </>
  );
}
