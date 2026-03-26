"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Car, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { countries } from "@/lib/data"

export function DrivingForm() {
  const router = useRouter()
  const [originCountry, setOriginCountry] = useState("")
  const [destinationCountry, setDestinationCountry] = useState("")
  const [travelType, setTravelType] = useState<"tourist" | "business">("tourist")
  const [stayLength, setStayLength] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!originCountry || !destinationCountry || !stayLength) return

    setIsLoading(true)
    
    const params = new URLSearchParams({
      origin: originCountry,
      destination: destinationCountry,
      type: travelType,
      days: stayLength,
    })
    
    router.push(`/results?${params.toString()}`)
  }

  const isValid = originCountry && destinationCountry && stayLength && originCountry !== destinationCountry

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Car className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Check Driving Requirements</CardTitle>
        <CardDescription>
          Find out what documents you need to legally drive in another country
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="origin">Where is your license from?</Label>
            <Select value={originCountry} onValueChange={setOriginCountry}>
              <SelectTrigger id="origin" className="w-full">
                <SelectValue placeholder="Select your license country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Where are you traveling to?</Label>
            <Select value={destinationCountry} onValueChange={setDestinationCountry}>
              <SelectTrigger id="destination" className="w-full">
                <SelectValue placeholder="Select destination country" />
              </SelectTrigger>
              <SelectContent>
                {countries.filter((c) => c.code !== originCountry).map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Purpose of travel</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={travelType === "tourist" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setTravelType("tourist")}
              >
                <Plane className="mr-2 h-4 w-4" />
                Tourist
              </Button>
              <Button
                type="button"
                variant={travelType === "business" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setTravelType("business")}
              >
                <Car className="mr-2 h-4 w-4" />
                Business
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stay">Length of stay (days)</Label>
            <Input
              id="stay"
              type="number"
              min="1"
              max="365"
              placeholder="e.g., 14"
              value={stayLength}
              onChange={(e) => setStayLength(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={!isValid || isLoading}>
            {isLoading ? "Checking..." : "Check Requirements"}
          </Button>

          {originCountry && destinationCountry && originCountry === destinationCountry && (
            <p className="text-center text-sm text-destructive">
              Origin and destination must be different countries
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
