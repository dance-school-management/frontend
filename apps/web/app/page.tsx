import { TodaysClassesSection } from "@/components/home-sections/classes";
import { CallToActionSection } from "@/components/home-sections/cta";
import { FeaturedDanceStylesSection } from "@/components/home-sections/dance-styles";
import { HeroSection } from "@/components/home-sections/hero";
import { FeaturedInstructorsSection } from "@/components/home-sections/instructors";
import { LatestNewsSection } from "@/components/home-sections/news";
import { TestimonialsSection } from "@/components/home-sections/testimonials";
import { WhyChooseUsSection } from "@/components/home-sections/why-us";
import { getPublishedPosts } from "@/lib/api/blog";
import { fetchDanceCategories, fetchSchedule } from "@/lib/api/product";
import { fetchInstructors } from "@/lib/api/profile";
import { transformScheduleToEvents } from "@/modules/calendar/helpers";
import { IEvent } from "@/modules/calendar/types";
import { Separator } from "@repo/ui/separator";
import { headers } from "next/headers";

export default async function Page() {
  const cookie = (await headers()).get('cookie') ?? "";

  const [
    scheduleResult,
    instructorsResult,
    newsResult,
    categoriesResult,
  ] = await Promise.all([
    fetchTodaySchedule(cookie),
    fetchInstructors(),
    getPublishedPosts({ limit: 3 }),
    fetchDanceCategories(cookie),
  ]);

  const todayClasses = scheduleResult.data
    ? getTodayClasses(transformScheduleToEvents(scheduleResult.data))
    : [];

  const categories = categoriesResult.data?.slice(0, 4) ?? [];
  const instructors = instructorsResult.data?.instructors.slice(0, 4) ?? [];
  const news = newsResult.data?.data?.slice(0, 3) ?? [];

  return (
    <div className="flex flex-col gap-12 pb-8">
      <HeroSection />
      <Separator />
      {news.length > 0 && (
        <>
          <LatestNewsSection posts={news} />
          <Separator />
        </>
      )}
      <TestimonialsSection />
      <Separator />
      <WhyChooseUsSection />
      <Separator />
      {todayClasses.length > 0 && (
        <>
          <TodaysClassesSection classes={todayClasses} />
          <Separator />
        </>
      )}
      {categories.length > 0 && (
        <>
          <FeaturedDanceStylesSection categories={categories} />
          <Separator />
        </>
      )}
      {instructors.length > 0 && (
        <>
          <FeaturedInstructorsSection instructors={instructors} />
          <Separator />
        </>
      )}
      <CallToActionSection />
    </div>
  );
}

async function fetchTodaySchedule(cookie: string) {
  const today = new Date();
  const dateFrom = today.toISOString().split('T')[0]!;
  const dateTo = today.toISOString().split('T')[0]!;
  return await fetchSchedule(dateFrom, dateTo, cookie);
}

function getTodayClasses(events: IEvent[]): IEvent[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return events.filter((event) => {
    const eventDate = new Date(event.startDate);
    return eventDate >= today && eventDate < tomorrow;
  }).sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });
}
