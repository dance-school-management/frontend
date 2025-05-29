export type InstructorResponse = {
  instructors: Instructor[];
};

export type Instructor = {
  id: string;
  name: string;
  surname: string;
  description: string;
  photo_url?: string;
};