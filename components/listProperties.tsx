import Image from "next/image";

type ListPropertiesProps = {
    company: string;
    location: string;
    deadline: string;
    star?: string;
}

export default function ListProperties({ company, location, deadline, star }: ListPropertiesProps) {
    

    return (
        <>
            <div className="text-sm text-gray-600 gap-1 flex flex-col">
                <span className="flex items-center">
                    <Image src="/company.svg" alt="company" width={15} height={15} className="mx-2" />
                    <p>{company}{"\t"}</p>
                    {star && (
                        <div className="flex ml-2 items-center justify-center">
                            <Image src="/star.svg" alt="star" width={10} height={10} className="mx-1" />
                            <p className="text-xs">{star}</p>
                        </div>

                    )}

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
        </>
    )
}