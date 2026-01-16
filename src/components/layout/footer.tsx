import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Posts" },
  { href: "/utils", label: "Utils" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-zinc-200/70 bg-white/80 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-wide text-zinc-900 dark:text-zinc-100">
            <Image src="/pawcon.png" alt="Logo" width={24} height={24} />
            myaotils
          </div>
          <p className="max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            작은 도구와 기록을 모아두는 개인 유틸리티 허브.
          </p>
        </div>

        <nav className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-300">
          {footerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-zinc-900 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-zinc-200/70 py-4 text-center text-xs text-zinc-500 dark:border-zinc-800/80 dark:text-zinc-400">
        © {year} myaotils. All rights reserved.
      </div>
    </footer>
  );
}
