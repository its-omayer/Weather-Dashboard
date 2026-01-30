"use client"

import React from "react"

import { useState } from "react"
import { Search, MapPin, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  onSearch: (city: string) => void
  onGeolocate: () => void
  isLoading: boolean
}

export function SearchBar({ onSearch, onGeolocate, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 bg-card border-border"
        />
      </div>
      <Button type="submit" disabled={isLoading || !query.trim()}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Search"
        )}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onGeolocate}
        disabled={isLoading}
        title="Use my location"
      >
        <MapPin className="h-4 w-4" />
      </Button>
    </form>
  )
}
