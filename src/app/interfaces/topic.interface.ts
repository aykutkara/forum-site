export interface ITopic {
  id: number;
  userId: number;
  title: string;
  description : HTMLElement;
  views: number;
  tags: string[] | undefined;
  date : string;
}
