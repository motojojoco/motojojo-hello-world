import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function Help() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-20 md:pb-16">
        <div className="container-padding max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Help & FAQ</h1>
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">How do I book an event?</h2>
              <p className="text-muted-foreground">Browse our events, select the one you're interested in, and click the 'Book Now' or 'Add to Cart' button. Follow the checkout process to complete your booking.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Can I get a refund?</h2>
              <p className="text-muted-foreground">Refunds are available up to 48 hours before the event. Please check our Refund Policy for more details.</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">How do I contact support?</h2>
              <p className="text-muted-foreground">You can reach us via the Contact Us page or email us at info@motojojo.com.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 