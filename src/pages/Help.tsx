import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  HelpCircle, 
  Ticket, 
  CreditCard, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle,
  Search,
  BookOpen,
  Shield,
  Users,
  ArrowRight,
  Star
} from "lucide-react";
import { FadeIn } from "@/components/ui/motion";

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");

  const helpCategories = [
    {
      icon: <Ticket className="h-8 w-8" />,
      title: "Booking & Tickets",
      description: "Learn how to book events and manage your tickets",
      color: "from-raspberry to-raspberry/80",
      link: "#booking"
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Payment & Refunds",
      description: "Information about payment methods and refund policies",
      color: "from-sandstorm to-sandstorm/80",
      link: "#payment"
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Event Information",
      description: "Details about events, schedules, and venues",
      color: "from-violet to-violet/80",
      link: "#events"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Account & Profile",
      description: "Manage your account settings and profile",
      color: "from-raspberry/80 to-sandstorm/80",
      link: "#account"
    }
  ];

  const faqs = [
    {
      category: "booking",
      question: "How do I book an event?",
      answer: "Browse our events page, select the event you're interested in, and click the 'Book Now' or 'Add to Cart' button. Follow the checkout process to complete your booking. You'll receive a confirmation email with your ticket details."
    },
    {
      category: "booking",
      question: "Can I book multiple tickets for an event?",
      answer: "Yes, you can book multiple tickets for most events. Simply select the number of tickets you need during the booking process. Some events may have limits on the number of tickets per person."
    },
    {
      category: "booking",
      question: "How do I access my tickets?",
      answer: "After booking, you'll receive an email with your ticket details. You can also access your tickets through your account dashboard. Tickets are typically sent via email and can be presented digitally or printed."
    },
    {
      category: "payment",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, UPI, and digital wallets including Paytm, Google Pay, and PhonePe. All payments are processed securely through our trusted payment partners."
    },
    {
      category: "payment",
      question: "What is your refund policy?",
      answer: "Refunds are available up to 48 hours before the event. Please check our detailed Refund Policy page for specific terms and conditions. Event cancellations by organizers result in automatic full refunds."
    },
    {
      category: "payment",
      question: "Is my payment information secure?",
      answer: "Yes, we use industry-standard encryption and security measures to protect your payment information. We never store your complete payment details on our servers."
    },
    {
      category: "events",
      question: "What happens if an event is cancelled?",
      answer: "If an event is cancelled, you'll receive a full refund of your ticket purchase. You'll be notified via email about the cancellation and refund process. Refunds are typically processed within 5-7 business days."
    },
    {
      category: "events",
      question: "Can I transfer my ticket to someone else?",
      answer: "Ticket transfer policies vary by event. Some events allow ticket transfers up to 24 hours before the event, while others may have restrictions. Check the specific event details for transfer policies."
    },
    {
      category: "events",
      question: "What should I do if I can't attend an event?",
      answer: "If you can't attend an event, check our refund policy first. If refunds are not available, you may be able to transfer your ticket to someone else, depending on the event's transfer policy."
    },
    {
      category: "account",
      question: "How do I create an account?",
      answer: "You can create an account by clicking the 'Sign Up' button in the navigation. You'll need to provide your email address and create a password. You can also sign up using your Google or Facebook account."
    },
    {
      category: "account",
      question: "How do I update my profile information?",
      answer: "Log into your account and go to the Profile section. You can update your personal information, contact details, and preferences at any time."
    },
    {
      category: "account",
      question: "I forgot my password. How do I reset it?",
      answer: "Click on the 'Forgot Password' link on the sign-in page. Enter your email address and we'll send you a link to reset your password."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const contactInfo = [
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Phone Support",
      value: "88288 81117",
      link: "tel:+918828881117",
      description: "Available Mon-Fri, 9 AM - 6 PM"
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "Email Support",
      value: "support@motojojo.com",
      link: "mailto:support@motojojo.com",
      description: "We'll respond within 24 hours"
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: "Live Chat",
      value: "Chat with us",
      link: "#",
      description: "Available during business hours"
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Office Address",
      value: "Motojojo House, Chembur, Mumbai",
      link: "#",
      description: "Visit us for in-person support"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-24 pb-20 md:pb-16">
        <div className="container-padding">
          {/* Hero Section */}
          <FadeIn>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <HelpCircle className="h-12 w-12 text-sandstorm mr-3" />
                <h1 className="section-title-jolly">Help & Support Center</h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                Find answers to your questions, get help with bookings, and learn everything you need to know about Motojojo events.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search for help topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-sandstorm focus:border-transparent"
                />
              </div>
            </div>
          </FadeIn>

          {/* Help Categories */}
          <FadeIn delay={200}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {helpCategories.map((category, index) => (
                <Card key={index} className="hover-scale cursor-pointer border-2 border-transparent hover:border-sandstorm/20 transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center text-white`}>
                      {category.icon}
                    </div>
                    <CardTitle className="text-lg font-semibold">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
                    <Button variant="ghost" size="sm" className="text-sandstorm hover:text-sandstorm/80">
                      Learn More <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </FadeIn>

          {/* FAQ Section */}
          <FadeIn delay={400}>
            <div className="mb-16">
              <div className="text-center mb-8">
                <h2 className="section-title">Frequently Asked Questions</h2>
                <p className="text-muted-foreground">
                  {searchQuery ? `Showing ${filteredFaqs.length} results for "${searchQuery}"` : "Find answers to common questions"}
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border border-border/50 rounded-lg mb-4">
                      <AccordionTrigger className="text-left font-medium px-6 py-4 hover:text-sandstorm">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground px-6 pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                
                {filteredFaqs.length === 0 && searchQuery && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchQuery("")}
                      className="mt-4"
                    >
                      Clear Search
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>

          <Separator className="bg-border/20 my-12" />

          {/* Contact Section */}
          <FadeIn delay={600}>
            <div className="mb-16">
              <div className="text-center mb-8">
                <h2 className="section-title">Still Need Help?</h2>
                <p className="text-muted-foreground">
                  Our support team is here to help you with any questions or concerns.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {contactInfo.map((contact, index) => (
                  <Card key={index} className="text-center hover-scale">
                    <CardHeader className="pb-4">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-sandstorm to-raspberry flex items-center justify-center text-white">
                        {contact.icon}
                      </div>
                      <CardTitle className="text-base font-semibold">{contact.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <a 
                        href={contact.link} 
                        className="text-sandstorm hover:text-sandstorm/80 font-medium block mb-2"
                      >
                        {contact.value}
                      </a>
                      <p className="text-muted-foreground text-sm">{contact.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Additional Resources */}
          <FadeIn delay={800}>
            <div className="bg-card/50 rounded-2xl p-8 border border-border/20">
              <div className="text-center mb-8">
                <h2 className="section-title">Additional Resources</h2>
                <p className="text-muted-foreground">
                  Explore these helpful resources to get the most out of Motojojo.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/terms" className="group">
                  <Card className="hover-scale border-2 border-transparent group-hover:border-sandstorm/20 transition-all duration-300">
                    <CardHeader className="text-center">
                      <Shield className="h-8 w-8 mx-auto mb-2 text-sandstorm" />
                      <CardTitle className="text-base">Terms of Service</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-muted-foreground text-sm">Read our terms and conditions</p>
                    </CardContent>
                  </Card>
                </Link>

                <Link to="/privacy" className="group">
                  <Card className="hover-scale border-2 border-transparent group-hover:border-sandstorm/20 transition-all duration-300">
                    <CardHeader className="text-center">
                      <Shield className="h-8 w-8 mx-auto mb-2 text-sandstorm" />
                      <CardTitle className="text-base">Privacy Policy</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-muted-foreground text-sm">Learn about data protection</p>
                    </CardContent>
                  </Card>
                </Link>

                <Link to="/refund" className="group">
                  <Card className="hover-scale border-2 border-transparent group-hover:border-sandstorm/20 transition-all duration-300">
                    <CardHeader className="text-center">
                      <CreditCard className="h-8 w-8 mx-auto mb-2 text-sandstorm" />
                      <CardTitle className="text-base">Refund Policy</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-muted-foreground text-sm">Understand our refund terms</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </FadeIn>

          {/* Feedback Section */}
          <FadeIn delay={1000}>
            <div className="text-center mt-16 p-8 bg-gradient-to-r from-raspberry/10 to-sandstorm/10 rounded-2xl border border-raspberry/20">
              <Star className="h-12 w-12 text-sandstorm mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Was this helpful?</h3>
              <p className="text-muted-foreground mb-6">
                Help us improve our help center by providing feedback.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" className="hover:bg-sandstorm hover:text-violet">
                  Yes, it helped
                </Button>
                <Button variant="outline" className="hover:bg-raspberry hover:text-white">
                  No, I need more help
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </div>
  );
} 