import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  avatar: string;
  date: string;
}

const reviews: Review[] = [
  {
    id: "1",
    name: "Sarah Chen",
    location: "San Francisco, CA",
    rating: 5,
    review: "Dr. Vital created the perfect energy blend for my morning routine. I've never felt more focused and energized throughout the day!",
    avatar: "👩‍💼",
    date: "2 weeks ago"
  },
  {
    id: "2", 
    name: "Marcus Rodriguez",
    location: "Austin, TX",
    rating: 5,
    review: "The AI recommendations are spot-on! My immune system has never been stronger since starting the custom blends.",
    avatar: "👨‍💻",
    date: "1 month ago"
  },
  {
    id: "3",
    name: "Emily Johnson",
    location: "New York, NY", 
    rating: 5,
    review: "Amazing personalization! The green juice blend helped me through my detox journey. Tastes incredible too!",
    avatar: "👩‍🎨",
    date: "3 weeks ago"
  },
  {
    id: "4",
    name: "David Kim",
    location: "Seattle, WA",
    rating: 5,
    review: "As a busy entrepreneur, NeuroJuice keeps me sharp and healthy. The Brain Boost blend is my secret weapon!",
    avatar: "👨‍🚀",
    date: "1 week ago"
  },
  {
    id: "5",
    name: "Lisa Thompson",
    location: "Miami, FL",
    rating: 5,
    review: "The tropical blends transport me to paradise while giving me sustained energy. Love the personalized approach!",
    avatar: "👩‍🏫",
    date: "4 days ago"
  }
];

const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
    setIsAutoPlaying(false);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    setIsAutoPlaying(false);
  };

  const goToReview = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-primary text-primary" : "text-muted-foreground"
        }`}
      />
    ));
  };

  return (
    <section id="reviews" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-foreground">
            Loved by Our Community
          </h2>
          <p className="font-body text-lg text-muted-foreground">
            Real stories from real people who've transformed their wellness journey with NeuroJuice.
          </p>
        </div>

        {/* Reviews Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {reviews.map((review) => (
                <div key={review.id} className="w-full flex-shrink-0 px-4">
                  <Card className="shadow-card hover:shadow-soft transition-shadow duration-300">
                    <CardContent className="p-8 text-center space-y-6">
                      {/* Avatar */}
                      <div className="w-16 h-16 mx-auto bg-gradient-hero rounded-full flex items-center justify-center text-2xl">
                        {review.avatar}
                      </div>

                      {/* Stars */}
                      <div className="flex justify-center space-x-1">
                        {renderStars(review.rating)}
                      </div>

                      {/* Review Text */}
                      <blockquote className="font-body text-lg text-foreground leading-relaxed italic">
                        "{review.review}"
                      </blockquote>

                      {/* Reviewer Info */}
                      <div className="space-y-1">
                        <h4 className="font-heading font-semibold text-foreground">{review.name}</h4>
                        <p className="font-body text-sm text-muted-foreground">{review.location}</p>
                        <p className="font-body text-xs text-muted-foreground">{review.date}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            onClick={prevReview}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-background shadow-soft hover:shadow-button"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextReview}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-background shadow-soft hover:shadow-button"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToReview(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-primary scale-125" 
                    : "bg-muted-foreground hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <div className="font-heading font-bold text-3xl text-primary">10,000+</div>
            <div className="font-body text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center space-y-2">
            <div className="font-heading font-bold text-3xl text-primary">4.9/5</div>
            <div className="font-body text-muted-foreground">Average Rating</div>
          </div>
          <div className="text-center space-y-2">
            <div className="font-heading font-bold text-3xl text-primary">50K+</div>
            <div className="font-body text-muted-foreground">Custom Blends Created</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;