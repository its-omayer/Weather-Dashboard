"use client"

import { TemperatureUnit } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface UnitToggleProps {
  unit: TemperatureUnit
  onToggle: (unit: TemperatureUnit) => void
}

export function UnitToggle({ unit, onToggle }: UnitToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
      <Button
        variant={unit === "metric" ? "default" : "ghost"}
        size="sm"
        onClick={() => onToggle("metric")}
        className="h-8 px-3"
      >
        °C
      </Button>
      <Button
        variant={unit === "imperial" ? "default" : "ghost"}
        size="sm"
        onClick={() => onToggle("imperial")}
        className="h-8 px-3"
      >
        °F
      </Button>
    </div>
  )
}
