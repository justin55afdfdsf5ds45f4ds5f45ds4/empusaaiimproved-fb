import Link from "next/link"

interface LogoProps {
  href?: string
}

export function Logo({ href = "/" }: LogoProps) {
  const logo = (
    <div className="flex items-center">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-md bg-teal-600 flex items-center justify-center text-white font-bold text-lg">
          E
        </div>
        <div className="h-8 w-8 rounded-md bg-orange-400 flex items-center justify-center text-white font-bold text-lg ml-[-4px]">
          A
        </div>
        <span className="ml-2 font-bold text-xl">Empusa AI</span>
      </div>
    </div>
  )

  if (href) {
    return <Link href={href}>{logo}</Link>
  }

  return logo
}
