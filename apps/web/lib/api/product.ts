import { ApiResult, fetcher } from "@/lib/api/axios";
import {
  AdditionalProductData,
  AdvancementLevel,
  Class,
  ClassRoom,
  ClassTemplate,
  ClassWithTemplate,
  Course,
  CourseSummary,
  DanceCategory,
} from "@/lib/model/product";
import { IApiScheduleResponse } from "@/modules/calendar/types";

// Courses API
type CreateCoursePayload = {
  name: string;
  isConfirmation: boolean;
};

type UpdateCoursePayload = {
  id: number;
  name: string;
  description: string;
  price: number | null;
  danceCategoryId: number | null;
  advancementLevelId: number | null;
};

export async function createCourse(payload: CreateCoursePayload) {
  return await fetcher<{ id: number; }>("/product/cms/course/new", "POST", payload);
}

export async function publishCourse(courseId: number, cookie?: string) {
  return await fetcher<{ message: string; }>(`/product/cms/course/${courseId}/publish`, "PATCH", { isConfirmation: true }, { cookie });
}

export async function updateCourse(payload: UpdateCoursePayload) {
  return await fetcher<Course>("/product/cms/course/edit", "PUT", payload);
}

export async function deleteCourse(id: number, cookie?: string) {
  return await fetcher<null>(`/product/cms/course/${id}`, "DELETE", undefined, { cookie });
}

export async function fetchCourse(id: number, cookie?: string) {
  return await fetcher<Course & { allClassesPrice: number; }>(`/product/cms/course/${id}`, undefined, undefined, { cookie });
}

export async function fetchCourses(cookie?: string) {
  return await fetcher<Course[]>("/product/cms/course", "POST", {
    filter: {},
    search_query: "",
  }, { cookie });
}

// Class templates API
type UpdateClassTemplatePayload = {
  courseId: number | null;
  name: string;
  description: string;
  price: number;
  classType: string;
  danceCategoryId: number | null;
  advancementLevelId: number | null;
};

type CreateClassTemplatePayload = UpdateClassTemplatePayload & {
  isConfirmation: boolean;
};

export async function updateClassTemplate(id: number, payload: UpdateClassTemplatePayload) {
  return await fetcher<ClassTemplate>(`/product/cms/class_template/${id}`, "PUT", payload);
}

export async function createClassTemplate(payload: CreateClassTemplatePayload) {
  return await fetcher<ClassTemplate>("/product/cms/class_template", "POST", payload);
}

export async function fetchClassTemplates(cookie?: string) {
  return await fetcher<ClassTemplate[]>("/product/cms/class_template", undefined, undefined, { cookie });
}

export async function fetchClassTemplate(id: number, cookie?: string) {
  return await fetcher<ClassTemplate>(`/product/cms/class_template/${id}`, undefined, undefined, { cookie });
}

export async function deleteClassTemplate(id: number, cookie?: string) {
  return await fetcher<null>(`/product/cms/class_template/${id}`, "DELETE", undefined, { cookie });
}

// Classes API
type CreateClassPayload = {
  classTemplateId: number;
  peopleLimit: number;
  classRoomId: number;
  instructorIds: string[];
  startDate: string;
  endDate: string;
  isConfirmation: boolean;
};

export async function createClass(payload: CreateClassPayload) {
  return await fetcher<Class>("/product/cms/class", "POST", payload);
}

export async function updateClassStatus(payload: { classId: number; }, cookie?: string) {
  return await fetcher<Class>("/product/cms/class/publish", "PATCH", payload, { cookie });
}

// Aggregations API
export async function fetchAdditionalProductData() {
  return await fetcher<AdditionalProductData>("/product/cms/aggregations/class-template-creation-data");
}

// Public API
type CoursesClassesResponse = {
  courseData: CourseSummary;
  classes: ClassWithTemplate[];
}[];

export async function fetchScheduleCourses() {
  return await fetcher<CourseSummary[]>(`/product/public/schedule/search/courses`);
}

export async function fetchCoursesClasses(courseIds: number[]) {
  const searchParams = new URLSearchParams(courseIds.map((courseId) => ["coursesIds", courseId.toString()]));
  return await fetcher<CoursesClassesResponse>(`/product/public/schedule/courses/classes?${searchParams.toString()}`);
}

export async function fetchSchedule(dateFrom: string, dateTo: string, cookie?: string) {
  return await fetcher<IApiScheduleResponse>(`/product/public/schedule?dateFrom=${dateFrom}&dateTo=${dateTo}`, undefined, undefined, { cookie });
}

export async function fetchDanceCategories(): Promise<ApiResult<DanceCategory[]>> {
  return await fetcher<DanceCategory[]>("/product/public/cms/dance_category");
}

export async function fetchAdvancementLevels(): Promise<ApiResult<AdvancementLevel[]>> {
  return await fetcher<AdvancementLevel[]>("/product/public/cms/advancement_level");
}

export async function fetchClassRooms(): Promise<ApiResult<ClassRoom[]>> {
  return await fetcher<ClassRoom[]>("/product/public/cms/class_room");
}

export async function fetchPublicClass(id: number) {
  return await fetcher<ClassWithTemplate>(`/product/public/schedule/class/${id}`);
}

// Private classes API
type PrivateClassTemplatePayload = {
  name: string;
  description: string;
  price: number;
  danceCategoryId: number;
  advancementLevelId: number;
};

type PrivateClassTemplateResponse = {
  message: string;
  classTemplateData: ClassTemplate;
};

type PrivateClassPayload = {
  classTemplateId: number;
  classRoomId: number;
  startDate: string;
  endDate: string;
};

type PrivateClassResponse = {
  message: string;
  class: Class;
};

export async function createPrivateClassTemplate(payload: { classTemplateData: PrivateClassTemplatePayload; }, cookie?: string) {
  return await fetcher<PrivateClassTemplateResponse>("/product/private-class/class-template", "POST", payload, { cookie });
}

export async function updatePrivateClassTemplate(payload: { classTemplateData: PrivateClassTemplatePayload & { id: number; }; }, cookie?: string) {
  return await fetcher<PrivateClassTemplateResponse>("/product/private-class/class-template", "PUT", payload, { cookie });
}

export async function deletePrivateClassTemplate(id: number, cookie?: string) {
  return await fetcher<null>(`/product/private-class/class-template/${id}`, "DELETE", undefined, { cookie });
}

export async function fetchPrivateClassTemplates(cookie?: string) {
  return await fetcher<Omit<ClassTemplate, 'class'>[]>(`/product/private-class/class-template`, undefined, undefined, { cookie });
}

export async function fetchPrivateClassTemplate(id: number, cookie?: string) {
  return await fetcher<ClassTemplate>(`/product/private-class/class-template/${id}`, undefined, undefined, { cookie });
}

export async function createPrivateClass(payload: { classData: PrivateClassPayload, studentIds: string[]; }, cookie?: string) {
  return await fetcher<PrivateClassResponse>("/product/private-class/class", "POST", payload, { cookie });
}

export async function updatePrivateClass(payload: { classData: PrivateClassPayload & { id: number; }; }, cookie?: string) {
  return await fetcher<Class>("/product/private-class/class", "PUT", payload, { cookie });
}

export async function fetchPrivateClasses(cookie?: string) {
  return await fetcher<ClassWithTemplate[]>(`/product/private-class/class`, undefined, undefined, { cookie });
}

export async function fetchPrivateClass(id: number, cookie?: string) {
  return await fetcher<ClassWithTemplate>(`/product/private-class/class/${id}`, undefined, undefined, { cookie });
}
