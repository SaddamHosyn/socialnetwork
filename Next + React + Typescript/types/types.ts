// types/types.ts

export type Category = {
  id: number;
  name: string;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  nickname: string;
  group?: string;
  image_paths?: string[];
  categories: string[];
  votes: number;
  comments_count?: number;
  userVote?: number; // -1, 0, or 1
};

export type Comment = {
  id: number;
  post_id: number;
  content: string;
  author: string;
  nickname: string; // Added this field
  votes: number;
  created_at: string;
};

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  avatar?: string;
  nickname: string;
  about_me?: string;
  is_private?: boolean; // Added this field that UserList component expects
  created_at: string; // Added this field that UserList component expects
};

export type ProfileData = {
  user: User;
  posts: Post[];
};

export type Group = {
  id: number;
  name: string;
  description: string;
  privacy: 'public' | 'private';
  members_count: number;
  is_member: boolean;
  created_at: string;
};