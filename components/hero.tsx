import Button from "./button";


export default function Hero() {


    return (
        <>
            <section
                className="bg-amber-400"
            >
                <Button
                    label="Click Me"
                    afterLabel="loading..."
                    focus="BLUE"
                    onclick={() => console.log("bruhh")}
                />
            </section>
        </>
    )
}