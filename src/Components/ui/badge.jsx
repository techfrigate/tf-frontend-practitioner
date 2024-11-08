import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-3xl border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/80",
        outline:
          "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
        success:
          "border-transparent bg-green-500 text-white shadow-sm hover:bg-green-400",
        warning:
          "border-transparent bg-yellow-500 text-white shadow-sm hover:bg-yellow-400",
        info: "border-transparent bg-blue-500 text-white shadow-sm hover:bg-blue-400",
        neutral:
          "border-transparent bg-gray-500 text-white shadow-sm hover:bg-gray-400",
        subtle:
          "border border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-200",
        inverted:
          "border-transparent bg-white text-black shadow-sm hover:bg-gray-50",
        dark: "border-transparent bg-black text-white shadow-sm hover:bg-black/80",
        light: "border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200",
        muted:
          "border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100",
        vibrant:
          "border-transparent bg-pink-500 text-white shadow-sm hover:bg-pink-400",
          infoLightPurple:
          "border-transparent bg-purple-100 text-purple-800 shadow-sm hover:bg-purple-200",
        
        infoLight:
          "border-transparent bg-blue-100 text-blue-800 shadow-sm hover:bg-blue-200",
        successLight:
          "border-transparent bg-green-100 text-green-800 shadow-sm hover:bg-green-200",
        warningLight:
          "border-transparent bg-yellow-100 text-yellow-800 shadow-sm hover:bg-yellow-200",
        dangerLight:
          "border-transparent bg-red-100 text-red-800 shadow-sm hover:bg-red-200",
        forestLight: "bg-[#e0f5f1] text-[#00A182] shadow-sm",
        gradient:
          "bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-400 hover:to-green-400",
        rounded:
          "border-transparent bg-indigo-500 text-white shadow-sm rounded-full hover:bg-indigo-400",
        pill: "border-transparent bg-purple-500 text-white rounded-full py-1 px-4 hover:bg-purple-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
