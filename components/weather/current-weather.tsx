"use client"

import { CurrentWeather as CurrentWeatherType, TemperatureUnit } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Droplets, Wind, Eye, Gauge, Sunrise, Sunset } from "lucide-react"
import Image from "next/image"

interface CurrentWeatherProps {
  data: CurrentWeatherType
  unit: TemperatureUnit
}

export function CurrentWeather({ data, unit }: CurrentWeatherProps) {
  const tempSymbol = unit === "metric" ? "C" : "F"
  const windUnit = unit === "metric" ? "m/s" : "mph"

  return (
    <Card className="bg-card border-border overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24 flex-shrink-0">
              <Image
                src={`https://openweathermap.org/img/wn/${data.icon}@4x.png`}
                alt={data.description}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-foreground">
                {data.temp}°{tempSymbol}
              </h2>
              <p className="text-muted-foreground capitalize">{data.description}</p>
              <p className="text-sm text-muted-foreground">
                Feels like {data.feelsLike}°{tempSymbol}
              </p>
            </div>
          </div>

          <div className="text-right">
            <h1 className="text-2xl font-semibold text-foreground">
              {data.city}, {data.country}
            </h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Droplets className="h-5 w-5 text-sky-400" />
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="text-sm font-medium text-foreground">{data.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Wind className="h-5 w-5 text-teal-400" />
            <div>
              <p className="text-xs text-muted-foreground">Wind</p>
              <p className="text-sm font-medium text-foreground">
                {data.wind} {windUnit}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Eye className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-xs text-muted-foreground">Visibility</p>
              <p className="text-sm font-medium text-foreground">{data.visibility} km</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Gauge className="h-5 w-5 text-orange-400" />
            <div>
              <p className="text-xs text-muted-foreground">Pressure</p>
              <p className="text-sm font-medium text-foreground">{data.pressure} hPa</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Sunrise className="h-5 w-5 text-amber-400" />
            <div>
              <p className="text-xs text-muted-foreground">Sunrise</p>
              <p className="text-sm font-medium text-foreground">{data.sunrise}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Sunset className="h-5 w-5 text-rose-400" />
            <div>
              <p className="text-xs text-muted-foreground">Sunset</p>
              <p className="text-sm font-medium text-foreground">{data.sunset}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
