export type Course = {
  id: number;
  name: string;
  description: string;
  danceCategoryId?: number;
  danceCategory?: DanceCategory;
  advancementLevelId?: number;
  advancementLevel?: AdvancementLevel;
  courseStatus: CourseStatus;
  customPrice?: number;
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
  classTemplate: ClassTemplate;
  groupNumber: number;
  startDate: Date;
  endDate: Date;
  peopleLimit: number;
  classRoomId: number;
  classRoom: ClassRoom;
  classStatus: ClassStatus;
  // instructor: InstructorsOnClasses[];
};

export type ClassRoom = {
  id: number;
  name: string;
  peopleLimit: number;
  description: string;
  class: Class[];
};

export type ClassTemplate = {
  id: number;
  courseId?: number;
  course?: Course;
  name: string;
  description: string;
  price: number;
  currency: string;
  danceCategoryId?: number;
  danceCategory?: DanceCategory;
  advancementLevelId?: number;
  advancementLevel?: AdvancementLevel;
  classType: ClassType;
  scheduleTileColor?: string;
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
  | 'POSTPONED'
  | 'MAKE_UP';

export type CourseStatus =
  | 'HIDDEN'
  | 'SALE'
  | 'ONGOING'
  | 'FINISHED';
