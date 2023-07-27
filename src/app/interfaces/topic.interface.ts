export interface ITopic {
  id: number;
  userId: number;
  title: string;
  views: number;
  tags: string[] | undefined;
  date : string;
}
