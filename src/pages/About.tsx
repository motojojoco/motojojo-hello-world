import PageLayout from "@/components/layout/PageLayout";

export default function About() {
  return (
    <PageLayout>
      <div className="container-padding max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">About Us</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Motojojo is India's premier platform for discovering and booking curated entertainment events. We bring together unique experiences, talented artists, and vibrant communities to create unforgettable memories. Whether you're looking for music, art, workshops, or local gatherings, Motojojo is your go-to destination for all things events.
        </p>
      </div>
    </PageLayout>
  );
}