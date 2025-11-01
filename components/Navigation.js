'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const AnimatedNavLink = ({ href, children, isActive }) => {
  const defaultTextColor = isActive ? 'text-white' : 'text-gray-300';
  const hoverTextColor = 'text-white';
  const textSizeClass = 'text-sm';

  return (
    <Link href={href} className={`group relative inline-block overflow-hidden h-5 flex items-center ${textSizeClass}`}>
      <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
        <span className={defaultTextColor}>{children}</span>
        <span className={hoverTextColor} style={{
          background: 'linear-gradient(45deg, oklch(97.1% 0.014 343.198), oklch(98.4% 0.019 200.873))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>{children}</span>
      </div>
    </Link>
  );
};

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/chat', label: 'Chat' },
    { href: '/upload-agents', label: 'Upload Agents' },
  ];

  const logoElement = (
    <Link href="/" className="flex items-center">
      <Image
        src="/intellibox.svg"
        alt="Intellibox Logo"
        width={30}
        height={30}
        className="w-8 h-8"
      />
      <span className="ml-2 text-white font-semibold">IntelliBox</span>
    </Link>
  );

  return (
    <header className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50
                       flex flex-col items-center
                       px-4 py-2.5 backdrop-blur-sm
                       rounded-full
                       border border-[rgba(255,255,255,0.2)]
                       w-[calc(100%-2rem)] sm:w-auto
                       transition-[border-radius] duration-300 ease-in-out shadow-lg`}
                       style={{ 
                         background: 'rgba(0, 0, 0, 0.8)',
                         boxShadow: '0 8px 32px oklch(97.1% 0.014 343.198 / 0.3)'
                       }}>

      <div className="flex items-center justify-between w-full gap-x-3 sm:gap-x-4">
        <div className="flex items-center">
          {logoElement}
        </div>

        <nav className="hidden sm:flex items-center space-x-4 text-sm">
          {navItems.map((link) => {
            const isActive = pathname === link.href;
            return (
              <AnimatedNavLink key={link.href} href={link.href} isActive={isActive}>
                {link.label}
              </AnimatedNavLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
