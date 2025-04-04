
import * as React from "react"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: number
    max?: number
    indeterminate?: boolean
  }
>(({ className, value, max = 100, indeterminate = false, ...props }, ref) => {
  const percentage = value != null && max > 0 ? (value / max) * 100 : null

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      data-max={max}
      data-indeterminate={indeterminate}
      data-value={value}
      {...props}
    >
      <div
        className={cn(
          "h-full w-full flex-1 bg-primary transition-all",
          {
            "animate-indeterminate": indeterminate,
          }
        )}
        style={{
          transform: percentage != null ? `translateX(-${100 - percentage}%)` : "translateX(-100%)",
        }}
      />
    </div>
  )
})
Progress.displayName = "Progress"

export { Progress }
