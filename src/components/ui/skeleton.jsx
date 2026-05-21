import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden bg-zinc-900/30 border border-white/5 rounded-xl animate-shimmer",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton }

