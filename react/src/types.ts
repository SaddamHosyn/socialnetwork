export type Comment = {
  id: number;
  post_id: number;
  user_id: number;
  nickname: string;
  content: string;
  created_at: string;
  votes: number;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  nickname: string;
  votes: number;
  categories: string[];
  image_path?: string;
  created_at: string;
};

export type CategoryType = {
  id: number;
  name: string;
};

export type NotificationType =
  | "FOLLOW_REQUEST"
  | "GROUP_INVITE"
  | "GROUP_JOIN_REQUEST"
  | "GROUP_EVENT";

export type Notification = {
  id: number;
  user_id: number;
  type: NotificationType; // use the union type here
  reference_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
};
