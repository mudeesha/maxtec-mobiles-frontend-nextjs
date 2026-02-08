import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t-2 border-border">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                Maxtec Mobiles
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your trusted platform for premium mobile devices and electronics with secure checkout and fast delivery.
              </p>
            </div>

            {/* Contact info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a href="mailto:op.openterprises@gmail.com">op.openterprises@gmail.com</a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="h-4 w-4 text-accent flex-shrink-0" />
                <a href="tel:+1234567890">+94 77 898 1581</a>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>
                  84/7 Kahawa Batapola Road, 
                  <br />
                  Nindana, Ambalangoda, 80318
                </span>
              </div>
            </div>
          </div>

          {/* Shop section */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Featured
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Best Sellers
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Deals & Sales
                </a>
              </li>
            </ul>
          </div>

          {/* Company section */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Support section */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">Support</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Track Order
                </a>
              </li>
            </ul>
          </div>

          {/* Legal section */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wide">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Sitemap
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8 mb-8"></div>

        {/* Bottom section with social links and copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Copyright and legal links */}
          <div className="text-sm text-muted-foreground text-center md:text-left">
            <p className="mb-2">&copy; {currentYear} Maxtec Mobiles. All rights reserved.</p>
            <div className="flex gap-6 flex-wrap justify-center md:justify-start text-xs">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Cookie Settings
              </a>
            </div>
          </div>

          {/* Social media links */}
          <div className="flex gap-4">
            <a
              href="#"
              className="h-10 w-10 rounded-lg bg-secondary hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center text-muted-foreground hover:scale-110 border border-border hover:border-primary/30"
              title="Facebook"
              aria-label="Follow us on Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="h-10 w-10 rounded-lg bg-secondary hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center text-muted-foreground hover:scale-110 border border-border hover:border-primary/30"
              title="Twitter"
              aria-label="Follow us on Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="h-10 w-10 rounded-lg bg-secondary hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center text-muted-foreground hover:scale-110 border border-border hover:border-primary/30"
              title="Instagram"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="h-10 w-10 rounded-lg bg-secondary hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center text-muted-foreground hover:scale-110 border border-border hover:border-primary/30"
              title="LinkedIn"
              aria-label="Follow us on LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="h-10 w-10 rounded-lg bg-secondary hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center text-muted-foreground hover:scale-110 border border-border hover:border-primary/30"
              title="YouTube"
              aria-label="Subscribe to our YouTube channel"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
