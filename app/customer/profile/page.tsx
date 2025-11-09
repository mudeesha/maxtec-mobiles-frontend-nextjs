"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Breadcrumb } from "@/components/common/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Modal } from "@/components/common/modal"
import { Toast } from "@/components/common/toast"
import { Edit2, Save, X, Upload } from "lucide-react"

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "",
    phone: "+1 (555) 123-4567",
    country: "United States",
    state: "California",
    city: "San Francisco",
    address: "123 Main St",
    zip: "94105",
  })

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Load data from localStorage after component mounts
    const savedProfile = localStorage.getItem("customerProfile")
    const savedImage = localStorage.getItem("customerProfileImage")
    const userEmail = localStorage.getItem("userEmail")

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    } else if (userEmail) {
      // If no saved profile but we have user email, update the email field
      setProfile(prev => ({
        ...prev,
        email: userEmail
      }))
    }

    if (savedImage) {
      setProfileImage(savedImage)
    }
  }, [])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageData = event.target?.result as string
        setProfileImage(imageData)
        localStorage.setItem("customerProfileImage", imageData)
        setToast({ message: "Profile image updated!", type: "success" })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = () => {
    if (!profile.firstName.trim() || !profile.lastName.trim()) {
      setToast({ message: "First and last name are required!", type: "error" })
      return
    }

    localStorage.setItem("customerProfile", JSON.stringify(profile))
    setToast({ message: "Profile updated successfully!", type: "success" })
    setIsEditingProfile(false)
  }

  const handleCancelEdit = () => {
    const savedProfile = localStorage.getItem("customerProfile")
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    } else {
      // Reset to default values if no saved profile
      setProfile({
        firstName: "John",
        lastName: "Doe",
        email: localStorage.getItem("userEmail") || "",
        phone: "+1 (555) 123-4567",
        country: "United States",
        state: "California",
        city: "San Francisco",
        address: "123 Main St",
        zip: "94105",
      })
    }
    setIsEditingProfile(false)
  }

  const handleChangePassword = () => {
    if (!passwordForm.current.trim()) {
      setToast({ message: "Please enter your current password!", type: "error" })
      return
    }

    if (passwordForm.new !== passwordForm.confirm) {
      setToast({ message: "Passwords do not match!", type: "error" })
      return
    }

    if (passwordForm.new.length < 6) {
      setToast({ message: "Password must be at least 6 characters!", type: "error" })
      return
    }

    setToast({ message: "Password changed successfully!", type: "success" })
    setPasswordForm({ current: "", new: "", confirm: "" })
    setIsChangingPassword(false)
  }

  // Show loading state during SSR
  if (!isMounted) {
    return (
      <DashboardLayout requiredRoles={["customer"]}>
        <div className="space-y-6">
          <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
          <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-64 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="space-y-4">
              <div className="h-48 bg-muted rounded animate-pulse"></div>
              <div className="h-32 bg-muted rounded animate-pulse"></div>
              <div className="h-40 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout requiredRoles={["customer"]}>
      <div className="space-y-6">
        <Breadcrumb items={[{ label: "Dashboard", href: "/customer/dashboard" }, { label: "Profile" }]} />

        <h1 className="text-3xl font-bold">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                {!isEditingProfile ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)} className="gap-2">
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveProfile} className="gap-2 bg-green-600 hover:bg-green-700">
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit} className="gap-2 bg-transparent">
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {/* User Information Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleProfileChange}
                        disabled={!isEditingProfile}
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleProfileChange}
                        disabled={!isEditingProfile}
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profile.email}
                        disabled
                        className="mt-1 opacity-70 text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleProfileChange}
                        disabled={!isEditingProfile}
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address" className="text-sm font-medium">
                        Address
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={profile.address}
                        onChange={handleProfileChange}
                        disabled={!isEditingProfile}
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city" className="text-sm font-medium">
                        City
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={profile.city}
                        onChange={handleProfileChange}
                        disabled={!isEditingProfile}
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-sm font-medium">
                        State
                      </Label>
                      <Input
                        id="state"
                        name="state"
                        value={profile.state}
                        onChange={handleProfileChange}
                        disabled={!isEditingProfile}
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip" className="text-sm font-medium">
                        ZIP Code
                      </Label>
                      <Input
                        id="zip"
                        name="zip"
                        value={profile.zip}
                        onChange={handleProfileChange}
                        disabled={!isEditingProfile}
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="country" className="text-sm font-medium">
                        Country
                      </Label>
                      <Input
                        id="country"
                        name="country"
                        value={profile.country}
                        onChange={handleProfileChange}
                        disabled={!isEditingProfile}
                        className="mt-1 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Profile Picture with Clickable Upload */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex flex-col items-center">
                <input
                  type="file"
                  id="profileImageInput"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="hidden"
                />
                <label htmlFor="profileImageInput" className="cursor-pointer group">
                  {profileImage ? (
                    <div className="relative">
                      <img
                        src={profileImage || "/placeholder.svg"}
                        alt={`${profile.firstName} ${profile.lastName}`}
                        className="w-24 h-24 rounded-full object-cover border-4 border-primary group-hover:opacity-75 transition-opacity"
                      />
                      <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center border-4 border-primary text-2xl font-bold group-hover:bg-secondary/80 transition-colors">
                      {profile.firstName.charAt(0)}
                      {profile.lastName.charAt(0)}
                    </div>
                  )}
                </label>
                <p className="text-xs text-muted-foreground text-center">Click to upload a new photo</p>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Security</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setIsChangingPassword(true)} className="w-full">
                  Change Password
                </Button>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Member Since</p>
                  <p className="font-semibold">January 2024</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-semibold text-green-600 dark:text-green-400">Active</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Role</p>
                  <p className="font-semibold">Customer</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Change Password Modal */}
        <Modal
          isOpen={isChangingPassword}
          onClose={() => setIsChangingPassword(false)}
          title="Change Password"
          footer={
            <>
              <Button variant="outline" onClick={() => setIsChangingPassword(false)}>
                Cancel
              </Button>
              <Button onClick={handleChangePassword}>Update Password</Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current" className="font-medium text-sm">
                Current Password
              </Label>
              <Input
                id="current"
                type="password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, current: e.target.value }))}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new" className="font-medium text-sm">
                New Password
              </Label>
              <Input
                id="new"
                type="password"
                value={passwordForm.new}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, new: e.target.value }))}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm" className="font-medium text-sm">
                Confirm Password
              </Label>
              <Input
                id="confirm"
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirm: e.target.value }))}
                className="text-sm"
              />
            </div>
          </div>
        </Modal>

        {/* Toast Notification */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </DashboardLayout>
  )
}