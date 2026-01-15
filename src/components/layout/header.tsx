import Link from "next/link";

const navItems = [
	{ href: "/", label: "Home" },
	{ href: "/posts", label: "Posts" },
	{ href: "/utils", label: "Utils" },
];

export default function Header() {
	return (
		<header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/80 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/70">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
				<Link
					href="/"
					className="flex items-center gap-2 text-sm font-semibold tracking-wide text-zinc-900 dark:text-zinc-100"
				>
					<span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
					myaotils
				</Link>

				<nav className="hidden items-center gap-6 text-sm text-zinc-600 md:flex dark:text-zinc-300">
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="transition-colors hover:text-zinc-900 dark:hover:text-white"
						>
							{item.label}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-3">
					<Link
						href="/login"
						className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:text-white"
					>
						Login
					</Link>
				</div>
			</div>
		</header>
	);
}
