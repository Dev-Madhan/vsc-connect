import type React from "react";
import { cn } from "@/lib/utils";

export const LogoIcon = ({ className, ...props }: React.ComponentProps<"span">) => (
	<span
		{...props}
		className={cn(
			"font-big-shoulders font-extrabold uppercase tracking-wide text-xl sm:text-2xl text-foreground",
			className
		)}
	>
		VC
	</span>
);

export const Logo = ({ className, ...props }: React.ComponentProps<"span">) => (
	<span
		{...props}
		className={cn(
			"font-big-shoulders font-extrabold uppercase tracking-wide text-xl sm:text-[22px] md:text-2xl text-foreground whitespace-nowrap transition-colors select-none",
			className
		)}
	>
		VISTARA CONNECT
	</span>
);
