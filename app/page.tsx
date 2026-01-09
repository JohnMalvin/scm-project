"use client";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function Home() {
  const router = useRouter();
  // const email = useRef<HTMLInputElement>(null);
  // const password = useRef<HTMLInputElement>(null);

  // const signUp = async () => {
  //   if (!email.current || !password.current) return;
  //   const emailValue = email.current.value;
  //   const passwordValue = password.current.value;

  //   try {
  //     const response = await fetch('/api/v1/signup', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         email: emailValue,
  //         password: passwordValue
  //       })
  //     });
      
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }

  //     const data = await response.json();
  //     console.log('Success:', data);

  //   } catch (error) {
  //     console.error('There was a problem with the fetch operation:', error);
  //   } 
  // }

  return (
    <>
      <button className="m-5 cursor-pointer p-2 font-bold bg-amber-500 rounded-lg" onClick={()=>{router.push("/signup")}}>SIGN UP</button>
    </>
  );
}
