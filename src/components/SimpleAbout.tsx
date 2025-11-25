const SimpleAbout = () => {
  return (
    <section className="py-16 px-4 bg-muted">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-6">
          About NeuroJuice
        </h2>
        <p className="text-lg text-foreground/80 leading-relaxed">
          NeuroJuice is an Atlanta-based wellness brand focused on fresh fruit juices made with 
          simple ingredients. We prepare small batches for events, deliveries, and community 
          health programs.
        </p>
      </div>
    </section>
  );
};

export default SimpleAbout;
