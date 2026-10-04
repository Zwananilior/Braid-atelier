import Link from 'next/link'
import SocialLink from './SocialLink'

const socialLinks = [
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: '#',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: '#',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.6 5.82c-1.02-.9-1.6-2.2-1.6-3.62h-3.4v13.3a2.7 2.7 0 1 1-2.7-2.7c.3 0 .58.05.85.13V9.4a6.1 6.1 0 1 0 5.25 6.03V9.8a7.5 7.5 0 0 0 4.4 1.4V7.8c-.99 0-1.94-.28-2.8-.78-.02-.4-.02-.8 0-1.2z" />
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    href: '#',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.6 6.32A8.86 8.86 0 0 0 12.05 4a8.94 8.94 0 0 0-7.75 13.41L3 21l3.69-1.27A8.93 8.93 0 0 0 12.05 21 8.94 8.94 0 0 0 21 12.06a8.86 8.86 0 0 0-3.4-5.74zm-5.55 13.1a7.43 7.43 0 0 1-3.78-1.03l-.27-.16-2.8.97.93-2.72-.18-.28a7.44 7.44 0 1 1 6.1 3.22zm4.08-5.57c-.22-.11-1.31-.65-1.51-.72-.2-.07-.35-.11-.5.11-.15.22-.58.72-.71.87-.13.15-.26.16-.48.05-.22-.11-.94-.35-1.79-1.11-.66-.59-1.11-1.32-1.24-1.54-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.39.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.39-.06-.11-.5-1.21-.69-1.66-.18-.43-.37-.37-.5-.38-.13-.01-.28-.01-.43-.01a.83.83 0 0 0-.6.28c-.2.22-.79.77-.79 1.87s.81 2.17.92 2.32c.11.15 1.6 2.44 3.87 3.42.54.23.96.37 1.29.48.54.17 1.03.15 1.42.09.43-.06 1.31-.53 1.5-1.05.18-.51.18-.95.13-1.05-.06-.09-.2-.15-.42-.26z" />
      </svg>
    ),
  },
]

const contactDetails = [
  {
    label: '+27 63 161 5555',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    label: 'hello@thebraidatelier.co.za',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <path d="M22 6l-10 7L2 6" />
      </svg>
    ),
  },
  {
    label: 'Eshowe - SunnySide , South Africa',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-serif text-xl text-white mb-2">The Braid Atelier</h3>
          <p className="text-sm text-gray-400">Braids · Locs · Styles</p>
        </div>

        <div>
          <h4 className="text-white font-medium mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {['Home', 'Services', 'Gallery', 'About', 'Contact'].map((item) => (
              <li key={item}>
                <Link href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="hover:text-rose-400 transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-3">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            {contactDetails.map((detail) => (
              <li key={detail.label} className="flex items-center gap-2">
                <span className="text-rose-400 shrink-0">{detail.icon}</span>
                <span>{detail.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-3">Follow Us</h4>
          <div className="flex gap-4">
            {/* TODO: replace # with the salon's real social handles */}
            {socialLinks.map((social) => (
              <SocialLink key={social.name} name={social.name} href={social.href} icon={social.icon} />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-gray-800 text-xs text-gray-500 flex flex-wrap justify-between gap-2">
        <span>© 2026 The Braid Atelier. All rights reserved.</span>
        <span className="flex gap-3">
          <Link href="/terms" className="hover:text-rose-400 transition-colors underline-offset-2 hover:underline">
            Terms & Conditions
          </Link>
          <span className="text-gray-700">|</span>
          <Link href="/privacy" className="hover:text-rose-400 transition-colors underline-offset-2 hover:underline">
            Privacy Policy
          </Link>
        </span>
      </div>
    </footer>
  )
}
