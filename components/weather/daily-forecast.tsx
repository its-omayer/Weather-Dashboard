"use client"

import { DailyWeather, TemperatureUnit } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

interface DailyForecastProps {
  data: DailyWeather[]
  unit: TemperatureUnit
}

export function DailyForecast({ data, unit }: DailyForecastProps) {
  const tempSymbol = unit === "metric" ? "°" : "°"

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">
          5-Day Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {data.map((day, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <p className="text-sm font-medium text-foreground">{day.date}</p>
              <p className="text-xs text-muted-foreground">{day.fullDate}</p>
              <div className="relative h-12 w-12 my-2">
                <Image
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.description}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-sm capitalize text-muted-foreground mb-2">
                {day.description}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {day.high}{tempSymbol}
                </span>
                <span className="text-sm text-muted-foreground">
                  {day.low}{tempSymbol}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
