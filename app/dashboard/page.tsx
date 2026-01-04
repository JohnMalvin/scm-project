"use client"

import { useEffect, useState } from "react"

export default function DASHBOARD() {
    const [POSTmessage, setPOSTmessage] = useState<string | null>(null);
    const [GETmessage, setGETmessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDataByPOST();
        fetchDataByGET();
    }, []);
    
    const fetchDataByPOST = async () => {
        try {
            const response = await fetch('/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: "John" }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: { message: string } = await response.json();
            setPOSTmessage(data.message);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    }

    const fetchDataByGET = async () => {
        try {
            const response = await fetch('/api', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: { message: string } = await response.json();
            setGETmessage(data.message);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    }

    return (
        <>
            <p>HELOOOOO</p>
            {POSTmessage && <p>POST MESSAGE   {POSTmessage}</p>}
            {GETmessage && <p>GET MESSAGE   {GETmessage}</p>}
            {error && <p>{error}</p>}
        </>
    )
} 