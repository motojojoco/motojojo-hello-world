
import { Link } from "react-router-dom";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  ArrowUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-muted/10 pt-16 pb-8">
      <div className="container-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div>
            <h2 className="text-2xl font-bold text-gradient mb-4">Motojojo</h2>
            <p className="text-muted-foreground mb-6">
              India's premier platform for discovering and booking curated entertainment events.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-muted-foreground hover:text-violet transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="text-muted-foreground hover:text-violet transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" className="text-muted-foreground hover:text-violet transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" className="text-muted-foreground hover:text-violet transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/events" className="text-muted-foreground hover:text-violet transition-colors">
                  All Events
                </Link>
              </li>
              <li>
                <Link to="/experiences" className="text-muted-foreground hover:text-violet transition-colors">
                  Experiences
                </Link>
              </li>
              <li>
                <Link to="/artists" className="text-muted-foreground hover:text-violet transition-colors">
                  Artists
                </Link>
              </li>
              <li>
                <Link to="/premium" className="text-muted-foreground hover:text-violet transition-colors">
                  Premium Membership
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-violet transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-violet transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-violet transition-colors">
                  Help & FAQ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-violet transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-violet transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-muted-foreground hover:text-violet transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-violet mt-0.5" />
                <span className="text-muted-foreground">
                  123 Event Street, Mumbai, <br />Maharashtra, India - 400001
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-violet" />
                <a 
                  href="tel:+919876543210" 
                  className="text-muted-foreground hover:text-violet transition-colors"
                >
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-violet" />
                <a 
                  href="mailto:info@motojojo.com" 
                  className="text-muted-foreground hover:text-violet transition-colors"
                >
                  info@motojojo.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="bg-muted/20 my-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © 2025 Motojojo. All rights reserved.
          </p>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full"
            onClick={scrollToTop}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
