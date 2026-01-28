import { useState } from "react";

type ButtonProps = {
    label: string;
    afterLabel: string;
    onclick: () => void;
    focus: "FOCUS" | "DARK" | "BLUE";
    span?: string;
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
                ${span && span}
                px-6 py-2 
                font-semibold 
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