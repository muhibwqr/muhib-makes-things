import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Work } from "@/components/Work";
import { Achievements } from "@/components/Achievements";
import { Contact } from "@/components/Contact";
import { EasterEgg } from "@/components/EasterEgg";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Work />
      <Achievements />
      <Contact />
      <EasterEgg />
    </div>
  );
};

export default Index;
