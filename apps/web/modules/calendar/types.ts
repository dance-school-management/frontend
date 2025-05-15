export type TCalendarView = "day" | "week" | "month" | "year";
export type TEventColor = "blue" | "green" | "red" | "yellow" | "purple" | "orange";

export interface IUser {
  id: string;
  name: string;
  picturePath: string | null;
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
  user: IUser;
}

export interface ICalendarCell {
  day: number;
  currentMonth: boolean;
  date: Date;
}