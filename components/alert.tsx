import Image from "next/image"

type AlertProps = {
  message: string
  type: "INFO" | "SUCCESS" | "WARNING"
}

export default function Alert({ message, type }: AlertProps) {
  const styles =
    type === "INFO"
      ? "border-[var(--info)] bg-[color-mix(in srgb, var(--info) 12%, var(--white))]"
      : type === "SUCCESS"
      ? "border-[var(--success)] bg-[color-mix(in srgb, var(--success) 12%, var(--white))]"
      : "border-[var(--warning)] bg-[color-mix(in srgb, var(--warning) 12%, var(--white))]"

  return (
    <div
      className={`
        fixed
        top-4 left-1/2 -translate-x-1/2
        z-50
        flex items-center gap-1
        justify-center
        px-6 py-3
        rounded-lg
        border-2
        shadow-md
        text-sm
        font-sans
        text-[var(--foreground)]
        leading-snug
        bg-(--white)
        transition-all duration-200 ease-out
        animate-slideDown
        ${styles}
      `}
    >
      <Image
        src={
          type === "INFO"
            ? "/info.svg"
            : type === "SUCCESS"
            ? "/success.svg"
            : "/warning.svg"
        }
        alt={type.toLowerCase()}
        width={18}
        height={18}
      />

      <span className="whitespace-nowrap">
        {message}
      </span>
    </div>
  )
}
