import Link from "next/link"

interface LogoProps {
  href?: string
}

export function Logo({ href = "/" }: LogoProps) {
  const logo = (
    <div className="flex items-center gap-2">
      <img src="https://res.cloudinary.com/dbalp1654/image/upload/v1752251975/upscalemedia-transformed-Photoroom_w0wqo9.png" alt="Empusa AI logo" className="h-8 w-auto" />
      <span className="font-bold text-xl">Empusa AI</span>
    </div>
  )

  if (href) {
    return <Link href={href}>{logo}</Link>
  }

  return logo
}
