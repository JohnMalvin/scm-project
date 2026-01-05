"use client";
import { useRef } from "react";

export default function Home() {
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const signUp = async () => {
    if (!email.current || !password.current) return;
    const emailValue = email.current.value;
    const passwordValue = password.current.value;

    try {
      const response = await fetch('/api/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailValue,
          password: passwordValue
        })
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Success:', data);

    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    } 
  }

  return (
    <>
      <div className="bg-yellow-900 w-2xl">
        <h1>Sign Up</h1>
        <form className="flex flex-col w-64 ">
          <input type="text" placeholder="email" ref={email}></input>
          <input type="password" placeholder="password" ref={password}></input>
          <button type="button" onClick={signUp}>Submit</button>
        </form>
      </div>
    </>
  );
}
