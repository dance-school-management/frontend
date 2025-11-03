export type Notification = {
  id: number;
  title: string;
  body: string;
  sendDate: string;
  payload: Record<string, unknown>;
  hasBeenRead: boolean;
};
