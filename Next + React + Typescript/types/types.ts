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
  userVote?: -1 | 0 | 1; // -1 (downvote), 0 (no vote), or 1 (upvote)
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
  follower_count?: number;
  following_count?: number;
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

export type Follower = {
  id: number;
  first_name: string;
  last_name: string;
  nickname: string;
  avatar?: string;
  email: string;
  is_private?: boolean;
  created_at: string;
};

export type FollowStatus = {
  follow_status: 'following' | 'pending' | 'not_following';
};

export type FollowRequest = {
  id: number;
  requester_id: number;
  requester_name: string;
  requester_nickname: string;
  requester_avatar?: string;
  created_at: string;
};

export type PublicUser = {
  id: number;
  first_name: string;
  last_name: string;
  nickname: string;
  avatar?: string;
  email: string;
  is_private?: boolean;
  created_at: string;
};

export type Notification = {
  id: number;
  content: string;
  created_at: string;
  is_read: boolean;
  requires_action?: boolean;
  action_taken?: 'pending' | 'accepted' | 'rejected';
  type: 'follow_request' | 'group_invitation' | 'group_join_request' | 'group_event' | 'general';
  sender_id?: number;
  sender_name?: string;
  group_id?: number;
  group_name?: string;
  event_id?: number;
  event_title?: string;
};
