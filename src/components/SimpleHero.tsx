import { Button } from "@/components/ui/button";

const SimpleHero = () => {
  const scrollToMenu = () => {
    const element = document.querySelector("#menu");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl text-foreground leading-tight">
          Fresh Fruit. Real Energy. NeuroJuice.
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Small-batch wellness drinks made with pineapple, apple, lemon, ginger, and more.
        </p>

        <div className="pt-4">
          <Button 
            onClick={scrollToMenu}
            className="bg-primary hover:bg-primary-glow text-primary-foreground px-8 py-6 text-lg rounded-lg shadow-card"
          >
            View Menu
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SimpleHero;
