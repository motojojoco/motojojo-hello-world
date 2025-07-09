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
import { MapPin, Search, User, Menu, X, ShoppingCart, Ticket, Home, Calendar, Heart, Settings, MessageSquare, History, LogOut } from "lucide-react";
import { cities } from "@/data/mockData";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useCartStore } from "@/store/cart-store";

type NavbarProps = {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
};

const Navbar = ({ selectedCity, setSelectedCity }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [inviteError, setInviteError] = useState<string | null>(null);
  const { isSignedIn, isAdmin, signIn, signUp, signOut, inviteUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = useCartStore(state => state.getTotalItems());
  const [searchValue, setSearchValue] = useState("");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await useAuth().signOut();
    navigate("/");
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteStatus('loading');
    setInviteError(null);
    const { error } = await inviteUser(inviteEmail, 'user');
    if (error) {
      setInviteStatus('error');
      setInviteError(error.message);
    } else {
      setInviteStatus('success');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const keyword = searchValue.trim().toLowerCase();
    const cityMatch = cities.find(city => city.name.toLowerCase() === keyword);
    if (cityMatch) {
      navigate(`/events?city=${encodeURIComponent(cityMatch.name)}`);
    } else if (keyword) {
      navigate(`/events?search=${encodeURIComponent(searchValue)}`);
    }
    setSearchValue("");
  };

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
        {/* Responsive container with max width and horizontal centering */}
        <div className="w-full max-w-screen-2xl mx-auto flex items-center justify-between px-2 md:px-6 lg:px-8">
          {/* Logo - responsive and doesn't push nav items out */}
          <Link to="/" className="flex items-center flex-shrink-0 m-0 p-0 min-w-0">
            <img src="/motojojo.png" alt="Motojojo Logo" className="h-16 w-16 md:h-24 md:w-24 lg:h-28 lg:w-28 max-w-none m-0 p-0" />
          </Link>

          {/* Desktop Nav Items - wrap and space items, allow shrinking */}
          <div className="hidden md:flex flex-wrap items-center gap-3 min-w-0 flex-1 justify-end">
            {/* Search Bar */}
            <form className="relative w-64 min-w-0" onSubmit={handleSearch}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search events, artists, venues..."
                className="pl-10 bg-muted/30 border-none focus-visible:ring-violet hover:bg-muted/50 transition-colors min-w-0 truncate"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
              />
            </form>

            {/* City Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1 min-w-0 truncate">
                  <MapPin className="h-4 w-4 text-red" />
                  <span className="truncate max-w-[7rem]">{selectedCity}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 max-w-xs">
                {cities.map((city) => (
                  <DropdownMenuItem 
                    key={city.id}
                    onClick={() => setSelectedCity(city.name)}
                  >
                    <span className="truncate max-w-[8rem]">{city.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart Button */}
            {isSignedIn && (
              <Button 
                variant="outline" 
                className="relative min-w-0"
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
            <Button className="bg-gradient-to-r from-violet to-red hover:opacity-90 transition-opacity min-w-0 truncate" onClick={() => navigate("/membership")}>Membership</Button>

            {/* Events Navigation */}
            <Button variant="ghost" asChild className="min-w-0 truncate">
              <Link to="/events" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="truncate">Events</span>
              </Link>
            </Button>

            <Button variant="ghost" asChild className="min-w-0 truncate">
              <Link to="/previousevents" className="flex items-center">
                <History className="h-4 w-4 mr-2" />
                <span className="truncate">Past Events</span>
              </Link>
            </Button>

            {/* Auth Buttons */}
            {!isSignedIn ? (
              <>
                <Button variant="outline" onClick={() => navigate('/auth')} className="min-w-0 truncate">Sign In</Button>
                <Button onClick={() => navigate('/auth')} className="min-w-0 truncate">Sign Up</Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 min-w-0 truncate"
                >
                  <User className="h-4 w-4" />
                  <span className="truncate">Profile</span>
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/profile?tab=bookings")}
                  className="flex items-center gap-2 min-w-0 truncate"
                >
                  <Ticket className="h-4 w-4" />
                  <span className="truncate">My Bookings</span>
                </Button>
                {!isAdmin && (
                  <Button variant="ghost" onClick={() => { setShowInviteModal(true); setInviteStatus('idle'); setInviteEmail(''); setInviteError(null); }} className="min-w-0 truncate">Invite Friends</Button>
                )}
                <Button variant="ghost" onClick={handleSignOut} className="min-w-0 truncate"><LogOut className="h-4 w-4 mr-2" /><span className="truncate">Sign Out</span></Button>
              </>
            )}

            {/* Feedback */}
            <Button variant="ghost" asChild className="min-w-0 truncate">
              <Link to="/feedback" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="truncate">Feedback</span>
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
              {/* Mobile Search Bar */}
              <form className="relative" onSubmit={handleSearch}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search events, artists, venues..."
                  className="pl-10 bg-muted/30 border-none focus-visible:ring-violet hover:bg-muted/50 transition-colors"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                />
              </form>
              
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
              
              <Button className="bg-gradient-to-r from-violet to-red hover:opacity-90 transition-opacity w-full" onClick={() => navigate("/membership")}>
                Membership
              </Button>
              
              <Button variant="ghost" className="w-full" asChild>
                <Link to="/events">
                  <Calendar className="h-4 w-4 mr-2" />
                  Events
                </Link>
              </Button>

              <Button variant="ghost" className="w-full" asChild>
                <Link to="/previousevents">
                  <History className="h-4 w-4 mr-2" />
                  Past Events
                </Link>
              </Button>

              {!isSignedIn ? (
                <>
                  <Button variant="outline" onClick={() => navigate('/auth')} className="w-full">Sign In</Button>
                  <Button onClick={() => navigate('/auth')} className="w-full">Sign Up</Button>
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
                  {!isAdmin && (
                    <Button variant="ghost" className="w-full justify-start" onClick={() => { setShowInviteModal(true); setInviteStatus('idle'); setInviteEmail(''); setInviteError(null); }}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Invite Friends
                    </Button>
                  )}
                  <Button variant="ghost" className="w-full justify-center" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              )}
              
              <Button variant="ghost" className="w-full" asChild>
                <Link to="/feedback">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Feedback
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
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-full transition-all duration-200 relative ${
              location.pathname === "/" 
                ? "text-violet bg-yellow-300/30 shadow-md" 
                : "text-muted-foreground"
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
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-full transition-all duration-200 relative ${
              location.pathname === "/events" 
                ? "text-violet bg-yellow-300/30 shadow-md" 
                : "text-muted-foreground"
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
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-full transition-all duration-200 relative ${
              location.pathname === "/profile" && location.search.includes("tab=bookings")
                ? "text-violet bg-yellow-300/30 shadow-md" 
                : "text-muted-foreground"
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
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-full transition-all duration-200 relative ${
              location.pathname === "/profile" && !location.search.includes("tab=bookings")
                ? "text-violet bg-yellow-300/30 shadow-md" 
                : "text-muted-foreground"
            }`}
            onClick={() => navigate("/profile")}
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Button>

          {/* Membership (was Premium) */}
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-full transition-all duration-200 relative ${
              location.pathname === "/membership"
                ? "text-violet bg-yellow-300/30 shadow-md"
                : "text-white"
            }`}
            onClick={() => navigate("/membership")}
          >
            <Heart className="h-5 w-5" />
            <span className="text-xs">Membership</span>
          </Button>
        </div>
      </nav>

      {/* Invite Friends Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Invite a Friend</h2>
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="invite_email">Friend's Email</label>
                <Input
                  id="invite_email"
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  required
                  autoFocus
                  disabled={inviteStatus === 'loading' || inviteStatus === 'success'}
                />
              </div>
              {inviteStatus === 'error' && inviteError && <div className="text-red-600 text-sm">{inviteError}</div>}
              {inviteStatus === 'success' && <div className="text-green-600 text-sm">Invite sent! Your friend will receive an email.</div>}
              <Button type="submit" className="w-full" disabled={inviteStatus === 'loading' || inviteStatus === 'success'}>
                {inviteStatus === 'loading' ? 'Sending...' : 'Send Invite'}
              </Button>
            </form>
            <Button onClick={() => setShowInviteModal(false)} variant="ghost" className="w-full mt-2">Close</Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
