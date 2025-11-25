import SimpleHero from "@/components/SimpleHero";
import SimpleMenu from "@/components/SimpleMenu";
import SimpleAbout from "@/components/SimpleAbout";
import SimpleEvents from "@/components/SimpleEvents";
import SimpleContact from "@/components/SimpleContact";
import SimpleFooter from "@/components/SimpleFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <main>
        <SimpleHero />
        <SimpleMenu />
        <SimpleAbout />
        <SimpleEvents />
        <SimpleContact />
      </main>
      <SimpleFooter />
    </div>
  );
};

export default Index;