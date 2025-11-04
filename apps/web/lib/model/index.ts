type Class = {
  id: string | number;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  trainer: string;
  dance_category: string;
  advancement_level: string;
  description: string;
  classroom: string;
};

type Ticket = {
  id: string | number;
  class: Class;
  user_id: string | number;
  created_at: string;
  updated_at: string;
};

export type Paginated<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export * from "../auth/auth-client";
export type { Class, Ticket };