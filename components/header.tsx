"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export const navLinks = [
	{
		label: "About",
		href: "#about",
	},
	{
		label: "Events",
		href: "#events",
	},
	{
		label: "News",
		href: "#news",
	},
];

export function Header() {
	const scrolled = useScroll(10);
	const [hoveredLink, setHoveredLink] = useState<string | null>(null);

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
					{/* Mobile: Logo at left */}
					<div className="flex items-center md:hidden">
						<a className="transition-opacity hover:opacity-80" href="#">
							<span className="font-space-grotesk text-base font-bold uppercase tracking-[0.15em] text-foreground">VSC Connect</span>
						</a>
					</div>
					{/* Left: Links */}
					<div className="flex flex-1 items-center">
						<div
							className="hidden items-center gap-1 md:flex"
							onMouseLeave={() => setHoveredLink(null)}
						>
							{navLinks.map((link) => (
								<a
									key={link.label}
									href={link.href}
									className="relative whitespace-nowrap px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-foreground/60 transition-colors duration-150 hover:text-foreground"
									onMouseEnter={() => setHoveredLink(link.label)}
								>
									<AnimatePresence>
										{hoveredLink === link.label && (
											<motion.span
												className="absolute inset-0 rounded-md bg-accent"
												layoutId="nav-hover"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												transition={{
													type: "spring",
													stiffness: 350,
													damping: 30,
													mass: 0.8,
												}}
											/>
										)}
									</AnimatePresence>
									<span className="relative z-10">{link.label}</span>
								</a>
							))}
						</div>
					</div>

					{/* Center: Logo (desktop only) */}
					<div className="hidden md:flex shrink-0 items-center justify-center">
						<a
							className="transition-opacity hover:opacity-80"
							href="#"
						>
							<span className="font-space-grotesk text-base font-bold uppercase tracking-[0.15em] text-foreground">VSC Connect</span>
						</a>
					</div>

					{/* Right: Actions */}
					<div className="flex flex-1 items-center justify-end gap-5">
						<div className="hidden h-5 w-px bg-border/60 md:block" />
						<Button 
							variant="outline"
							size="sm" 
							render={<Link href="/login" />}
							nativeButton={false}
							className="hidden md:inline-flex h-9 rounded-md px-6 text-[11px] font-bold uppercase tracking-[0.15em] border border-border transition-colors shadow-sm bg-background hover:bg-accent hover:text-accent-foreground"
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
