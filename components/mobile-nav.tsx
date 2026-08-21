import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Portal } from "@/components/portal";
import { navLinks } from "@/components/header";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const containerVariants = {
	hidden: { opacity: 0, y: -12 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.25,
			ease: [0.25, 0.1, 0.25, 1] as const,
			staggerChildren: 0.04,
			delayChildren: 0.06,
		},
	},
	exit: {
		opacity: 0,
		y: -8,
		transition: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] as const },
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 8 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const },
	},
	exit: { opacity: 0, transition: { duration: 0.1 } },
};

function ToggleIcon({ open }: { open: boolean }) {
	const topRef = useRef<SVGLineElement>(null);
	const botRef = useRef<SVGLineElement>(null);
	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			if (!open) return;
		}

		const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

		if (open) {
			tl.to(topRef.current, { y: 4, duration: 0.2 }, 0)
			  .to(botRef.current, { y: -4, duration: 0.2 }, 0)
			  .to(topRef.current, { rotate: 45, transformOrigin: "center", duration: 0.25 }, 0.15)
			  .to(botRef.current, { rotate: -45, transformOrigin: "center", duration: 0.25 }, 0.15);
		} else {
			tl.to(topRef.current, { rotate: 0, transformOrigin: "center", duration: 0.25 }, 0)
			  .to(botRef.current, { rotate: 0, transformOrigin: "center", duration: 0.25 }, 0)
			  .to(topRef.current, { y: 0, duration: 0.2 }, 0.15)
			  .to(botRef.current, { y: 0, duration: 0.2 }, 0.15);
		}

		return () => { tl.kill(); };
	}, [open]);

	return (
		<svg width="16" height="16" viewBox="0 0 16 16" className="overflow-visible">
			<line
				ref={topRef}
				x1="2" y1="4" x2="14" y2="4"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<line
				ref={botRef}
				x1="2" y1="12" x2="14" y2="12"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
		</svg>
	);
}

export function MobileNav() {
	const [open, setOpen] = React.useState(false);

	return (
		<div className="md:hidden">
			<Button
				aria-controls="mobile-menu"
				aria-expanded={open}
				aria-label="Toggle menu"
				className="md:hidden border-2"
				onClick={() => setOpen(!open)}
				size="icon"
				variant="outline"
			>
				<ToggleIcon open={open} />
			</Button>

			<AnimatePresence>
				{open && (
					<Portal className="top-14" id="mobile-menu">
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="fixed inset-0 bg-background/20 backdrop-blur-sm z-40"
							onClick={() => setOpen(false)}
						/>
						
						{/* Dropdown Menu */}
						<motion.div
							variants={containerVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
							style={{ willChange: "opacity, transform" }}
							className="absolute inset-x-0 top-0 pb-6 p-4 flex flex-col bg-background border-b border-border/40 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.08)] z-50 overflow-hidden"
						>
							<div className="grid gap-y-1 mt-4">
								{navLinks.map((link) => (
									<motion.div key={link.label} variants={itemVariants}>
										<Button 
											className="w-full justify-center text-[13px] font-bold uppercase tracking-widest h-12 px-4" 
											variant="ghost" 
											render={<a href={link.href} />} 
											nativeButton={false}
											onClick={() => setOpen(false)}
										>
											{link.label}
										</Button>
									</motion.div>
								))}
							</div>
							<motion.div variants={itemVariants} className="mt-4 px-1">
								<Button 
									variant="outline"
									render={<Link href="/login" />}
									nativeButton={false}
									className="w-full h-9 rounded-md text-[11px] font-bold uppercase tracking-[0.15em] border border-border shadow-sm bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
									onClick={() => setOpen(false)}
								>
									Login
								</Button>
							</motion.div>
						</motion.div>
					</Portal>
				)}
			</AnimatePresence>
		</div>
	);
}
