"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Search, ShoppingCart, User, LogOut, Heart, Package, Menu, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { getCart } from "@/lib/cart-store"

export function Navbar() {
  const [isDark, setIsDark] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light"
    setIsDark(theme === "dark")
    document.documentElement.classList.toggle("dark", theme === "dark")

    setUserRole(localStorage.getItem("userRole"))
    setUserEmail(localStorage.getItem("userEmail"))

    const cart = getCart()
    setCartCount(cart.items.length)

    const handleStorageChange = () => {
      const updatedCart = getCart()
      setCartCount(updatedCart.items.length)
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark"
    setIsDark(!isDark)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", !isDark)
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    
    try {
      const token = localStorage.getItem("token")
      
      // Call backend logout endpoint
      if (token) {
        const response = await fetch("https://localhost:44306/api/Auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })

        if (response.ok) {
          console.log("✅ Backend logout successful")
        } else {
          console.warn("⚠️ Backend logout failed, but continuing with frontend cleanup")
        }
      }
    } catch (error) {
      console.error("🔴 Logout API error:", error)
      // Continue with frontend logout even if backend call fails
    } finally {
      // Clear all authentication data from storage
      localStorage.removeItem("token")
      localStorage.removeItem("userRole")
      localStorage.removeItem("userEmail")
      localStorage.removeItem("userName")
      
      // Clear cart and other user-specific data
      localStorage.removeItem("cart")
      
      // Redirect to login page
      router.push("/auth/login")
      setIsLoggingOut(false)
    }
  }

  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar with logo and main actions */}
        <div className="py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            Maxtec Mobiles
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 w-full bg-card border-border rounded-lg focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle with Label */}
            <div className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="h-8 w-8 p-0 hover:bg-transparent"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4 text-primary" />}
              </Button>
              <span className="text-xs text-muted-foreground">{isDark ? "Dark" : "Light"}</span>
            </div>

            {/* Cart Icon - Only for customers */}
            {userRole === "customer" && (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="relative h-9 w-9 hover:bg-secondary/30 rounded-lg"
                title="Shopping Cart"
              >
                <Link href="/customer/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-destructive text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </Button>
            )}

            {/* User Menu or Auth Buttons */}
            {userRole ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 bg-gradient-to-r from-primary/5 to-accent/5 rounded-t-md">
                    <p className="font-semibold text-foreground text-sm">{userEmail || "User"}</p>
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">{userRole} Account</p>
                  </div>
                  <DropdownMenuSeparator className="mt-2" />

                  {userRole === "customer" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/customer/profile" className="flex items-center gap-3 cursor-pointer py-2">
                          <User className="h-4 w-4 text-primary" />
                          <span>My Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/customer/orders" className="flex items-center gap-3 cursor-pointer py-2">
                          <Package className="h-4 w-4 text-accent" />
                          <span>My Orders</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/customer/wishlist" className="flex items-center gap-3 cursor-pointer py-2">
                          <Heart className="h-4 w-4 text-destructive" />
                          <span>Wishlist</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator className="mb-1" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-3 cursor-pointer text-destructive py-2 hover:bg-destructive/10 focus:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoggingOut ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                    <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hidden sm:flex text-sm font-medium hover:bg-secondary/30"
                >
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="rounded-lg bg-gradient-to-r from-primary to-accent hover:shadow-md transition-all text-sm font-medium"
                >
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu toggle - Hidden on larger screens */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden h-9 w-9 rounded-lg hover:bg-secondary/30"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile search bar - Shown on mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-3 border-t border-border/50">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 w-full bg-card border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Mobile theme toggle */}
            {!userRole && (
              <div className="mt-3 flex gap-2">
                <Button variant="ghost" size="sm" onClick={toggleTheme} className="flex-1 gap-2 text-sm">
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  <span>{isDark ? "Light" : "Dark"} Mode</span>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}