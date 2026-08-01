import { forwardRef, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { twMerge } from "@/lib/tw";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";
export type ButtonSize = "md" | "lg" | "sm";

interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "ref"> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-14 px-7 text-base",
};

const variants: Record<ButtonVariant, string> = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  outline: "btn btn-outline",
  ghost: "btn btn-ghost",
  danger: "btn btn-danger",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", size = "md", fullWidth, className, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      className={twMerge(
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
);
Button.displayName = "Button";

type IconButtonProps = HTMLMotionProps<"button"> & {
  children: ReactNode;
  label: string;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, label, className, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.92 }}
      aria-label={label}
      className={twMerge(
        "inline-flex h-11 w-11 items-center justify-center rounded-[14px] text-text-secondary transition-colors hover:bg-card-soft",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
);
IconButton.displayName = "IconButton";