import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // 1. Remove background, text, and border colors from variants if a hex color is used
        default: "bg-primary text-primary-foreground border-transparent shadow",
        secondary: "bg-secondary text-secondary-foreground border-transparent",
        destructive:
          "bg-destructive text-destructive-foreground border-transparent shadow",
        outline: "text-foreground",
        // 2. Add a custom variant specifically for dynamic hex usage
        custom: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  // 3. Define the explicit color string prop
  color?: string;
}

function Badge({ className, variant, color, style, ...props }: BadgeProps) {
  // 4. Force variant to "custom" if a hex color is supplied, unless explicitly overridden
  const activeVariant = color ? variant || "custom" : variant;

  // 5. Generate inline styles for background, text, and border
  // Note: We append '15' to the hex for background to make it a 15% opacity tint
  const customStyles: React.CSSProperties | undefined = color
    ? {
        backgroundColor: `${color}15`,
        color: color,
        borderColor: `${color}40`, // 40% opacity border
        ...style,
      }
    : style;

  return (
    <div
      className={cn(badgeVariants({ variant: activeVariant }), className)}
      style={customStyles}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
