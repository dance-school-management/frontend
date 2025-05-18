import { Course } from "@/lib/model/product";
import { ApiResult } from "@/lib/api/axios";

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
        class: [],
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
