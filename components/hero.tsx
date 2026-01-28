import Button from "./button";

type heroProps = {
    setAlert: React.Dispatch<React.SetStateAction<{
        type: "INFO" | "SUCCESS" | "WARNING";
        message: string;
    } | null>>;
}

export default function Hero({ setAlert }: heroProps) {


    return (
        <>
            <section
                className="bg-amber-400"
            >
                <Button
                    label="Click Me"
                    afterLabel="loading..."
                    focus="BLUE"
                    onclick={() => setAlert(
                        {type: "WARNING", message: "JSDFBAJKDBFJKBADJFJK AS JKFA SMN CA DJ JA KS A."}
                    )}
                />
            </section>
        </>
    )
}