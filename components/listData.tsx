type ListDataProps = {
    id: number;
    onBack: () => void;
};

export default function ListData({ id, onBack }: ListDataProps) {
    return (
        <div className="w-full">
            {/* Back button (mobile only) */}
            <button
                onClick={onBack}
                className="md:hidden mb-4 text-blue-600 font-medium"
            >
                ← Back
            </button>

            <div className="bg-red-500 border-2 p-5 rounded-xl">
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
