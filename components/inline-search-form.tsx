"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Car, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { countries } from "@/lib/data"
import { drivePath } from "@/lib/routes"
import { usStates } from "@/lib/us-states"

interface InlineSearchFormProps {
  originCountry: string
  destinationCountry: string
  travelType: "tourist" | "business"
  stayLength: number
  originState?: string
  vehicleMode: "rental" | "own"
  driverAge?: number
  compact?: boolean
}

export function InlineSearchForm({
  originCountry,
  destinationCountry,
  travelType,
  stayLength,
  originState,
  vehicleMode,
  driverAge,
  compact = false,
}: InlineSearchFormProps) {
  const router = useRouter()
  const [origin, setOrigin] = useState(originCountry)
  const [destination, setDestination] = useState(destinationCountry)
  const [type, setType] = useState(travelType)
  const [days, setDays] = useState(String(stayLength))
  const [state, setState] = useState(originState ?? "")
  const [vehicle, setVehicle] = useState(vehicleMode)
  const [age, setAge] = useState(driverAge ? String(driverAge) : "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(
      drivePath(origin, destination, {
        days: parseInt(days, 10),
        type,
        state: origin === "US" && state ? state : undefined,
        vehicle,
        age: age ? parseInt(age, 10) : undefined,
      })
    )
  }

  return (
    <Card className={compact ? "border-dashed" : ""}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Adjust your trip details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>License country</Label>
            <Select value={origin} onValueChange={setOrigin}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Destination</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {countries.filter((c) => c.code !== origin).map((c) => (
                  <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {origin === "US" && (
            <div className="space-y-2 sm:col-span-2">
              <Label>US state (optional)</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                <SelectContent>
                  {usStates.map((s) => (
                    <SelectItem key={s.code} value={s.code}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label>Stay (days)</Label>
            <Input type="number" min={1} max={365} value={days} onChange={(e) => setDays(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Your age (optional)</Label>
            <Input type="number" min={16} max={99} placeholder="e.g. 28" value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Vehicle</Label>
            <div className="flex gap-2">
              <Button type="button" variant={vehicle === "rental" ? "default" : "outline"} className="flex-1" onClick={() => setVehicle("rental")}>
                Rental car
              </Button>
              <Button type="button" variant={vehicle === "own" ? "default" : "outline"} className="flex-1" onClick={() => setVehicle("own")}>
                Own vehicle
              </Button>
            </div>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Travel purpose</Label>
            <div className="flex gap-2">
              <Button type="button" variant={type === "tourist" ? "default" : "outline"} className="flex-1" onClick={() => setType("tourist")}>
                <Plane className="mr-2 h-4 w-4" /> Tourist
              </Button>
              <Button type="button" variant={type === "business" ? "default" : "outline"} className="flex-1" onClick={() => setType("business")}>
                <Car className="mr-2 h-4 w-4" /> Business
              </Button>
            </div>
          </div>
          <Button type="submit" className="sm:col-span-2">Update results</Button>
        </form>
      </CardContent>
    </Card>
  )
}
