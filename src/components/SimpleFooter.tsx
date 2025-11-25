const SimpleFooter = () => {
  return (
    <footer className="py-8 px-4 bg-foreground text-background">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-heading font-bold text-sm">N</span>
          </div>
          <span className="font-heading font-bold text-lg">NeuroJuice</span>
        </div>
        <p className="text-sm text-background/80">
          © {new Date().getFullYear()} NeuroJuice LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default SimpleFooter;
