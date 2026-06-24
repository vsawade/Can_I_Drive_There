"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [key, setKey] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const configError = searchParams.get("error") === "not-configured"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Login failed")
        return
      }

      router.push("/admin/reports")
      router.refresh()
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Lock className="h-5 w-5 text-primary" />
        </div>
        <CardTitle>Admin login</CardTitle>
        <CardDescription>Enter your admin API key to manage reports</CardDescription>
      </CardHeader>
      <CardContent>
        {configError && (
          <p className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            Admin access is not configured. Set ADMIN_API_KEY in your environment.
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-key">Admin key</Label>
            <Input
              id="admin-key"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Your ADMIN_API_KEY"
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
