export type Post = {
  id: number;
  group?: string;
  nickname: string;
  created_at: string;
  title: string;
  content: string;
  image_paths?: string[];
  categories: string[];
  votes: number;
  comments_count?: number;
};

export type Category = {
  id: number;
  name: string;
};

export type Comment = {
  id: number;
  post_id: number;
  user_id: number;
  nickname: string;
  content: string;
  created_at: string;
  votes: number;
};

export type User = {
  id: number;
  nickname: string;
  first_name: string;
  last_name: string;
  date_of_birth: string; // or Date if parsed
  gender: string;
  email: string;
};

export type ProfileData = {
  user: User;
  posts: Post[];
  comments: Comment[];
};
