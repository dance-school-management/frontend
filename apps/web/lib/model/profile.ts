export type InstructorResponse = {
  instructors: Instructor[];
};

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