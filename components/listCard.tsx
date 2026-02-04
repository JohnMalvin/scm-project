type ListCardProps = {
    title: string;
    onClick: () => void;
};

export default function ListCard({ title, onClick }: ListCardProps) {
    return (
        <div
            onClick={onClick}
            className="
                cursor-pointer
                border-2 rounded-xl p-4
                hover:bg-gray-100
                transition
            "
        >
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-gray-500">
                Tap to view details
            </p>
        </div>
    );
}
