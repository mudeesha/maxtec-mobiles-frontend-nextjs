"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutGrid, Package, Settings, ShoppingCart, DollarSign, Zap, User, Heart, Users } from "lucide-react"
import { useEffect, useState } from "react"

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

export function Sidebar() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"))
  }, [])

  const getNavItems = (): NavItem[] => {
    switch (userRole) {
      case "admin":
        return [
          { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
          { label: "Users", href: "/admin/dashboard/users", icon: Users },
          { label: "Attribute Types", href: "/admin/dashboard/attribute-types", icon: Settings },
          { label: "Attribute Values", href: "/admin/dashboard/attribute-values", icon: Zap },
          { label: "Brands", href: "/admin/dashboard/brands", icon: Package },
          { label: "Models", href: "/admin/dashboard/models", icon: Package },
          { label: "Products", href: "/admin/dashboard/products", icon: Package },
          { label: "Product Images", href: "/admin/dashboard/product-images", icon: Package },
          { label: "Orders", href: "/admin/dashboard/orders", icon: ShoppingCart },
          { label: "Payments", href: "/admin/dashboard/payments", icon: DollarSign },
        ]
      case "staff":
        return [
          { label: "Dashboard", href: "/staff/dashboard", icon: LayoutGrid },
          { label: "Attribute Types", href: "/staff/dashboard/attribute-types", icon: Settings },
          { label: "Attribute Values", href: "/staff/dashboard/attribute-values", icon: Zap },
          { label: "Brands", href: "/staff/dashboard/brands", icon: Package },
          { label: "Models", href: "/staff/dashboard/models", icon: Package },
          { label: "Products", href: "/staff/dashboard/products", icon: Package },
          { label: "Product Images", href: "/staff/dashboard/product-images", icon: Package },
        ]
      case "customer":
        return [
          { label: "Dashboard", href: "/customer/dashboard", icon: LayoutGrid },
          { label: "Profile", href: "/customer/profile", icon: User },
          { label: "Orders", href: "/customer/orders", icon: ShoppingCart },
          { label: "Wishlist", href: "/customer/wishlist", icon: Heart },
          { label: "Payments", href: "/customer/payments", icon: DollarSign },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <aside className="w-64 border-r border-border bg-card h-screen overflow-y-auto sticky top-0">
      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
