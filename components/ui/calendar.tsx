"use client"

import * as React from "react"
// Icons removed due to unused after adjusting calendar
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import "react-day-picker/dist/style.css"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      style={{
        // Light green accent for selected / hovered states
        '--rdp-accent-color': 'hsl(173 80% 40%)',
        '--rdp-accent-color-dark': 'hsl(173 80% 35%)',
      } as React.CSSProperties}
      showOutsideDays={showOutsideDays}
      className={cn("rdp rounded-md p-3", className)}
      classNames={{
        day_selected: "bg-[hsl(173_80%_40%)] text-white hover:bg-[hsl(173_80%_35%)]",
        ...classNames,
      }}
      // Removed custom icon components to avoid type issues
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
