"use client";

import { apiFetch } from "@/utils/api";

export default function Profile() {
    
    async function getProfile() { 
        try {
            const res = await apiFetch('/api/v1/profile', {method: 'GET'});
            if (!res.ok) {
                throw new Error('Failed to fetch profile');
            }

            const data = await res.json();
            console.log('Profile data:', data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }
    
    return (
        <>
            <button onClick={getProfile}>Get Profile</button>
        </>
    );
}