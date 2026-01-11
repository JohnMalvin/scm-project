"use client";

import { useRouter } from "next/navigation";


export default function Logout() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/v1/logout', {
                method: 'POST',
                credentials: 'include'
            });

            router.push("/signup");
        } catch  {
            alert('Logout failed');
        }
    };


    return (
        <>
            <button
                onClick={handleLogout}
                className="rounded bg-red-600 px-4 py-2 text-white"
            >
                Logout
            </button>
        </>
    );
}