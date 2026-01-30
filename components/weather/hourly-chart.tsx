"use client"

import { HourlyWeather, TemperatureUnit } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface HourlyChartProps {
  data: HourlyWeather[]
  unit: TemperatureUnit
}

export function HourlyChart({ data, unit }: HourlyChartProps) {
  const tempSymbol = unit === "metric" ? "°C" : "°F"

  const chartConfig = {
    temp: {
      label: "Temperature",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">
          Hourly Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickFormatter={(value) => `${value}°`}
                domain={["dataMin - 2", "dataMax + 2"]}
              />
              <Tooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [`${value}${tempSymbol}`, "Temperature"]}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fill="url(#tempGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
