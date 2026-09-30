export default function SocialLink({
  name,
  href,
  icon,
}: {
  name: string
  href: string
  icon: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      className="text-gray-300 hover:text-rose-400 transition-colors"
    >
      {icon}
    </a>
  );
}