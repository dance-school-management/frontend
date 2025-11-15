import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { Award, Clock, Users, Heart, Sparkles, Star } from "lucide-react";

export function WhyChooseUsSection() {
  const benefits = [
    {
      icon: Award,
      title: "Expert Instructors",
      description: "Learn from experienced and certified dance professionals who are passionate about teaching.",
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Classes available throughout the week with various time slots to fit your busy lifestyle.",
    },
    {
      icon: Users,
      title: "All Skill Levels",
      description: "From complete beginners to advanced dancers, we have classes tailored for everyone.",
    },
    {
      icon: Heart,
      title: "Supportive Community",
      description: "Join a welcoming community of dancers who support and encourage each other's growth.",
    },
    {
      icon: Sparkles,
      title: "Diverse Styles",
      description: "Explore a wide variety of dance styles and find the one that speaks to you.",
    },
    {
      icon: Star,
      title: "Modern Facilities",
      description: "Practice in our state-of-the-art studios equipped with professional dance floors and mirrors.",
    },
  ];

  return (
    <section className="flex flex-col gap-4 px-4">
      <div className="flex flex-col gap-2 max-w-3xl">
        <h2 className="text-3xl font-bold">Why Choose Us?</h2>
        <p className="text-muted-foreground">
          Discover what makes our dance school the perfect place to start or continue your dance journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <Card key={index} className="text-center hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-2">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Icon className="size-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {benefit.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
