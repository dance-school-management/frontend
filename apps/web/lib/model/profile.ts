
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