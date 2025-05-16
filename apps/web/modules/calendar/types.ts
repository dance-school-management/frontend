export type TCalendarView = "day" | "week" | "month" | "year";
export type TEventColor = "blue" | "green" | "red" | "yellow" | "purple" | "orange";

export interface IInstructor {
  url: string;
  name: string;
}

export interface IEvent {
  id: number;
  startDate: string;
  endDate: string;
  name: string;
  color: TEventColor;
  description: string;
  danceCategory: string;
  advancementLevel: string;
  classroom: string;
  price: number;
  currency: string;
  courseId?: number;
  instructors: IInstructor[];
}

export interface ICalendarCell {
  day: number;
  currentMonth: boolean;
  date: Date;
}