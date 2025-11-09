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
    if (!userRole) {
      router.push("/auth/login")
    } else if (requiredRoles && !requiredRoles.includes(userRole)) {
      router.push("/auth/login")
    } else {
      setIsAuthorized(true)
    }
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
