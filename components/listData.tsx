import Image from "next/image";
import ListProperties from "./listProperties";
import Button from "./button";

type ListDataProps = {
    id: number;
    onBack: () => void;
    status: Status;
    budget?: string;
    company: string;
    location: string;
    deadline: string;
    category?: string[];
    star: string;
};

type Status = "OPEN" | "SCHEDULED" | "CLOSED"


const STATUS_CONFIG: Record<Status, {
    label: string
    className: string
}> = {
    OPEN: {
        label: "Open",
        className: "text-(--white) bg-(--success)",
    },
    SCHEDULED: {
        label: "Scheduled",
        className: "text-(--white) bg-(--warning)",
    },
    CLOSED: {
        label: "Closed",
        className: "text-(--white) bg-(--dan)",
    },
}

export default function ListData({ id, onBack, status, budget, company, location, deadline, category, star}: ListDataProps) {
    const statusConfig = STATUS_CONFIG[status];


    const reportAction = () => {
        console.log(`Report action for listing ${id}`);
    }
    const bookmarkAction = () => {
        console.log(`Bookmark action for listing ${id}`);
    }
    const shareAction = () => {
        console.log(`Share action for listing ${id}`);
    }
    const messageAction = () => {
        console.log(`Message action for listing ${id}`);
    }
    const downloadAction = () => {
        console.log(`Download action for listing ${id}`);
    }
    return (
        <div className="w-full h-full rounded-lg bg-(--white) shadow-lg flex flex-col relative">
            {/* Back button (mobile only) */}

            <div className="p-5 pb-2 flex flex-col flex-1 min-h-0">
                <header className="flex gap-2 justify-between mb-4">
                    {/* LEFT */}
                    <section className="flex flex-col gap-2">
                        <div className="flex gap-2 items-center">

                            <button
                                onClick={onBack}
                                className="md:hidden"
                                >
                                <Image 
                                    src="/leftArrow.svg" alt="leftArrow" width={20} height={20} 
                                    className="cursor-pointer "
                                    onClick={onBack}
                                    />
                            </button>
                            <h2 className="text-xl font-bold">
                                Custom 48V 20Ah Lithium Battery Pack for E-Bike
                            </h2>
                        </div>
                        <div className="flex gap-2">
                            {budget && (
                                <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-md max-w-fit">
                                    Budget: {budget}
                                </span>
                            )}
                            {budget && (
                                <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-md max-w-fit">
                                    Budget: {budget}
                                </span>
                            )}
                        </div>

                    </section>

                    {/* RIGHT */}
                    <section className="flex flex-col items-end justify-baseline gap-2">
                        <div className="flex shrink-0 items-end gap-1 text-gray-500 min-w-20">
                            <button>
                                <Image 
                                    src="/report.svg" alt="report" width={25} height={25} 
                                    className="cursor-pointer"
                                    onClick={reportAction}
                                    />
                            </button>
                            <button>
                                <Image 
                                    src="/bookmark.svg" alt="bookmark" width={25} height={25} 
                                    className="cursor-pointer"
                                    onClick={bookmarkAction}
                                    />
                            </button>
                            <button>
                                <Image 
                                    src="/share.svg" alt="share" width={25} height={25} 
                                    className="cursor-pointer"
                                    onClick={shareAction}
                                    />
                            </button>
                        </div>
                        <span
                            className={`
                                border-2 font-bold text-sm px-3 py-1 rounded-md w-fit
                                ${statusConfig.className}
                            `}
                            >
                                {statusConfig.label}
                        </span>
                    </section>
                </header>           
                <hr />
                <main className="flex-1 overflow-y-auto h-full">
                    <section className="flex flex-col gap-2 my-3">
                        <ListProperties company={company} location={location} deadline={deadline} star={star}/>
                        {category && (
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                {category.map((cat, index: number) => (
                                    <span
                                    key={index}
                                    className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-md"
                                            >
                                            {cat}
                                        </span>
                                ))}
                            </div>
                        )}
                    </section>
                    <hr className="mb-4" />
                    <h1 className="font-bold text-lg">Description:</h1>
                    <div className="text-(--text-muted)">
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat aspernatur itaque nobis temporibus tempora tenetur odio, nostrum quia magnam nesciunt, saepe sint ipsa obcaecati eaque amet, culpa atque totam reiciendis necessitatibus porro aliquam soluta. Aperiam, ducimus explicabo provident, ratione facilis dolor accusantium iusto modi, pariatur quae libero molestiae error blanditiis ipsum quam mollitia dolores. Labore nulla eum possimus laudantium tempora culpa, modi, ut necessitatibus, laboriosam facere expedita! Cumque quasi optio iusto laudantium eum iure officia, dolor laborum, libero similique non amet distinctio esse quo quis. Soluta maiores laborum maxime distinctio consequatur dolorum ad eum praesentium sequi illum, error pariatur tempore numquam id a fugiat aliquam, vero doloribus dignissimos. Magnam quo cum illum voluptate eligendi eaque, harum obcaecati ipsum a facilis doloribus optio maxime temporibus? Asperiores doloremque repellat omnis laudantium ullam, et quibusdam dicta, facilis magnam reprehenderit voluptatibus sint mollitia excepturi at veritatis error porro incidunt. Aliquam ducimus sed et quisquam natus laborum quasi error dicta tempore a unde esse sit obcaecati, assumenda at autem deserunt cum soluta voluptatum enim! Ipsa, atque. Labore ex est minus itaque perferendis accusantium. Sequi nemo, consequatur dolorem odio nesciunt impedit velit ipsum ex in magnam natus pariatur corporis doloremque iste magni neque eligendi cumque debitis nulla iusto. Consequuntur, quo. Veniam nobis minima, dolor omnis praesentium quam iste ducimus molestiae vitae recusandae delectus eum repellendus inventore accusamus! Sit architecto quo nihil aliquam vel rem ipsam quasi mollitia odit, ut reprehenderit, neque libero a excepturi suscipit doloribus totam minima perspiciatis! Numquam magni rerum incidunt itaque magnam nesciunt cumque pariatur voluptatibus praesentium, sequi dignissimos iusto eaque quae, repellat consectetur ex. Officia illum accusantium voluptatum impedit quisquam eum qui totam, fugit magni eaque non, quidem, repellat error omnis porro explicabo dolore enim. Omnis explicabo asperiores praesentium aut eius quasi dolore, quod quos nam dolorum ipsam, error quisquam cupiditate incidunt!
                    </div>
                </main>
            </div>
            <footer className="p-2 -mt-2 border-(--gray) border rounded-lg flex gap-2 justify-end">
                <button
                    className="cursor-pointer flex-1 gap-2 font-bold text-(--white) bg-(--focus) h-10 w-10 flex items-center justify-center rounded-md hover:bg-(--secondary) transition-colors" 
                    onClick={messageAction}
                    >
                    <Image 
                        src="/message.svg" alt="message" width={25} height={25} 
                        className="invert-100"
                    /> 
                    <p>Message</p>
                </button>
                <button
                    className="cursor-pointer flex-1 gap-2 font-bold text-(--white) bg-(--dark-gray) h-10 w-10 flex items-center justify-center rounded-md hover:bg-(--text-muted) transition-colors" 
                    onClick={downloadAction}
                    >
                    <Image 
                        src="/downloadFiles.svg" alt="downloadFiles" width={25} height={25} 
                        className="invert-100"
                    />
                    <p>Download files</p>
                </button>
            </footer>
        </div>
    );
}
