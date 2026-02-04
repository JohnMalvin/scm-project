import { useState } from "react";
import ListCard from "./listCard";
import ListData from "./listData";

export default function Listings() {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    return (
        <div className="flex m-6 gap-4">
            {/* Cards list */}
            <section
                className={`
                    flex flex-col gap-3 flex-1
                    ${selectedId ? "hidden md:flex" : "flex"}
                `}
            >
                {/* Example card */}
                <ListCard
                    title="Listing One"
                    onClick={() => setSelectedId(1)}
                />

                <ListCard
                    title="Listing Two"
                    onClick={() => setSelectedId(2)}
                />
            </section>

            {/* Listing data */}
            <section
                className={`
                    flex-1
                    ${selectedId ? "flex" : "hidden md:flex"}
                `}
            >
                {selectedId && (
                    <ListData
                        id={selectedId}
                        onBack={() => setSelectedId(null)}
                    />
                )}
            </section>
        </div>
    );
}
