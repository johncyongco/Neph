import type { HTMLMotionProps } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/tw";

interface CardProps extends HTMLMotionProps<"article"> {
  soft?: boolean;
}

export function Card({ className, soft, children, ...props }: CardProps) {
  return (
    <motion.article
      className={cn(soft ? "paper-soft" : "paper", className)}
      {...props}
    >
      {children}
    </motion.article>
  );
}