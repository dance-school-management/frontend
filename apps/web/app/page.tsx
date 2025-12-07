import { Separator } from "@repo/ui/separator";
import { addDays, compareAsc, format, isSameDay } from "date-fns";

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

export default async function Page() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [scheduleResult, instructorsResult, newsResult, categoriesResult] = await Promise.all([
    fetchScheduleForDate(today),
    fetchInstructors(),
    getPublishedPosts({ limit: 3 }),
    fetchDanceCategories(),
  ]);

  const todayClasses =
    scheduleResult.data ? getClassesForDate(today, transformScheduleToEvents(scheduleResult.data)) : [];

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
          <TodaysClassesSection classes={todayClasses} hrefDate={format(today, "yyyy-MM-dd")} />
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

async function fetchScheduleForDate(date: Date) {
  const dateFrom = format(date, "yyyy-MM-dd");
  const dateTo = format(addDays(date, 1), "yyyy-MM-dd");

  return await fetchSchedule(dateFrom, dateTo);
}

function getClassesForDate(date: Date, events: IEvent[]): IEvent[] {
  return events
    .filter((event) => {
      const eventDate = new Date(event.startDate);
      return isSameDay(eventDate, date);
    })
    .sort((a, b) => {
      return compareAsc(a.startDate, b.startDate);
    });
}
