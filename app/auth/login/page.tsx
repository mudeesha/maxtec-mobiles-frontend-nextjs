"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, ArrowRight, Smartphone, Zap, Shield } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (email && password) {
        if (email.includes("admin")) {
          localStorage.setItem("userRole", "admin")
          router.push("/admin/dashboard")
        } else if (email.includes("staff")) {
          localStorage.setItem("userRole", "staff")
          router.push("/staff/dashboard")
        } else {
          localStorage.setItem("userRole", "customer")
          router.push("/customer/dashboard")
        }
        localStorage.setItem("userEmail", email)
      } else {
        setError("Please enter both email and password")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-6 px-6 flex justify-between items-center border-b border-border/20">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground hidden sm:inline">Maxtec Mobiles</span>
        </Link>
        <Link
          href="/auth/signup"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Create account
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-sm">
          <div className="space-y-8">
            {/* Heading */}
            <div className="space-y-2 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">Welcome</h1>
              <p className="text-muted-foreground text-lg">Sign in to your Maxtec Mobiles account</p>
            </div>

            {/* Form Card */}
            <div className="space-y-6 bg-card border border-border/30 rounded-3xl p-8 shadow-xl backdrop-blur-sm">
              {error && (
                <div className="flex gap-3 p-4 bg-destructive/10 text-destructive rounded-2xl text-sm border border-destructive/20 animate-in fade-in">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground block">Email</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground block">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all group"
                >
                  {loading ? "Signing in..." : "Sign In"}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </form>
            </div>

            {/* Demo accounts */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">
                Demo Accounts
              </p>
              <div className="grid gap-2 text-xs">
                {[
                  { role: "Admin", email: "admin@example.com", icon: Zap },
                  { role: "Staff", email: "staff@example.com", icon: Shield },
                  { role: "Customer", email: "customer@example.com", icon: Smartphone },
                ].map(({ role, email: demoEmail, icon: Icon }) => (
                  <button
                    key={role}
                    onClick={() => {
                      setEmail(demoEmail)
                      setPassword("password")
                    }}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/10 to-accent/10 border border-border/30 rounded-lg hover:border-primary/50 transition-all group"
                  >
                    <Icon className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-foreground">{role}</p>
                      <p className="text-muted-foreground text-xs">{demoEmail}</p>
                    </div>
                    <span className="text-muted-foreground group-hover:text-primary transition-colors">Fill demo</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground">
              New to Maxtec Mobiles?{" "}
              <Link href="/auth/signup" className="text-primary font-semibold hover:underline">
                Create account
              </Link>
            </p>
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
