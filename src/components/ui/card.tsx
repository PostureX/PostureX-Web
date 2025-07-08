import * as React from "react"

import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

const cardVariants = cva(
  "bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm transition-shadow overflow-hidden group",
  {
    variants: {
      variant: {
        default: "hover:shadow-lg hover:[background:var(--gradient-hover)] border-0 border-t border-t-[--highlight]",
        noHighlight: "border-0 border-t-0",
        glass:
          "bg-white/30 backdrop-blur-[2px] rounded-[20px] border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_30px_15px_rgba(255,255,255,1.5)] relative overflow-hidden " +
          "hover:border-white/60 " +
          "before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent " +
          "after:content-[''] after:absolute after:top-0 after:left-0 after:w-px after:h-full after:bg-gradient-to-b after:from-white/80 after:via-transparent after:to-white/30",
        glassWithHoverEffect:
          "bg-white/30 backdrop-blur-[2px] rounded-[20px] border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.1),inset_0_0_30px_15px_rgba(255,255,255,1.5)] relative overflow-hidden " +
          "hover:border-white/60 " +
          "before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent " +
          "after:content-[''] after:absolute after:top-0 after:left-0 after:w-px after:h-full after:bg-gradient-to-b after:from-white/80 after:via-transparent after:to-white/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Card({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: "default" | "noHighlight" | "glass" | "glassWithHoverEffect" }) {
  const [style, setStyle] = React.useState<React.CSSProperties>({});

  // Only apply tilt for glassWithHoverEffect
  const enableTilt = variant === "glassWithHoverEffect";

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!enableTilt) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * -8;
    setStyle({
      transform: `perspective(1600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01,1.01,1.01)`,
      transition: "transform 0.1s cubic-bezier(.03,.98,.52,.99)",
    });
  }

  function handlePointerLeave() {
    if (!enableTilt) return;
    setStyle({
      transform: "perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)",
      transition: "transform 0.3s cubic-bezier(.03,.98,.52,.99)",
    });
  }

  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant }), className)}
      style={style}
      onPointerMove={enableTilt ? handlePointerMove : undefined}
      onPointerLeave={enableTilt ? handlePointerLeave : undefined}
      {...props}
    >
      {props.children}
    </div>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
