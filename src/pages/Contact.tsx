import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-20 md:pb-16">
        <div className="container-padding max-w-lg mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Contact Us</h1>
          <div className="bg-yellow-200/80 rounded-xl shadow-lg p-8">
            <form className="space-y-6" action="https://formsubmit.co/info@motojojo.co" method="POST">
              <input type="hidden" name="_captcha" value="false" />
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <textarea id="message" name="message" value={form.message} onChange={handleChange} required className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
              </div>
              <Button type="submit" className="bg-violet text-white">Send Message</Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 