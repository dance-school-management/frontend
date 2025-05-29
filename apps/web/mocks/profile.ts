import { ApiResult } from "@/lib/api/axios";
import { Instructor, InstructorResponse } from "@/lib/model/profile";

export async function fetchInstructors(): Promise<ApiResult<InstructorResponse>> {
  return {
    data: {
      instructors: mockInstructors,
    }
  };
}

export const mockInstructors: Instructor[] = [
  {
    id: "ee1-1-1",
    name: "John",
    surname: "Doe",
    description: "John Doe is a great instructor",
  },
  {
    id: "ee1-1-2",
    name: "Jane",
    surname: "Smith",
    description: "Jane Smith is a great instructor",
  },
  {
    id: "ee1-1-3",
    name: "Jim",
    surname: "Beam",
    description: "Jim Beam is a great instructor",
  },
  {
    id: "ee1-1-4",
    name: "Jill",
    surname: "Johnson",
    description: "Jill Johnson is a great instructor",
  },
];  