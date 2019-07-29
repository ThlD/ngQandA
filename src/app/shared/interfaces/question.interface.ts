export interface Comment {
  body: string;
  author?: string;
  date?: Date;
  isResolved?: boolean;
}

export interface Question {
  title: string;
  description: string;
  categories: string[];
  author?: string;
  isApproved?: boolean;
  date?: Date;
  id?: string;
  comments?: Comment[];
  isAnswered?: boolean;
}

export  interface  IFilter {
  status: string[];
  tag: string[];
  time: string[];
}
