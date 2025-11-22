"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Smartphone, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("https://localhost:44306/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json() // This will now work!

      if (!response.ok) {
        setError(data.message || "Invalid email or password") // data.message will contain "Invalid credentials"
        setLoading(false)
        return
      }

      // Save token + user info
      localStorage.setItem("token", data.token)
      localStorage.setItem("userRole", data.role)
      localStorage.setItem("userEmail", data.email)
      localStorage.setItem("userName", data.fullName)

      // Redirect by role
      if (data.role === "Admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/customer/dashboard")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 pt-6 px-6 flex justify-between items-center border-b border-border/20">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground hidden sm:inline">Maxtec Mobiles</span>
        </Link>
        <Link href="/auth/signup" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Sign up
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-sm">
          <div className="space-y-8">
            {/* Heading */}
            <div className="space-y-2 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">Welcome Back</h1>
              <p className="text-muted-foreground text-lg">Sign in to continue shopping</p>
            </div>

            {/* Login Card */}
            <div className="space-y-6 bg-card border border-border/30 rounded-3xl p-8 shadow-xl backdrop-blur-sm">
              {error && (
                <div className="flex gap-3 p-4 bg-destructive/10 text-destructive rounded-xl text-sm border border-destructive/20">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground block">Email</label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-12 bg-input border rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground block">Password</label>
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-12 bg-input border rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-xl"
                >
                  {loading ? "Signing in..." : "Sign In"}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Don’t have an account?{" "}
                <Link href="/auth/signup" className="text-primary font-semibold hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/20 bg-card/30 backdrop-blur relative z-10 py-6 px-6">
        <div className="max-w-7xl mx-auto text-center text-xs text-muted-foreground">
          <p>&copy; 2025 Maxtec Mobiles. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
