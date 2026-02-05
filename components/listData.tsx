type ListDataProps = {
    id: number;
    onBack: () => void;
};

export default function ListData({ id, onBack }: ListDataProps) {
    return (
        <div className="w-full h-full top-0 z-10 rounded-lg bg-(--white) shadow-lg">
            {/* Back button (mobile only) */}
            <button
                onClick={onBack}
                className="md:hidden mb-4 text-blue-600 font-medium"
            >
                ← Back
            </button>

            <div className="p-5">
                <h2 className="text-xl font-bold mb-2">
                    Listing #{id}
                </h2>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Possimus dolor reprehenderit atque laborum.
                </p>
            </div>
        </div>
    );
}
