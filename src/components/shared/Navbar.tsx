
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MapPin, Search, User, Menu, X } from "lucide-react";
import { cities } from "@/data/mockData";
import { Link, useNavigate } from "react-router-dom";
import { SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { useAuth } from "@/hooks/use-auth";

const Navbar = () => {
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

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

  return (
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
              <Button variant="ghost" onClick={() => navigate("/profile")}>
                <User className="h-4 w-4 mr-2" />
                Profile
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
        
        {/* Mobile Menu Trigger */}
        <button 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-sm p-4 shadow-md">
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
                <Button variant="ghost" className="w-full" onClick={() => navigate("/profile")}>
                  <User className="h-4 w-4 mr-2" />
                  Profile
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
  );
};

export default Navbar;
