import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, User, Menu, X, ShoppingCart, Ticket, Home, Calendar, Heart, Settings } from "lucide-react";
import { cities } from "@/data/mockData";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { useAuth } from "@/hooks/use-auth";
import { useCartStore } from "@/store/cart-store";

const Navbar = () => {
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = useCartStore(state => state.getTotalItems());

  // Detect location and set city (mock implementation)
  const detectLocation = () => {
    // In a real app, this would use the Geolocation API
    setTimeout(() => {
      setSelectedCity("Mumbai");
    }, 500);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize location detection
  useEffect(() => {
    detectLocation();
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Top Header - Simplified for mobile */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-background/95 backdrop-blur-sm shadow-md py-2" 
            : "bg-transparent py-4"
        }`}
      >
        <div className="container-padding flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-gradient">Motojojo</h1>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search events, artists, venues..."
                className="pl-10 bg-muted/30 border-none focus-visible:ring-violet hover:bg-muted/50 transition-colors"
              />
            </div>

            {/* City Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-red" />
                  {selectedCity}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {cities.map((city) => (
                  <DropdownMenuItem 
                    key={city.id}
                    onClick={() => setSelectedCity(city.name)}
                  >
                    {city.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart Button */}
            {isSignedIn && (
              <Button 
                variant="outline" 
                className="relative"
                onClick={() => navigate("/cart")}
              >
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            )}

            {/* Premium Button */}
            <Button className="bg-gradient-to-r from-violet to-red hover:opacity-90 transition-opacity">
              Explore Premium
            </Button>

            {/* Auth Buttons */}
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <Button variant="outline">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>Sign Up</Button>
                </SignUpButton>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/profile?tab=bookings")}
                  className="flex items-center gap-2"
                >
                  <Ticket className="h-4 w-4" />
                  My Bookings
                </Button>
                <UserButton afterSignOutUrl="/" />
              </>
            )}

            {/* Admin */}
            <Button variant="ghost" asChild>
              <Link to="/admin">
                <User className="h-4 w-4 mr-2" />
                Admin
              </Link>
            </Button>
          </div>
          
          {/* Mobile Search and Menu */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Search Button */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Mobile Menu Trigger */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search and Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-sm p-4 shadow-md border-t">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search events, artists, venues..."
                  className="pl-10 bg-muted/30 border-none focus-visible:ring-violet hover:bg-muted/50 transition-colors"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-red" />
                      {selectedCity}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-full">
                  {cities.map((city) => (
                    <DropdownMenuItem 
                      key={city.id}
                      onClick={() => setSelectedCity(city.name)}
                    >
                      {city.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Cart Button (Mobile) */}
              {isSignedIn && (
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-between"
                  onClick={() => navigate("/cart")}
                >
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Cart
                  </div>
                  {totalItems > 0 && (
                    <Badge>
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              )}
              
              <Button className="bg-gradient-to-r from-violet to-red hover:opacity-90 transition-opacity w-full">
                Explore Premium
              </Button>
              
              {!isSignedIn ? (
                <>
                  <SignInButton mode="modal">
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="w-full">Sign Up</Button>
                  </SignUpButton>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/profile")}>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/profile?tab=bookings")}>
                    <Ticket className="h-4 w-4 mr-2" />
                    My Bookings
                  </Button>
                  <div className="flex justify-center py-2">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </>
              )}
              
              <Button variant="ghost" className="w-full" asChild>
                <Link to="/admin">
                  <User className="h-4 w-4 mr-2" />
                  Admin
                </Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg">
        <div className="flex items-center justify-around py-2">
          {/* Home */}
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
              location.pathname === "/" ? "text-violet" : "text-muted-foreground"
            }`}
            onClick={() => navigate("/")}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Button>

          {/* Events */}
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
              location.pathname === "/events" ? "text-violet" : "text-muted-foreground"
            }`}
            onClick={() => navigate("/events")}
          >
            <Calendar className="h-5 w-5" />
            <span className="text-xs">Events</span>
          </Button>

          {/* My Bookings */}
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
              location.pathname === "/profile" && location.search.includes("tab=bookings") ? "text-violet" : "text-muted-foreground"
            }`}
            onClick={() => navigate("/profile?tab=bookings")}
          >
            <Ticket className="h-5 w-5" />
            <span className="text-xs">Bookings</span>
          </Button>

          {/* Profile */}
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
              location.pathname === "/profile" && !location.search.includes("tab=bookings") ? "text-violet" : "text-muted-foreground"
            }`}
            onClick={() => navigate("/profile")}
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Button>

          {/* Premium */}
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3"
            onClick={() => navigate("/explorepremium")}
          >
            <Heart className="h-5 w-5 text-raspberry" />
            <span className="text-xs text-raspberry">Premium</span>
          </Button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
