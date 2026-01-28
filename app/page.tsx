"use client";
import Hero from "@/components/hero";
// import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";

export default function Home() {
  // const router = useRouter();
  return (
    <>
      <div className="max-w-screen-2xl m-auto">
        <Navbar />
        <Hero />
      </div>
    </>
  );
}
