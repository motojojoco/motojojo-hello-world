import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-20 md:pb-16">
        <div className="container-padding max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-6">
            These are the terms and conditions for using Motojojo. Please read them carefully before using our platform. (Add your terms here.)
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
} 