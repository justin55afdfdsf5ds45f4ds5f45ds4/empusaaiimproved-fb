"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TimeSelectProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
}

// Generate time slots from 00:00 to 23:30 in 30-minute intervals
const generateTimeSlots = () => {
  const slots = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, "0")
      const formattedMinute = minute.toString().padStart(2, "0")
      slots.push(`${formattedHour}:${formattedMinute}`)
    }
  }
  return slots
}

const timeSlots = generateTimeSlots()

export function TimeSelect({ value, onValueChange, className }: TimeSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <SelectValue placeholder="Select time" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <div className="max-h-[300px] overflow-auto">
          {timeSlots.map((time) => (
            <SelectItem key={time} value={time}>
              {time}
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  )
}
