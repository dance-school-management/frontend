import { UserRole } from "@/lib/model/auth";

export type Instructor = {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  startDate: string;
  description: string;
  photoPath?: string;
  favouriteDanceCategories: string[];
};

export type InstructorExperience = {
  danceCategoryName: string;
  advancementLevelName: string;
  spentHours: number;
};

export type InstructorWithDetails = Instructor & { experience: InstructorExperience[]; };

export type InstructorsResponse = {
  instructors: Instructor[];
};

export type InstructorResponse = {
  data: InstructorWithDetails;
};

export type ProfileData = {
  id: string;
  name: string;
  surname: string;
  email: string | null;
  phone: string | null;
  startDate: string | null;
  description: string | null;
  photoPath: string | null;
  favouriteDanceCategories: number[];
  role: UserRole;
};

export type GetProfileResponse = {
  userData: ProfileData;
};