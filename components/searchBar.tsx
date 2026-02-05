import Image from "next/image"
import { useRef, useState } from "react"

export default function SearchBar() {
    const [search, setSearch] = useState("")
    const [isFocused, setIsFocused] = useState(false)
    const searchInput = useRef<HTMLInputElement>(null)

    return (
        <section className="mt-6 mb-6 mx-6">
            <section
                onClick={() => searchInput.current?.focus()}
                className={`bg-(--white) shadow-md text-lg m-auto md:max-w-1/2 flex px-2 py-1 rounded-xl transition-colors ${
                    isFocused
                        ? "border-2 border-(--focus)"
                        : "border-2 border-transparent"
                }`}
            >
                <Image
                    src="/edit.svg"
                    alt="Search"
                    width={20}
                    height={20}
                    className="cursor-pointer m-2"
                />

                <input
                    ref={searchInput}
                    value={search}
                    placeholder="listing, location, keyword"
                    className="outline-0 flex-1 h-10 bg-transparent"
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />

                {search && (
                    <Image
                        src="/close.svg"
                        alt="Clear Search"
                        width={20}
                        height={20}
                        className="cursor-pointer m-2"
                        onClick={(e) => {
                            e.stopPropagation()
                            setSearch("")
                            searchInput.current?.focus()
                        }}
                    />
                )}
            </section>
        </section>
    )
}
