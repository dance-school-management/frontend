import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { Card, CardContent } from "@repo/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Anna Kowalska",
    role: "Adult Student",
    content: "I've been dancing here for two years and it's been an incredible journey. The instructors are patient, knowledgeable, and truly care about your progress. I've made so many friends and found a new passion!",
    rating: 5,
  },
  {
    name: "Michał Nowak",
    role: "Teen Student",
    content: "The best dance school in the city! The classes are fun, challenging, and the atmosphere is amazing. I've improved so much since joining, and I look forward to every class.",
    rating: 5,
  },
  {
    name: "Katarzyna Wiśniewska",
    role: "Parent",
    content: "My daughter has been attending classes here for a year and absolutely loves it. The instructors are wonderful with kids, and I can see her confidence growing with each class. Highly recommended!",
    rating: 5,
  },
  {
    name: "Piotr Zieliński",
    role: "Beginner Student",
    content: "I was nervous about starting dance classes at 35, but everyone here made me feel so welcome! The beginner-friendly approach and supportive community helped me overcome my initial hesitation. Now I can't imagine my week without these classes.",
    rating: 5,
  },
  {
    name: "Aleksandra Dąbrowska",
    role: "Adult Student",
    content: "I came here to learn salsa for my wedding, and ended up falling in love with ballroom dancing! The instructors are incredibly skilled at breaking down complex moves. My fiancé and I are now regular students and we're so excited to show off our moves at our wedding!",
    rating: 5,
  },
  {
    name: "Ewa Król",
    role: "Senior Student",
    content: "At 62, I thought it was too late to start dancing. How wrong I was! The instructors here are so encouraging and adapt everything to different fitness levels. Dancing has become my favorite form of exercise and social activity. Age is truly just a number here!",
    rating: 5,
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function TestimonialsSection() {
  return (
    <section className="flex flex-col gap-4 px-4">
      <div className="flex flex-col gap-2 max-w-3xl">
        <h2 className="text-3xl font-bold">
          What Our Students Say
        </h2>
        <p className="text-muted-foreground">
          Hear from our students about their experiences at our dance school
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 mt-4">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} />
        ))}
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0]; }) {
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.name}`} alt={testimonial.name} />
            <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-semibold leading-none">
              {testimonial.name}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {testimonial.role}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <CardContent className="p-0">
          <p className="text-sm text-foreground">
            {testimonial.content}
          </p>
        </CardContent>
      </div>
    </Card>
  );
}
