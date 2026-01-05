"use client";

import { useRef, useState } from "react";

export default function Logout() {
    const handleLogout = async () => {
        try {
            await fetch('/api/v1/logout', { method: 'POST', credentials: 'include' });
            localStorage.removeItem('accessToken');
            alert('Logged out successfully');
        } catch  {
            alert('Logout failed');
        }
    };


    return (
        <>
            <button onClick={handleLogout}>Logout</button>
        </>
    );
}