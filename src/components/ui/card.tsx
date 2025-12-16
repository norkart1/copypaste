import { cn } from "@/lib/utils";
import type { HTMLAttributes, PropsWithChildren } from "react";

export function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & PropsWithChildren) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-6 shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & PropsWithChildren) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold tracking-tight text-gray-900",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & PropsWithChildren) {
  return (
    <p className={cn("text-sm text-gray-500", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & PropsWithChildren) {
  return (
    <div
      className={cn("p-0 pt-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

