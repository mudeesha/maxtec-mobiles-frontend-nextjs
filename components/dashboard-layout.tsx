"use client"

import { type ReactNode, useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { useRouter } from "next/navigation"

interface DashboardLayoutProps {
  children: ReactNode
  requiredRoles?: string[]
}

export function DashboardLayout({ children, requiredRoles }: DashboardLayoutProps) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    const token = localStorage.getItem("token")
    
    console.log("🔐 Auth Check Details:")
    console.log("User Role:", userRole)
    console.log("Required Roles:", requiredRoles)
    
    if (!userRole || !token) {
      console.log("No user role or token found, redirecting to login.")
      router.push("/auth/login")
      return
    }
    
    if (requiredRoles && requiredRoles.length > 0) {
      // Case-insensitive role comparison
      const userRoleLower = userRole.toLowerCase()
      const requiredRolesLower = requiredRoles.map(role => role.toLowerCase())
      
      console.log("Case-insensitive check:")
      console.log("User Role (lower):", userRoleLower)
      console.log("Required Roles (lower):", requiredRolesLower)
      
      if (!requiredRolesLower.includes(userRoleLower)) {
        console.log(`❌ Role not authorized. User has: ${userRole}, Required:`, requiredRoles)
        router.push("/auth/login")
        return
      }
    }
    
    console.log("✅ User authorized!")
    setIsAuthorized(true)
  }, [router, requiredRoles])

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-secondary/30">
          <div className="max-w-7xl mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}