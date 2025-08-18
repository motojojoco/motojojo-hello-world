import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageLayout({ children, className = "" }: PageLayoutProps) {
  const [selectedCity, setSelectedCity] = useState("Mumbai");

  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      <Navbar selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
      <main className="flex-grow pt-24 pb-20 md:pb-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}