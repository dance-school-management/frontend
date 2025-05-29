import { ApiResult, fetcher } from "./axios";
import { TicketResponse } from "@/lib/model/enroll";

export async function fetchTickets(cookie?: string): Promise<ApiResult<TicketResponse>> {
  return await fetcher("/enroll/ticket/student", undefined, undefined, { cookie });
}