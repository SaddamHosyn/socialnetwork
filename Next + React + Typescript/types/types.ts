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
  email: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  gender?: string;
  nickname?: string;
  about_me?: string;
  avatar?: string;
  is_private?: boolean;
  created_at?: string;
};

export type ProfileData = {
  user: User;
  posts: Post[];
  comments: Comment[];
};

// Follower system types
export type FollowRequest = {
  id: number;
  requester_id: number;
  requestee_id?: number;
  requested_id?: number;
  requester_nickname: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
};

export type Follower = {
  id: number;
  follower_id?: number;
  followee_id?: number;
  nickname: string;
  followed_at: string;
};

export type FollowStatus = {
  is_following: boolean;
  follow_status: 'following' | 'pending' | 'not_following';
  is_private: boolean;
  has_pending_request: boolean;
};
