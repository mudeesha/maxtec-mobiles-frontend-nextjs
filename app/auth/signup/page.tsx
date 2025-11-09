"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, ArrowRight, Check, Smartphone } from "lucide-react"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!formData.fullName.trim()) {
        setError("Full name is required")
        setLoading(false)
        return
      }

      if (!formData.email.includes("@")) {
        setError("Please enter a valid email address")
        setLoading(false)
        return
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters")
        setLoading(false)
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        setLoading(false)
        return
      }

      localStorage.setItem("userRole", "customer")
      localStorage.setItem("userEmail", formData.email)
      localStorage.setItem("userName", formData.fullName)
      router.push("/customer/dashboard")
    } catch (err) {
      setError("Signup failed. Please try again.")
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
          href="/auth/login"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign in
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-sm">
          <div className="space-y-8">
            {/* Heading */}
            <div className="space-y-2 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">Get Started</h1>
              <p className="text-muted-foreground text-lg">Join Maxtec Mobiles and shop premium gadgets</p>
            </div>

            {/* Form Card */}
            <div className="space-y-6 bg-card border border-border/30 rounded-3xl p-8 shadow-xl backdrop-blur-sm">
              {error && (
                <div className="flex gap-3 p-4 bg-destructive/10 text-destructive rounded-2xl text-sm border border-destructive/20 animate-in fade-in">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground block">Full Name</label>
                  <Input
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="h-12 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground block">Email</label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-12 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
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
                    className="h-12 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground block">Confirm Password</label>
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="h-12 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all group"
                >
                  {loading ? "Creating account..." : "Create Account"}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </form>

              {/* Benefits */}
              <div className="pt-6 border-t border-border/20 space-y-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Why Join Us</p>
                <div className="space-y-2 text-sm">
                  {[
                    "Free shipping on orders over $50",
                    "Exclusive member-only discounts",
                    "Earn rewards on every purchase",
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                Sign in
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
