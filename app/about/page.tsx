"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, Shield, Truck, Award, Star, Users, Target } from "lucide-react"

export default function AboutPage() {
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

      {/* Hero Section - Enhanced with gradient and pattern */}
      <section className="relative overflow-hidden py-24 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-0 w-72 h-72 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 left-0 w-96 h-96 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl font-bold mb-4 text-balance">About Maxtec Mobiles</h1>
          <p className="text-xl text-muted-foreground text-balance">
            Your premier destination for premium electronics and gadgets with uncompromising quality and service
            excellence
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-20 space-y-20">
        {/* Our Story */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed">
                Founded in 2020, Maxtec Mobiles began with a simple vision: to make premium electronics accessible to
                everyone. What started as a small operation has grown into a trusted platform serving thousands of
                customers worldwide.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We carefully curate every product in our collection to ensure authenticity, reliability, and value. Our
                commitment to customer satisfaction drives everything we do.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center p-6 bg-primary/5 border-primary/20">
                <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">4.9★</div>
                <p className="text-sm text-muted-foreground">Customer Rating</p>
              </Card>
              <Card className="text-center p-6 bg-accent/5 border-accent/20">
                <Users className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-accent">50K+</div>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </Card>
              <Card className="text-center p-6 bg-green-500/5 border-green-500/20 md:col-span-2">
                <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">99.2%</div>
                <p className="text-sm text-muted-foreground">Order Fulfillment Rate</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Maxtec Mobiles?</h2>
            <p className="text-lg text-muted-foreground">We deliver more than just products—we deliver excellence</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="pt-6 text-center">
                <Zap className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2 text-lg">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">Orders ship within 24 hours with reliable tracking</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="pt-6 text-center">
                <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2 text-lg">100% Secure</h3>
                <p className="text-sm text-muted-foreground">SSL encrypted checkout with fraud protection</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="pt-6 text-center">
                <Truck className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2 text-lg">Hassle-Free Returns</h3>
                <p className="text-sm text-muted-foreground">30-day returns with free return shipping</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="pt-6 text-center">
                <Award className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2 text-lg">Authentic Guarantee</h3>
                <p className="text-sm text-muted-foreground">All products directly from official manufacturers</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 bg-gradient-to-r from-primary to-accent rounded-lg p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Excellence?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Explore our extensive collection of premium electronics and discover why thousands of customers trust Maxtec
            Mobiles
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/products">Shop Now</Link>
          </Button>
        </section>
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
