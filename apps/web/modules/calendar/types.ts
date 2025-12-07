export type TCalendarView = "day" | "week";
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
  classRoomId: number;
  price: number;
  currency: string;
  courseId?: number;
  instructors: IInstructor[];
  owned?: boolean;
  paymentStatus?: string | null;
}

export interface ICalendarCell {
  day: number;
  currentMonth: boolean;
  date: Date;
}

// API Response Types
export interface IApiInstructor {
  id: string;
  name: string;
  surname: string;
}

export interface IApiDanceCategory {
  id: number;
  name: string;
  description: string;
  photoPath: string;
}

export interface IApiAdvancementLevel {
  id: number;
  name: string;
  description: string;
}

export interface IApiCourse {
  id: number;
  name: string;
  description: string;
  danceCategoryId: number;
  advancementLevelId: number;
  courseStatus: string;
  customPrice: string;
}

export interface IApiClassTemplate {
  id: number;
  courseId: number;
  name: string;
  description: string;
  price: string;
  currency: string;
  danceCategoryId: number;
  advancementLevelId: number;
  classType: string;
  scheduleTileColor: string;
  danceCategory: IApiDanceCategory;
  advancementLevel: IApiAdvancementLevel;
  course: IApiCourse;
}

export interface IApiClassRoomName {
  id: number;
  name: string;
}

export interface IApiScheduleItem {
  instructors: IApiInstructor[];
  owned: boolean;
  paymentStatus: string | null;
  id: number;
  classTemplateId: number;
  groupNumber: number;
  startDate: string;
  endDate: string;
  peopleLimit: number;
  classRoomId: number;
  classRoom: IApiClassRoomName;
  classStatus: string;
  classTemplate: IApiClassTemplate;
}

export type IApiScheduleResponse = IApiScheduleItem[];

export interface IScheduleFilters {
  danceCategory?: string;
  advancementLevel?: string;
  instructorId?: string;
  priceMin?: number;
  priceMax?: number;
}