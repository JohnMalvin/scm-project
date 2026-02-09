import Image from "next/image"
import { useRef, useState } from "react"
import Button from "./button"

export default function SearchBar() {
    const [search, setSearch] = useState("")
    const [isFocused, setIsFocused] = useState(false)
    const searchInput = useRef<HTMLInputElement>(null)

    return (
        <section className="mt-6 mb-6 mx-6 flex gap-2 items-center justify-center">
            <section
                onClick={() => searchInput.current?.focus()}
                className={`flex-1 bg-(--white) shadow-md text-lg md:max-w-1/2 flex px-2 py-1 sm:rounded-xl rounded-lg transition-colors items-center ${
                    isFocused
                        ? "border-2 border-(--focus)"
                        : "border-2 border-transparent"
                }`}
            >   
                <div className="flex items-center justify-center mr-1 h-7 sm:h-10 text-center">
                    <Image
                        src="/search.svg"
                        alt="Search"
                        width={10}
                        height={10}
                        className="cursor-pointer m-2 w-3 h-3 sm:w-5 sm:h-5"
                        />
                </div>

                <input
                    ref={searchInput}
                    value={search}
                    placeholder="listing, location, keyword"
                    className="outline-0 flex-1 bg-transparent text-sm sm:text-lg min-h-7 w-full"
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
                        className="cursor-pointer m-2 w-3 h-3 sm:w-5 sm:h-5"
                        onClick={(e) => {
                            e.stopPropagation()
                            setSearch("")
                            searchInput.current?.focus()
                        }}
                    />
                )}
            </section>
                <section className="flex items-center gap-1.5">
                    <button className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-(--focus) hover:bg-(--secondary) text-white rounded-lg shadow-md cursor-pointer">
                        <Image
                            src="/filter.svg"
                            alt="Filter Search"
                            width={20}
                            height={20}
                            className="cursor-pointer m-2 invert-100"
                            onClick={(e) => {
                                e.stopPropagation()
                                setSearch("")
                                searchInput.current?.focus()
                            }}
                        />
                    </button>
                    <button className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center  bg-(--focus) hover:bg-(--secondary) text-white rounded-lg shadow-md cursor-pointer">
                        <Image
                            src="/sort.svg"
                            alt="Sort Search"
                            width={20}
                            height={20}
                            className="cursor-pointer m-2 invert-100"
                            onClick={(e) => {
                                e.stopPropagation()
                                setSearch("")
                                searchInput.current?.focus()
                            }}
                        />
                    </button>
                </section>
        </section>
    )
}
