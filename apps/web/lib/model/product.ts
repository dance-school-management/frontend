export type CourseSummary = {
  id: number;
  name: string;
  description: string;
  danceCategoryId: number;
  advancementLevelId: number;
  price: number;
  danceCategory: DanceCategory;
  advancementLevel: AdvancementLevel;
  courseStatus: CourseStatus;
};

export type Course = {
  id: number;
  name: string;
  description: string;
  danceCategoryId?: number;
  danceCategory?: DanceCategory;
  advancementLevelId?: number;
  advancementLevel?: AdvancementLevel;
  courseStatus: CourseStatus;
  price?: number;
  allClassesPrice?: number;
  classTemplate: ClassTemplate[];
};

export type DanceCategory = {
  id: number;
  name: string;
  description: string;
  photoPath?: string;
};

export type AdvancementLevel = {
  id: number;
  name: string;
  description: string;
};

export type Class = {
  id: number;
  classTemplateId: number;
  groupNumber: number;
  startDate: string;
  endDate: string;
  peopleLimit: number;
  classRoomId: number;
  classStatus: ClassStatus;
  instructorIds: string[];
};

export type ClassRoom = {
  id: number;
  name: string;
  peopleLimit: number;
  description: string;
};

export type ClassTemplate = {
  id: number;
  courseId?: number;
  course?: Course;
  name: string;
  description: string;
  price: number;
  danceCategoryId?: number;
  danceCategory?: DanceCategory;
  advancementLevelId?: number;
  advancementLevel?: AdvancementLevel;
  classType: ClassType;
  class: Class[];
};

export type ClassType =
  | 'GROUP_CLASS'
  | 'PRIVATE_CLASS'
  | 'THEME_PARTY';

export type ClassStatus =
  | 'HIDDEN'
  | 'NORMAL'
  | 'CANCELLED'
  | 'POSTPONED';

export type CourseStatus =
  | 'HIDDEN'
  | 'SALE'
  | 'ONGOING'
  | 'FINISHED';

export type AdditionalProductData = {
  danceCategories: DanceCategory[];
  advancementLevels: AdvancementLevel[];
  classRooms: ClassRoom[];
};

export type ClassWithTemplate = Omit<Class, 'instructorIds'> & { classTemplate: Omit<ClassTemplate, 'class'>; };

export type CoursesClassesResponse = {
  courseData: CourseSummary;
  classes: ClassWithTemplate[];
}[];