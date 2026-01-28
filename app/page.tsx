"use client";
import Alert from "@/components/alert";
import Hero from "@/components/hero";
// import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { useEffect, useState } from "react";

type alertProps = {
  type: "INFO" | "SUCCESS" | "WARNING";
  message: string;
}

export default function Home() {
  // const router = useRouter();
  const [alert, setAlert] = useState<alertProps | null>(null);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);
  
  return (
    <>
      <div className="max-w-screen-2xl m-auto">
        {alert && (
          <Alert
          message="Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro, ad."
          type="WARNING"
          />
        )}
        <Navbar />
        <Hero
          setAlert={setAlert}
        />
      </div>
    </>
  );
}
