"use client"

import { useState, useEffect, useCallback } from "react"
import useSWR from "swr"
import { WeatherData, TemperatureUnit } from "@/lib/types"
import { SearchBar } from "./search-bar"
import { CurrentWeather } from "./current-weather"
import { HourlyChart } from "./hourly-chart"
import { DailyForecast } from "./daily-forecast"
import { UnitToggle } from "./unit-toggle"
import { Cloud, Loader2, CloudOff } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Location {
  lat?: number
  lon?: number
  city?: string
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Failed to fetch weather data")
  }
  return res.json()
}

export function WeatherDashboard() {
  const [location, setLocation] = useState<Location | null>(null)
  const [unit, setUnit] = useState<TemperatureUnit>("metric")
  const [geoError, setGeoError] = useState<string | null>(null)
  const [isGeolocating, setIsGeolocating] = useState(false)

  const buildUrl = useCallback(() => {
    if (!location) return null
    const params = new URLSearchParams()
    if (location.city) {
      params.set("city", location.city)
    } else if (location.lat !== undefined && location.lon !== undefined) {
      params.set("lat", location.lat.toString())
      params.set("lon", location.lon.toString())
    } else {
      return null
    }
    params.set("units", unit)
    return `/api/weather?${params.toString()}`
  }, [location, unit])

  const { data, error, isLoading } = useSWR<WeatherData>(
    buildUrl(),
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser")
      return
    }

    setIsGeolocating(true)
    setGeoError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
        setIsGeolocating(false)
      },
      (err) => {
        setGeoError(
          err.code === 1
            ? "Location access denied. Please search for a city instead."
            : "Unable to get your location. Please search for a city."
        )
        setIsGeolocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }, [])

  const handleSearch = useCallback((city: string) => {
    setGeoError(null)
    setLocation({ city })
  }, [])

  const handleUnitToggle = useCallback((newUnit: TemperatureUnit) => {
    setUnit(newUnit)
  }, [])

  // Auto-detect location on mount
  useEffect(() => {
    handleGeolocate()
  }, [handleGeolocate])

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Cloud className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Weather</h1>
            </div>
            <UnitToggle unit={unit} onToggle={handleUnitToggle} />
          </div>
          <SearchBar
            onSearch={handleSearch}
            onGeolocate={handleGeolocate}
            isLoading={isLoading || isGeolocating}
          />
        </header>

        <main className="space-y-6">
          {(isLoading || isGeolocating) && !data && (
            <Card className="bg-card border-border">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">
                  {isGeolocating ? "Getting your location..." : "Loading weather data..."}
                </p>
              </CardContent>
            </Card>
          )}

          {(error || geoError) && !data && (
            <Card className="bg-card border-border">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <CloudOff className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-foreground font-medium mb-2">
                  {error?.message || geoError}
                </p>
                <p className="text-sm text-muted-foreground">
                  Try searching for a city above
                </p>
              </CardContent>
            </Card>
          )}

          {data && (
            <>
              <CurrentWeather data={data.current} unit={unit} />
              <HourlyChart data={data.hourly} unit={unit} />
              <DailyForecast data={data.daily} unit={unit} />
            </>
          )}
        </main>

        <footer className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Data provided by OpenWeatherMap
          </p>
        </footer>
      </div>
    </div>
  )
}
