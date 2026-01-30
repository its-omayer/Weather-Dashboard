import { NextRequest, NextResponse } from "next/server"

const API_KEY = process.env.OPENWEATHERMAP_API_KEY

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")
  const city = searchParams.get("city")
  const units = searchParams.get("units") || "metric"

  if (!API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    )
  }

  try {
    let weatherUrl: string
    let forecastUrl: string

    if (city) {
      // First get coordinates from city name
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
      const geoResponse = await fetch(geoUrl)
      const geoData = await geoResponse.json()

      if (!geoData.length) {
        return NextResponse.json({ error: "City not found" }, { status: 404 })
      }

      const { lat: cityLat, lon: cityLon } = geoData[0]
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&units=${units}&appid=${API_KEY}`
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&units=${units}&appid=${API_KEY}`
    } else if (lat && lon) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
    } else {
      return NextResponse.json(
        { error: "Location required" },
        { status: 400 }
      )
    }

    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl),
    ])

    const weatherData = await weatherResponse.json()
    const forecastData = await forecastResponse.json()

    if (weatherData.cod !== 200) {
      return NextResponse.json(
        { error: weatherData.message },
        { status: weatherData.cod }
      )
    }

    // Process hourly data (next 24 hours)
    const hourlyData = forecastData.list.slice(0, 8).map((item: any) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      }),
      temp: Math.round(item.main.temp),
      icon: item.weather[0].icon,
      description: item.weather[0].description,
    }))

    // Process daily forecast (5 days)
    const dailyMap = new Map()
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {
        weekday: "short",
      })
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date,
          fullDate: new Date(item.dt * 1000).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          temps: [],
          icon: item.weather[0].icon,
          description: item.weather[0].description,
        })
      }
      dailyMap.get(date).temps.push(item.main.temp)
    })

    const dailyData = Array.from(dailyMap.values())
      .slice(0, 5)
      .map((day: any) => ({
        ...day,
        high: Math.round(Math.max(...day.temps)),
        low: Math.round(Math.min(...day.temps)),
      }))

    return NextResponse.json({
      current: {
        city: weatherData.name,
        country: weatherData.sys.country,
        temp: Math.round(weatherData.main.temp),
        feelsLike: Math.round(weatherData.main.feels_like),
        humidity: weatherData.main.humidity,
        wind: Math.round(weatherData.wind.speed),
        visibility: Math.round(weatherData.visibility / 1000),
        pressure: weatherData.main.pressure,
        icon: weatherData.weather[0].icon,
        description: weatherData.weather[0].description,
        sunrise: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString(
          "en-US",
          { hour: "numeric", minute: "2-digit", hour12: true }
        ),
        sunset: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString(
          "en-US",
          { hour: "numeric", minute: "2-digit", hour12: true }
        ),
      },
      hourly: hourlyData,
      daily: dailyData,
    })
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    )
  }
}
