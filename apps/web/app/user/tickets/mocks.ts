import { Ticket } from "@/lib/model";

export const tickets: Ticket[] = [
  {
    id: "783e1f2b-a08f-4c59-b793-5a8846e50f87",
    class: {
      id: 1,
      name: "Salsa",
      date: "2021-08-01",
      start_time: "18:00",
      end_time: "19:00",
      trainer: "John Doe",
      dance_category: "Salsa",
      advancement_level: "Beginner",
      description: "Learn the basics of salsa dancing",
      classroom: "Main hall",
    },
    user_id: 1,
    created_at: "2021-07-31T12:00:00",
    updated_at: "2021-07-31T12:00:00",
  },
  {
    id: "a3d6200b-eeee-4804-ba0a-a39444136cd8",
    class: {
      id: 2,
      name: "Bachata",
      date: "2021-08-01",
      start_time: "19:00",
      end_time: "20:00",
      trainer: "Jane Doe",
      dance_category: "Bachata",
      advancement_level: "Beginner",
      description: "Learn the basics of bachata dancing",
      classroom: "Main hall",
    },
    user_id: 1,
    created_at: "2021-07-31T12:00:00",
    updated_at: "2021-07-31T12:00:00",
  }
];