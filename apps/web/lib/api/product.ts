import { Course, AdditionalProductData, ClassTemplate, Class } from "@/lib/model/product";
import { ApiResult, fetcher } from "@/lib/api/axios";

type CreateCoursePayload = {
  name: string;
  isConfirmation: boolean;
};

type UpdateCoursePayload = {
  id: number;
  name: string;
  description: string | null;
  courseStatus: string;
  customPrice: number | null;
  currency: string | null;
  danceCategoryId: number | null;
  advancementLevelId: number | null;
};

type CreateClassPayload = {
  classTemplateId: number;
  groupNumber: number;
  peopleLimit: number;
  classRoomId: number;
  instructorIds: string[];
  startDate: string;
  endDate: string;
  isConfirmation: boolean;
  classStatus: string;
};

interface UpdateClassTemplatePayload {
  courseId: number | null;
  name: string;
  description: string;
  price: number;
  currency: string;
  classType: string;
  scheduleTileColor: string;
  danceCategoryId: number | null;
  advancementLevelId: number | null;
};

interface CreateClassTemplatePayload extends UpdateClassTemplatePayload {
  isConfirmation: boolean;
}

export async function createCourse(payload: CreateCoursePayload) {
  return await fetcher<{ id: number; }>("/product/cms/course/new", "POST", payload);
}

export async function createClass(payload: CreateClassPayload) {
  return await fetcher<Class>("/product/cms/class", "POST", payload);
}

export async function updateCourse(payload: UpdateCoursePayload) {
  return await fetcher<Course>("/product/cms/course/edit", "PUT", payload);
}

export async function updateClassTemplate(id: number, payload: UpdateClassTemplatePayload) {
  return await fetcher<ClassTemplate>(`/product/cms/class_template/${id}`, "PUT", payload);
}

export async function createClassTemplate(payload: CreateClassTemplatePayload) {
  return await fetcher<ClassTemplate>("/product/cms/class_template", "POST", payload);
}

export async function fetchCourse(id: number, cookie?: string): Promise<ApiResult<Course>> {
  return await fetcher<Course>(`/product/cms/course/${id}`, undefined, undefined, { cookie });
}

export async function fetchCourses(cookie?: string): Promise<ApiResult<Course[]>> {
  return await fetcher<Course[]>("/product/cms/course", "POST", {
    filter: {},
    search_query: "",
  }, { cookie });
}

export async function fetchClassTemplates(cookie?: string): Promise<ApiResult<ClassTemplate[]>> {
  return await fetcher<ClassTemplate[]>("/product/cms/class_template", undefined, undefined, { cookie });
}

export async function fetchClassTemplate(id: number, cookie?: string): Promise<ApiResult<ClassTemplate>> {
  return await fetcher<ClassTemplate>(`/product/cms/class_template/${id}`, undefined, undefined, { cookie });
}

export async function fetchAdditionalProductData(): Promise<ApiResult<AdditionalProductData>> {
  return await fetcher<AdditionalProductData>("/product/cms/aggregations/class-template-creation-data");
}