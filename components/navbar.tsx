"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Logout from "@/app/logout/page"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const clickables = [
    { label: "Categories", href: "/link3" },
    { label: "Listings", href: "/link2" },
    { label: "Profile", href: "/" },
  ]

  return (
    <>
      <nav className="relative z-50 flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={90} height={90} priority />
        </Link>

        {/* Desktop menu */}
        <section className="flex">
        <section className="hidden md:flex items-center gap-6 justify-end">
          {clickables.map((clickable) => (
            <Link
              key={clickable.href}
              href={clickable.href}
              className="
                relative font-medium text-(--text-muted)
                hover:text-(--primary) text-shadow
                after:absolute after:left-0 after:content-[attr(data-text)]
                after:font-bold after:opacity-0 after:pointer-events-none
                "
                data-text={clickable.label}
                >
              {clickable.label}
            </Link>

          ))}
        </section>
        {!open &&(
          <section
          className="flex gap-4 justify-end px-4 items-center"
          >
            <Link href="/">
              <Image src="/chat.svg" alt="Logo" width={30} height={30} priority />
            </Link>
            <Link href="/">
              <Image src="/notification.svg" alt="Logo" width={30} height={30} priority />
            </Link>
            <Logout />
          </section>
        )}
        {/* Mobile toggle button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <Image
            src={open ? "/close.svg" : "/hamburger.svg"}
            alt="menu"
            width={28}
            height={28}
          />
        </button>
        </section>

      </nav>

      {/* Fullscreen mobile menu */}
      {open && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-(--surface) md:hidden">
          {clickables.map((clickable) => (
            <Link
              key={clickable.href}
              href={clickable.href}
              onClick={() => setOpen(false)}
              className="text-xl font-medium text-(--text-main) hover:text-(--primary) text-shadow"
            >
              {clickable.label}
            </Link>
          ))}

          <Logout />
        </div>
      )}
    </>
  )
}
