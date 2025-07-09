
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
          <img src="/motojojo.png" alt="Motojojo Logo" className="h-12 w-auto" />
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
              <a href="https://wa.me/919876543210" className="text-muted-foreground hover:text-violet transition-colors" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="h-5 w-5">
                  <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.584 2.236 6.393L4 29l7.824-2.05C13.7 27.633 14.836 28 16 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.04 0-2.062-.162-3.027-.48l-.216-.07-4.65 1.22 1.24-4.53-.14-.22C7.08 18.13 6.25 16.61 6.25 15c0-5.376 4.374-9.75 9.75-9.75s9.75 4.374 9.75 9.75S21.376 25 16 25zm5.13-7.13c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.43-2.25-1.37-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.97.95-.97 2.3s.99 2.67 1.13 2.85c.14.18 1.95 2.98 4.73 4.06.66.28 1.18.45 1.58.58.66.21 1.26.18 1.73.11.53-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"/>
                </svg>
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
                  Motojojo House No. 10, Asha Nagar, Pestom Sagar Rd Number 2, Chembur, Mumbai, Maharashtra 400089
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-violet" />
                <a 
                  href="tel:+918828881117" 
                  className="text-muted-foreground hover:text-violet transition-colors"
                >
                  88288 81117
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-violet" />
                <Link 
                  to="/contact" 
                  className="text-muted-foreground hover:text-violet transition-colors"
                >
                  Contact Us
                </Link>
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
