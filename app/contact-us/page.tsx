"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setFormData({ name: "", email: "", subject: "", message: "" })
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-primary">
            Maxtec Mobiles
          </Link>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/products">Shop</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-0 w-72 h-72 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 left-0 w-96 h-96 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl font-bold mb-4 text-balance">Get in Touch</h1>
          <p className="text-xl text-muted-foreground text-balance">
            Have a question? We're here to help and would love to hear from you.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Info Cards */}
          <Card className="hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex gap-4 items-start">
                <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1 text-lg">Email</h3>
                  <p className="text-sm text-muted-foreground">op.openterprises@gmail.com</p>
                  <p className="text-xs text-muted-foreground mt-1">Response within 24 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex gap-4 items-start">
                <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1 text-lg">Phone</h3>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  <p className="text-xs text-muted-foreground mt-1">Mon-Fri, 9am-6pm EST</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex gap-4 items-start">
                <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1 text-lg">Address</h3>
                  <p className="text-sm text-muted-foreground">123 Tech Street</p>
                  <p className="text-sm text-muted-foreground">San Francisco, CA 94105</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left side - More info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">We're Here to Help</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Have questions about our products, shipping, returns, or anything else? Reach out to our friendly
                support team and we'll get back to you as soon as possible.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Response Time</p>
                  <p className="text-sm text-muted-foreground">Usually within 24 hours</p>
                </div>
              </div>
              <div className="flex gap-3">
                <MessageSquare className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Multiple Channels</p>
                  <p className="text-sm text-muted-foreground">Email, phone, and contact form support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <Card className="hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="text-2xl">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-center">
                  <p className="font-semibold mb-1">Thank you for reaching out!</p>
                  <p className="text-sm">We'll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      placeholder="you@example.com"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      placeholder="How can we help?"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-sm font-medium">
                      Message
                    </Label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      placeholder="Tell us more..."
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-lg resize-none bg-background text-foreground"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/products" className="hover:text-foreground transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-foreground transition-colors">
                    Featured
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact-us" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Maxtec Mobiles. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
