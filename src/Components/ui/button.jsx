import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",

        // New Variants
        forest: "bg-[#00A182] text-white hover:bg-[#00876F] shadow-sm",
        success: "bg-green-500 text-white hover:bg-green-600 shadow-sm",
        warning: "bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm",
        info: "bg-blue-500 text-white hover:bg-blue-600 shadow-sm",
        light: "bg-gray-100 text-gray-800 hover:bg-gray-200",
        indigo: "bg-indigo-500 text-white hover:bg-indigo-600",
        dark: "bg-gray-800 text-white hover:bg-gray-700",
        subtle: "bg-gray-200 text-gray-800 hover:bg-gray-300",
        transparent: "bg-transparent text-primary hover:bg-primary/10",
        disabled: "bg-gray-300 text-gray-500 cursor-not-allowed",
        successOutline:
          "border border-green-500 text-green-500 hover:bg-green-500 hover:text-white",
        warningOutline:
          "border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white",
        infoOutline:
          "border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
        forestOutline:
          "border border-[#00A182] text-[#00A182] hover:bg-[#00A182] hover:text-white",
        roseOutline:
          "border border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white",
        amberOutline:
          "border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white",
        emeraldOutline:
          "border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white",
        violetOutline:
          "border border-violet-500 text-violet-500 hover:bg-violet-500 hover:text-white",
        fuchsiaOutline:
          "border border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500 hover:text-white",
        skyOutline:
          "border border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white",
        limeOutline:
          "border border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-white",
        cyanOutline:
          "border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white",
        slateOutline:
          "border border-slate-500 text-slate-500 hover:bg-slate-500 hover:text-white",
        zincOutline:
          "border border-zinc-500 text-zinc-500 hover:bg-zinc-500 hover:text-white",
        stoneOutline:
          "border border-stone-500 text-stone-500 hover:bg-stone-500 hover:text-white",
        primaryOutline:
          "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
        secondaryOutline:
          "border border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white",
        dangerOutline:
          "border border-red-500 text-red-500 hover:bg-red-500 hover:text-white",
        lightOutline:
          "border border-gray-300 text-gray-300 hover:bg-gray-300 hover:text-black",
        darkOutline:
          "border border-black text-black hover:bg-black hover:text-white",
        purpleOutline:
          "border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white",
        orangeOutline:
          "border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white",
        tealOutline:
          "border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white",
        pinkOutline:
          "border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white",
        indigoOutline:
          "border border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white",
        limeOutline:
          "border border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-white",
        cyanOutline:
          "border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white",

        gradient:
          "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:bg-gradient-to-l",
      },

      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-7 w-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
