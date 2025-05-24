import { ApiResult } from "@/lib/api/axios";

import {
  Class,
  Course,
  DanceCategory,
  AdvancementLevel,
  ClassRoom,
  ClassTemplate,
  AdditionalProductData
} from "@/lib/model/product";

export async function fetchCourse(
  id: number
): Promise<ApiResult<Course>> {
  const course = mockCourses.find(c => c.id === id);
  if (!course) {
    return {
      error: {
        status: 404,
        message: `Course not found`
      }
    };
  }
  return { data: course };
}

export async function fetchCourses(): Promise<ApiResult<Course[]>> {
  return { data: mockCourses };
}



export async function fetchAdditionalProductData(): Promise<ApiResult<AdditionalProductData>> {
  return {
    data: {
      danceCategories: mockDanceCategories,
      advancementLevels: mockAdvancementLevels,
      classRooms: mockClassrooms,
    }
  };
}

export const mockCourses: Course[] = [
  {
    id: 1,
    name: "Beginner Salsa Course",
    description: "An introductory course to Salsa for absolute beginners.",
    danceCategoryId: 1,
    danceCategory: {
      id: 1,
      name: "Salsa",
      description: "Lively and energetic Latin dance.",
    },
    advancementLevelId: 1,
    advancementLevel: {
      id: 1,
      name: "Beginner",
      description: "No prior experience required.",
    },
    courseStatus: "HIDDEN",
    currency: "USD",
    customPrice: 120,
    classTemplate: [
      {
        id: 101,
        courseId: 1,
        name: "Salsa Group Class 1",
        description: "Weekly Salsa classes with group choreography.",
        price: 15,
        currency: "USD",
        danceCategoryId: 1,
        advancementLevelId: 1,
        classType: "GROUP_CLASS",
        scheduleTileColor: "#FF5733",
        class: [
          {
            id: 1,
            classTemplateId: 3,
            groupNumber: 3,
            startDate: "2025-05-10T14:00:00.000Z",
            endDate: "2025-05-10T16:00:00.000Z",
            peopleLimit: 25,
            classRoomId: 1,
            classStatus: "HIDDEN",
            instructorIds: ["1"]
          }
        ],
      }
    ],
  },
  {
    id: 2,
    name: "Advanced Bachata Workshop",
    description: "Master sensual Bachata techniques in this advanced workshop.",
    danceCategoryId: 2,
    danceCategory: {
      id: 2,
      name: "Bachata",
      description: "A romantic style of dance from the Dominican Republic.",
    },
    advancementLevelId: 3,
    advancementLevel: {
      id: 3,
      name: "Advanced",
      description: "Requires solid prior experience and technique.",
    },
    courseStatus: "ONGOING",
    currency: "USD",
    customPrice: 200,
    classTemplate: [
      {
        id: 202,
        courseId: 2,
        name: "Bachata Private Intensive",
        description: "One-on-one sessions with a top instructor.",
        price: 50,
        currency: "USD",
        danceCategoryId: 2,
        advancementLevelId: 3,
        classType: "PRIVATE_CLASS",
        scheduleTileColor: "#9C27B0",
        class: [],
      }
    ],
  },
];

export const mockClassrooms: ClassRoom[] = [
  {
    id: 1,
    name: "Classroom 1",
    peopleLimit: 25,
    description: "Class Room 1 description",
  },
  {
    id: 2,
    name: "Main Hall",
    peopleLimit: 100,
    description: "Biggest classroom in the studio",
  },
  {
    id: 3,
    name: "Classroom 3",
    peopleLimit: 15,
    description: "Class Room 3 description",
  },
];

export const mockDanceCategories: DanceCategory[] = [
  {
    id: 1,
    name: "Salsa",
    description: "Lively and energetic Latin dance.",
  },
  {
    id: 2,
    name: "Bachata",
    description: "A romantic style of dance from the Dominican Republic.",
  },
];

export const mockAdvancementLevels: AdvancementLevel[] = [

  {
    id: 1,
    name: "Beginner",
    description: "No prior experience required.",
  },
  {
    id: 2,
    name: "Intermediate",
    description: "Some prior experience required.",
  },
  {
    id: 3,
    name: "Advanced",
    description: "Requires solid prior experience and technique.",
  },
];

export const mockClassTemplates: ClassTemplate[] = [
  {
    id: 101,
    courseId: 1,
    name: "Salsa Group Class 1",
    description: "Weekly Salsa classes with group choreography.",
    price: 15,
    currency: "USD",
    danceCategoryId: 1,
    advancementLevelId: 1,
    classType: "GROUP_CLASS",
    scheduleTileColor: "#FF5733",
    class: [
      {
        id: 1,
        classTemplateId: 3,
        groupNumber: 3,
        startDate: "2025-05-10T14:00:00.000Z",
        endDate: "2025-05-10T16:00:00.000Z",
        peopleLimit: 25,
        classRoomId: 1,
        classStatus: "HIDDEN",
        instructorIds: ["1"]
      }
    ],
  },
  {
    id: 2,
    name: "Class Template 1",
    description: "Class Template 1 description",
    price: 100,
    currency: "USD",
    classType: "GROUP_CLASS",
    class: [],
  },
  {
    id: 3,
    name: "Class Template 2",
    description: "Class Template 2 description",
    price: 100,
    currency: "PLN",
    classType: "PRIVATE_CLASS",
    class: [],
  },
];

export const mockClasses: Class[] = [
  {
    id: 1,
    classTemplateId: 101,
    groupNumber: 3,
    startDate: "2025-05-10T14:00:00.000Z",
    endDate: "2025-05-10T16:00:00.000Z",
    peopleLimit: 25,
    classRoomId: 1,
    classStatus: "HIDDEN",
    instructorIds: ["1"]
  }
];