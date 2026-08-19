import type React from "react";
import { cn } from "@/lib/utils";

export const LogoIcon = (props: React.ComponentProps<"span">) => (
	<span {...props} className={cn("font-sans font-extrabold tracking-tight text-xl", props.className)}>
		VC
	</span>
);

export const Logo = (props: React.ComponentProps<"span">) => (
	<span {...props} className={cn("font-sans font-extrabold tracking-tight text-2xl whitespace-nowrap", props.className, "h-auto")}>
		VISTARA CONNECT
	</span>
);
