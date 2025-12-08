export type AttendanceStatus = "PRESENT" | "ABSENT";

export type PaymentStatus = "PENDING" | "PAID" | "REFUNDED" | "PART_OF_COURSE";

export type Ticket = {
  advancementLevelName: string;
  attendanceLastUpdated: string;
  attendanceStatus: AttendanceStatus;
  classId: number;
  classRoomName: string;
  danceCategoryName: string;
  description: string;
  endDate: string;
  name: string;
  paymentStatus: PaymentStatus;
  price: number;
  qrCodeUUID: string;
  startDate: string;
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

export type PaymentLinkResponse = {
  url: string;
};

export type OrderResponse = {
  sessionUrl: string;
};