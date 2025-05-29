export type Ticket = {
  // id: string | number;
  advancementLevelName: string;
  classid: number;
  classRoomName: string;
  danceCategoryName: string;
  description: string;
  endDate: string;
  startDate: string;
  name: string;
};

export type TicketResponse = {
  tickets: Ticket[];
};
