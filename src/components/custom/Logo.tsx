import { useTheme } from "@/hooks/Theme"

export default function Logo({ className = "h-10 w-auto" }: { className?: string }) {
  const [theme] = useTheme();
  const src = theme === "light" ? "/images/logo.svg" : "/images/logo_light.svg"

  return (
    <img
      src={src}
      alt="PostureX Logo"
      className={className}
      draggable={false}
    />
  )
}