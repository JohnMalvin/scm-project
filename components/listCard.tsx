import Image from "next/image"

type ListCardProps = {
    active: boolean
    title: string
    company: string
    location: string
    salary?: string
    type?: string
    onClick: () => void
}

export default function ListCard({
    active,
    title,
    company,
    location,
    salary,
    type,
    onClick,
}: ListCardProps) {
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
                <h3 className="font-semibold text-lg">{title}</h3>

                <div className="text-sm text-gray-600">
                    <span className="flex items-center">
                        <Image
                            src="/edit.svg"
                            alt="Search"
                            width={20}
                            height={20}
                            className="cursor-pointer mx-2"
                        />
                        <p>{company}</p>
                    </span>

                    <span className="flex items-center">
                        <Image
                            src="/edit.svg"
                            alt="Search"
                            width={20}
                            height={20}
                            className="cursor-pointer mx-2"
                        />
                        <p>{location}</p>
                    </span>
                </div>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {salary && (
                        <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-md">
                            {salary}
                        </span>
                    )}

                    {type && (
                        <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-md">
                            {type}
                        </span>
                    )}
                </div>

                <div className="text-blue-600 text-sm font-medium mt-1">
                    Easily apply
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-end gap-3 text-gray-500">
                <button>
                    <Image
                        src="/edit.svg"
                        alt="Search"
                        width={20}
                        height={20}
                        className="cursor-pointer"
                    />
                </button>

                <button>
                    <Image
                        src="/edit.svg"
                        alt="Search"
                        width={20}
                        height={20}
                        className="cursor-pointer"
                    />
                </button>
            </div>
        </div>
    )
}
