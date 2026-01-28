"use client";

import History from "@/components/history";
import SubscribedCategories from "@/components/SubscribedCategories";
import { apiFetch } from "@/utils/api";
import Image from "next/image";

export default function Profile() {

  async function getProfile() { 
    try {
      const res = await apiFetch('/api/v1/profile/getProfile', { method: 'GET' });
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
    <div className="max-w-4xl mx-auto p-6 flex flex-col gap-6 relative">

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-(--white) rounded-lg shadow-md px-6 py-8 relative">

        {/* Edit Profile Button */}
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-xl border-2 cursor-pointer hover:bg-(--surface) transition">
          <Image
            src="/edit.svg"
            alt="Edit Profile"
            width={20}
            height={20}
          />
          <p className="hidden sm:block text-xs text-(--text-main)">Edit Profile</p>

        </div>

        {/* Profile Image */}
        <section>
          <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
            <Image
              src="/default-avatar-seller.png"
              alt="Profile Picture"
              fill
              className="rounded-full object-cover border-4 border-(--focus)"
            />
          </div>

          {/* Desktop Message Button */}
          <div className="mt-6 justify-center hidden md:flex gap-4">
            <button className="px-6 py-2 w-full bg-(--focus) text-(--white) rounded-lg hover:bg-(--secondary) transition">
              Message
            </button>
          </div>    
        </section>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-(--text-main)">John Doe</h1>
          <p className="mt-2 text-(--text-muted)">Lorem Ipsum | Lorem Ipsum</p>

          {/* Stats */}
          <div className="mt-4 flex justify-center md:justify-start gap-6">
            <div>
              <p className="text-lg font-semibold text-(--text-main)">120</p>
              <p className="text-(--text-muted) text-sm">Lorem</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-(--text-main)">2.3k</p>
              <p className="text-(--text-muted) text-sm">Lorem</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-(--text-main)">180</p>
              <p className="text-(--text-muted) text-sm">Lorem</p>
            </div>
          </div>

          {/* Mobile Message Button */}
          <div className="mt-6 flex justify-center md:justify-start gap-4 md:hidden">
            <button className="px-6 py-2 bg-(--focus) text-(--white) rounded-lg hover:bg-(--secondary) transition">
              Message
            </button>
          </div> 

          {/* Subscribed Categories */}
          <SubscribedCategories 
            categories={["Photoshop", "Illustrator", "Figma", "Premiere Pro", "After Effects"]} 
          />
        </div>
      </div>

      {/* Bio / Details Section */}
      <div className="bg-(--white) rounded-lg shadow-md p-6 text-(--text-main)">
        <h2 className="text-2xl font-semibold mb-4">About Me</h2>
        <p>
          Hi, I’m John! I love building responsive, modern web apps with React, Next.js, and Tailwind CSS.  
          I’m passionate about clean UI design and creating smooth user experiences.
        </p>
      </div>

      {/* History Section */}
      <div className="bg-(--white) rounded-lg shadow-md p-6 text-(--text-main)">
        <h2 className="text-2xl font-semibold mb-4">History</h2>
        <History />
      </div>
    </div>
  );
}
