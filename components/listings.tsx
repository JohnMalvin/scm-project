import { useEffect, useState } from "react";
import ListCard from "./listCard";
import ListData from "./listData";

export default function Listings() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [innerScroll, setInnerScroll] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isAtBottom =
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 1
        
            setInnerScroll(isAtBottom)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])
    
    useEffect(() => {
        const media = window.matchMedia("(min-width: 768px)")

        const handleChange = (e: MediaQueryListEvent) => {
            if (e.matches) {
                setSelectedId(1)
            } else {
                setSelectedId(null)
            }
        }

        const initial = () => { 
            if (media.matches) {
                setSelectedId(1)
            } else {
                setSelectedId(null)
            }
        }
        initial();
        media.addEventListener("change", handleChange)

        return () => {
            media.removeEventListener("change", handleChange)
        }
    }, [])

    return (
        <>
            <div className="flex mx-6 gap-0 h-[calc(100vh)]">
                {/* Cards list */}
                <section
                    className={`
                        flex flex-col gap-3 flex-1
                        :flex-[0_0_40%]
                        ${selectedId ? "hidden md:flex" : "flex"}
                        `}
                        >
                    {/* Example card */}
                    <div className={`flex flex-col gap-4 ${innerScroll ? "overflow-scroll no-scrollbar" : "overflow-hidden"} h-full p-4`}>
                        <ListCard
                            active={selectedId === 1}
                            title="Fully Remote – Delegate Sales Manager - Indonesia"
                            company="CIO Network Pte Ltd"
                            location="Indonesia"
                            salary="Rp. 15.000.000 - Rp. 20.000.000 a month"
                            type="Full-time"
                            onClick={() => setSelectedId(1)}
                        />
                        <ListCard
                            active={selectedId === 2}
                            title="Fully Remote – Delegate Sales Manager - Indonesia"
                            company="CIO Network Pte Ltd"
                            location="Indonesia"
                            salary="Rp. 15.000.000 - Rp. 20.000.000 a month"
                            type="Full-time"
                            onClick={() => setSelectedId(2)}
                        />
                        <ListCard
                            active={selectedId === 2}
                            title="Fully Remote – Delegate Sales Manager - Indonesia"
                            company="CIO Network Pte Ltd"
                            location="Indonesia"
                            salary="Rp. 15.000.000 - Rp. 20.000.000 a month"
                            type="Full-time"
                            onClick={() => setSelectedId(2)}
                        />
                        <ListCard
                            active={selectedId === 2}
                            title="Fully Remote – Delegate Sales Manager - Indonesia"
                            company="CIO Network Pte Ltd"
                            location="Indonesia"
                            salary="Rp. 15.000.000 - Rp. 20.000.000 a month"
                            type="Full-time"
                            onClick={() => setSelectedId(2)}
                        />
                    </div>    

                </section>

                {/* Listing data */}
                <section
                    className={`
                        flex-1
                        ${selectedId ? "flex" : "hidden md:flex"}
                    `}
                >
                    {selectedId && (
                        <div
                            className={`pt-4 transition-all duration-100 ease-in-out ${innerScroll ? "overflow-scroll no-scrollbar" : "overflow-hidden"}`}
                        >
                            <ListData
                                id={selectedId}
                                onBack={() => setSelectedId(null)}
                            />
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
