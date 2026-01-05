"use client";

import { useRef, useState } from "react";

export default function LoginPage() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);
    
    const handleLogin = async () => {
        setError(null);
        try {
            const res = await fetch('/api/v1/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: emailRef.current?.value,
                    password: passwordRef.current?.value,
                }),
                credentials: 'include',
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An error occurred");
        }
    }
    
    return (
        <>
            <div>
                <h1>Login</h1>
                <input type="email" placeholder="Email" ref={emailRef} />
                <input type="password" placeholder="Password" ref={passwordRef} />
                <button onClick={handleLogin}>Log In</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </>
    );
}