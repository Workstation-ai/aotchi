import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Pillars } from "./components/Pillars";
import { HowItWorks } from "./components/HowItWorks";
import { Manifesto } from "./components/Manifesto";
import { WaitlistSection } from "./components/WaitlistSection";
import { Ticker } from "./components/Ticker";
import { Footer } from "./components/Footer";
import { FloatingWaitlistButton } from "./components/FloatingWaitlistButton";

export function App() {
  return (
    <div className="min-h-screen bg-background text-on-surface-0">
      <Navbar />
      <main className="pt-20 lg:pt-24 pb-32">
        <Hero />
        <Pillars />
        <HowItWorks />
        <Manifesto />
        <WaitlistSection />
      </main>
      <Footer />
      <Ticker />
      <FloatingWaitlistButton />
    </div>
  );
}