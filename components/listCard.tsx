import Image from "next/image"

type Status = "OPEN" | "SCHEDULED" | "CLOSED"

type ListCardProps = {
    active: boolean
    title: string
    company: string
    location: string
    deadline: string
    budget?: string
    category?: string[]
    status: Status
    onClick: () => void
}

const STATUS_CONFIG: Record<Status, {
    label: string
    className: string
}> = {
    OPEN: {
        label: "Open",
        className: "text-green-700 border-(--success)",
    },
    SCHEDULED: {
        label: "Upcoming",
        className: "text-yellow-700 border-(--warning)",
    },
    CLOSED: {
        label: "Closed",
        className: "text-red-700 border-(--dan)",
    },
}

export default function ListCard({
    active,
    title,
    company,
    location,
    deadline,
    budget,
    status,
    category,
    onClick,
}: ListCardProps) {
    const statusConfig = STATUS_CONFIG[status]

    return (
        <div
            onClick={onClick}
            className={`
                cursor-pointer
                bg-white
                ${active ? "border-2 border-(--focus)" : "border border-gray-200"}
                rounded-2xl
                p-5
                shadow-sm
                hover:shadow-md
                transition
                flex justify-between gap-4
            `}
        >
            {/* LEFT */}
            <div className="flex flex-col gap-2">
                {/* title — unchanged */}
                <h3 className="font-semibold text-lg">{title}</h3>

                <div className="flex gap-2 flex-wrap">
                    <span
                        className={`
                            border-2 font-bold text-sm px-3 py-1 rounded-md w-fit
                            ${statusConfig.className}
                        `}
                    >
                        {statusConfig.label}
                    </span>

                    {budget && (
                        <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-md w-fit">
                            Budget: {budget}
                        </span>
                    )}
                </div>

                <div className="text-sm text-gray-600 gap-1 flex flex-col">
                    <span className="flex items-center">
                        <Image src="/company.svg" alt="company" width={15} height={15} className="mx-2" />
                        <p>{company}</p>
                    </span>

                    <span className="flex items-center">
                        <Image src="/location.svg" alt="location" width={15} height={15} className="mx-2" />
                        <p>{location}</p>
                    </span>

                    <span className="flex items-center">
                        <Image src="/deadline.svg" alt="deadline" width={15} height={15} className="mx-2" />
                        <p>{deadline}</p>
                    </span>
                </div>

                {category && (
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {category.map((cat, index) => (
                            <span
                                key={index}
                                className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-md"
                            >
                                {cat}
                            </span>
                        ))}
                    </div>
                )}

                {/* subtle CTA copy only */}
                {status === "OPEN" && (
                    <div className="text-blue-600 text-sm font-medium mt-1">
                        Easily apply
                    </div>
                )}

                {status === "SCHEDULED" && (
                    <div className="text-blue-600 text-sm mt-1">
                        Opens soon
                    </div>
                )}
            </div>

            {/* RIGHT */}
            <div className="flex shrink-0 flex-col items-end gap-3 text-gray-500">
                <button>
                    <Image src="/bookmark.svg" alt="bookmark" width={20} height={20} />
                </button>

                <button>
                    <Image src="/share.svg" alt="share" width={20} height={20} />
                </button>
            </div>
        </div>
    )
}
