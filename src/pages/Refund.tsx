import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function Refund() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-20 md:pb-16">
        <div className="container-padding max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Refund Policy</h1>
          <p className="text-muted-foreground mb-6">
            This is the refund policy for Motojojo. Please review our terms regarding refunds and cancellations. (Add your refund policy here.)
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
} 