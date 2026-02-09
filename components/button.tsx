import { useState } from "react";

type ButtonProps = {
    label: string;
    afterLabel: string;
    onclick: () => void;
    focus: "FOCUS" | "DARK" | "BLUE";
    span?: boolean;
}
export default function Button({label, afterLabel, onclick, focus, span}: ButtonProps) {
    const [labels, setLabels] = useState<string>(label);

    return (
        <>
            <button
                onClick={() => {
                    onclick();
                    setLabels(afterLabel);
                }}
                className={`
                ${span && span === true}
                px-3 py-2
                sm:px-6 sm:py-2 
                font-semibold 
                text-xs
                sm:text-lg
                text-(--white)
                ${ 
                    focus === "FOCUS"?
                    "bg-(--focus) hover:bg-(--warning)" :
                    focus === "BLUE" ? 
                    "bg-(--dark-gray) hover:bg-(--text-muted)" :
                    "bg-(--secondary) hover:bg-(--text-main)" 
                }
                rounded-lg 
                cursor-pointer`}
            >
                {labels}
            </button>
        </>
    )
}