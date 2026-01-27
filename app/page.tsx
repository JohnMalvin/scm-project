"use client";
import Hero from "@/components/hero";
// import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";

export default function Home() {
  // const router = useRouter();
  return (
    <>
      <Navbar />
      <Hero />
    </>
  );
}
