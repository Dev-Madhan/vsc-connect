import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "@/components/ui/button";
import { Portal } from "@/components/portal";
import { navLinks } from "@/components/header";
import { XIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
	hidden: { opacity: 0, y: -20, scaleY: 0.95 },
	visible: {
		opacity: 1,
		y: 0,
		scaleY: 1,
		transition: {
			duration: 0.3,
			ease: [0.16, 1, 0.3, 1],
			staggerChildren: 0.06,
			delayChildren: 0.1,
		},
	},
	exit: {
		opacity: 0,
		y: -10,
		scaleY: 0.95,
		transition: { duration: 0.2 },
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
	visible: {
		opacity: 1,
		y: 0,
		filter: "blur(0px)",
		transition: { duration: 0.4, ease: "easeOut" },
	},
	exit: { opacity: 0, transition: { duration: 0.1 } },
};

export function MobileNav() {
	const [open, setOpen] = React.useState(false);

	return (
		<div className="md:hidden">
			<Button
				aria-controls="mobile-menu"
				aria-expanded={open}
				aria-label="Toggle menu"
				className="md:hidden"
				onClick={() => setOpen(!open)}
				size="icon"
				variant="outline"
			>
				{open ? (
					<XIcon className="size-4.5" />
				) : (
					<MenuIcon className="size-4.5" />
				)}
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
							className="absolute inset-x-0 top-0 pb-6 p-4 flex flex-col bg-background/95 backdrop-blur-xl border-b border-border/40 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] origin-top z-50 overflow-hidden"
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
								{/* Exact same button theme and text styling as desktop header */}
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
