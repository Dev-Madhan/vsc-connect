"use client";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import Link from "next/link";

export const navLinks = [
	{
		label: "About Us",
		href: "#about",
	},
	{
		label: "Events",
		href: "#events",
	},
	{
		label: "Projects",
		href: "#projects",
	},
	{
		label: "News",
		href: "#news",
	},
];

export function Header() {
	const scrolled = useScroll(10);

	return (
		<div className="fixed left-0 right-0 top-6 z-50 flex justify-center px-4 pointer-events-none">
			<header
				className={cn(
					"pointer-events-auto w-full max-w-3xl rounded-md border-2 border-border/40 bg-background/90 shadow-sm backdrop-blur-md transition-all duration-300 ease-out",
					{
						"shadow-md border-border/60 bg-background/95": scrolled,
					}
				)}
			>
				<nav className="flex h-14 w-full items-center justify-between px-6">
					{/* Left: Logo */}
					<div className="flex w-32 shrink-0 items-center">
						<a
							className="transition-opacity hover:opacity-80"
							href="#"
						>
							<Logo className="h-5" />
						</a>
					</div>

					{/* Center: Links */}
					<div className="hidden flex-1 items-center justify-center gap-2 md:flex">
						{navLinks.map((link) => (
							<a 
								key={link.label} 
								href={link.href}
								className="rounded-full px-4 py-1.5 text-[13px] font-medium text-muted-foreground/80 transition-all duration-300 ease-out hover:bg-accent/60 hover:text-foreground hover:shadow-[0_0_10px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_0_10px_rgba(255,255,255,0.03)]"
							>
								{link.label}
							</a>
						))}
					</div>

					{/* Right: Actions */}
					<div className="flex w-32 shrink-0 items-center justify-end gap-5">
						<div className="hidden h-5 w-px bg-border/60 md:block" />
						<Button 
							variant="outline"
							size="sm" 
							render={<Link href="/login" />}
							nativeButton={false}
							className="hidden md:inline-flex h-8 rounded-md px-6 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors"
						>
							Login
						</Button>
						<div className="md:hidden">
							<MobileNav />
						</div>
					</div>
				</nav>
			</header>
		</div>
	);
}
