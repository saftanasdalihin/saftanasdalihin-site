// components/layout/Navbar.tsx
"use client"; // Needed for hooks (useState, usePathname)

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiMenu, HiX } from 'react-icons/hi';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const pathname = usePathname();

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsClosing(false);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/contact', label: 'Contact' },
    { href: '/chat', label: "Chatbot AI" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border 
                      bg-background/80 backdrop-blur-md transition-colors">
        
        <div className="container mx-auto flex items-center justify-between p-4 md:px-6">
          {/* Logo / Name */}
          <Link href="/" className="text-2xl font-bold transition-colors hover:text-primary">
            Safta.
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center space-x-6 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-lg font-medium transition-colors hover:text-primary 
                            ${isActive 
                              ? 'text-primary border-b-2 border-primary' 
                              : 'text-foreground/70'
                            }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {/* Dark Mode Toggle */}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button & Dark Mode Toggle (On Mobile) */}
          <div className="flex items-center space-x-4 md:hidden">
              <ThemeToggle />
              <button
                  onClick={() => isOpen || isClosing ? handleClose() : handleOpen()}
                  className="z-50 text-2xl transition-colors hover:text-primary"
                  style={{
                    animation: (isOpen && !isClosing) 
                      ? 'spinForward 0.3s ease-out forwards' 
                      : (isClosing ? 'spinBackward 0.3s ease-in forwards' : 'none'),
                  }}
                  aria-label="Toggle menu"
              >
                  {isOpen || isClosing ? <HiX /> : <HiMenu />}
              </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu (Full Screen Overlay) */}
      {(isOpen || isClosing) && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed top-[65px] left-0 right-0 bottom-0 z-40 md:hidden"
            style={{
              animation: isClosing ? 'fadeOut 0.3s ease-in-out forwards' : 'fadeIn 0.3s ease-in-out forwards',
            }}
            onClick={() => handleClose()}
          />
          {/* Menu dropdown */}
          <div 
            className="fixed top-[65px] left-0 right-0 z-49 md:hidden bg-background/80 backdrop-blur-md border-b border-border"
            style={{
              animation: isClosing ? 'slideUp 0.3s ease-in forwards' : 'slideDown 0.3s ease-out forwards',
              width: '100%',
            }}
          >
            <div className="flex flex-col items-center gap-4 py-6 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-semibold transition-colors hover:text-primary w-full text-center py-2 hover:bg-secondary/50 rounded-md" 
                  onClick={() => handleClose()}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};