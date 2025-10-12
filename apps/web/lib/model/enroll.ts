export type Ticket = {
  qrCodeUUID: string;
  advancementLevelName: string;
  classid: number;
  classRoomName: string;
  danceCategoryName: string;
  description: string;
  endDate: string;
  startDate: string;
  name: string;
};

export type TicketResponse = {
  tickets: Ticket[];
};

export type MasteredDanceCategory = {
  courseId: number;
  danceCategoryId: number;
  danceCategoryName: string;
  advancementLevelId: number;
  advancementLevelName: string;
  finishedDate: string;
  instructorsNames: string[];
};

export type MasteredDanceCategoriesResponse = MasteredDanceCategory[];

export type DanceCategoryStats = {
  danceCategoryName: string;
  spentHours: number;
};

export type DanceCategoryStatsResponse = {
  spentHoursStatsList: DanceCategoryStats[];
};

export type InstructorStats = {
  instructorFirstname: string;
  instructorSurname: string;
  spentHours: number;
};

export type InstructorStatsResponse = {
  spentHoursStatsList: InstructorStats[];
};

export type CourseAttendanceRate = {
  courseId: number;
  courseName: string;
  hasStarted: boolean;
  instructorsNames: string[];
  attendedCount: number;
  allCount: number;
};

export type CourseAttendanceRateResponse = {
  courseAttendancesRates: CourseAttendanceRate[];
};