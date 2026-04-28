"use client";

import { useState } from "react";

const navLinks = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#featured-work", label: "Projects" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 shadow-[0_2px_18px_0_rgba(0,0,0,0.35)]"
      style={{ background: "rgba(0,0,0,0.85)" }}
    >
      <div className="relative flex w-full items-center justify-between px-5 h-[100px]">

        {/* LOGO */}
        <a href="#top" onClick={closeMenu}>
          <img src="/SonnyTaparaLogo.png" alt="Logo" className="h-[100px] w-auto flex-shrink-0" />
        </a>

        {/* HAMBURGER / XMARK */}
        <button
          className="z-[100] ml-auto mr-4 hidden text-white text-[30px] cursor-pointer transition hover:text-[rgb(255,40,0)] max-[900px]:block"
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            /* X mark */
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-7 w-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            /* Bars */
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-7 w-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* NAV LINKS + CONTACT BUTTON */}
        <nav
          className={[
            "flex items-center gap-1 text-[16px] font-bold text-white",
            /* mobile: full-width dropdown */
            "max-[900px]:absolute max-[900px]:top-[100px] max-[900px]:left-0 max-[900px]:w-full",
            "max-[900px]:flex-col max-[900px]:bg-[rgba(0,0,0,0.85)] max-[900px]:z-50 max-[900px]:overflow-hidden",
            isOpen ? "max-[900px]:flex" : "max-[900px]:hidden",
          ].join(" ")}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={closeMenu}
              className="px-4 py-[14px] transition hover:bg-[rgb(255,40,0)] max-[900px]:w-full max-[900px]:text-center max-[900px]:mt-2"
            >
              {link.label}
            </a>
          ))}

          {/* CONTACT ME BUTTON */}
          <a
            href="#contact"
            onClick={closeMenu}
            className="mx-4 my-[15px] flex w-40 flex-shrink-0 cursor-pointer items-center justify-center rounded-[20px] bg-[rgb(255,40,0)] px-[10px] py-[10px] font-bold text-white transition hover:bg-[rgb(200,30,0)] max-[900px]:mx-auto max-[900px]:mb-4 max-[900px]:mt-2"
          >
            Contact Me
          </a>
        </nav>
      </div>
    </header>
  );
}
