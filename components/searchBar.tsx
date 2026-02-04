import Image from "next/image"
import { useRef, useState } from "react"

export default function SearchBar() {
    const [search, setSearch] = useState<string>("");
    const searchInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <section
                className="my-3 mx-5"
            >
                <section
                    className="bg-(--white) text-lg m-auto md:max-w-1/2 flex px-2 py-1 rounded-xl border-2"
                >
                    <Image
                        src="/edit.svg"
                        alt="Search"
                        width={20}
                        height={20}
                        className="cursor-pointer m-2"
                        />
                    <input
                        value={search}
                        ref={searchInput}
                        placeholder="listing, location, keyword"
                        className="outline-0 flex-1 h-10"
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                    />
                    {search && (
                        <Image
                            src="/close.svg"
                            alt="Clear Search"
                            width={20}
                            height={20}
                            className="cursor-pointer"
                            onClick={() => {
                                setSearch("");
                            }}
                        />
                    )}
                </section>
            </section>
        </>
    )
}