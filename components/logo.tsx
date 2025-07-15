import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  href?: string
  noLink?: boolean
  className?: string
}

export const Logo = ({ href = "/", noLink = false, className }: LogoProps) => {
  const logo = (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src="https://res.cloudinary.com/dbalp1654/image/upload/v1752251975/upscalemedia-transformed-Photoroom_w0wqo9.png"
        alt="Empusa AI logo"
        className="h-8 w-auto"
      />
      <span className="font-bold text-xl">Empusa AI</span>
    </div>
  )

  // Only return the logo without Link if noLink is true
  if (noLink) {
    return logo
  }

  // Return the logo wrapped in Link
  return (
    <Link href={href} className="no-underline">
      {logo}
    </Link>
  )
}
