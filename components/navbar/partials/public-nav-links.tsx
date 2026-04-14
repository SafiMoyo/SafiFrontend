import { Button } from "@/components/ui/button"

type NavItem = {
  label: string
  href: string
}

type PublicNavLinksProps = {
  pathname: string | null
  navItems: NavItem[]
  onHowItWorks: () => void
  onItemClick?: () => void
  mobile?: boolean
}

export const PublicNavLinks = ({
  pathname,
  navItems,
  onHowItWorks,
  onItemClick,
  mobile = false,
}: PublicNavLinksProps) => {
  const wrapperClass = mobile
    ? "flex flex-col gap-2"
    : "hidden gap-10 font-semibold md:flex"

  const buttonClass = (href: string) => {
    const isActive = pathname === href
    const base = isActive ? "font-bold text-primary" : "text-black"
    return mobile ? `justify-start ${base}` : base
  }

  const howItWorksClass = mobile ? "justify-start text-black" : "text-black"

  return (
    <div className={wrapperClass}>
      {navItems.map((item) => (
        <Button
          key={item.label}
          variant="link"
          href={item.href}
          className={buttonClass(item.href)}
          onClick={onItemClick}
        >
          {item.label}
        </Button>
      ))}

      <Button
        type="button"
        variant="link"
        className={howItWorksClass}
        onClick={onHowItWorks}
      >
        How it works
      </Button>

      <Button
        type="button"
        variant="link"
        href="/pricing"
        className={buttonClass("/pricing")}
        onClick={onItemClick}
      >
        Pricing
      </Button>
    </div>
  )
}
