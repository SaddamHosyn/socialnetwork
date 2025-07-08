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
  userVote?: 1 | -1 | 0;
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
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  nickname?: string;
  about_me?: string;
  avatar?: string;
  is_private?: boolean;
  created_at?: string;
  follower_count?: number;
  following_count?: number;
};

export type ProfileData = {
  user: User;
  posts: Post[];
  comments: Comment[];
  follower_count: number;
  following_count: number;
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



export type Notification = {
  id: number;
  user_id: number;
  type: string;
  reference_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
  requires_action: boolean;
  action_taken: string;
  sender_id: number;
  sender_name: string;
}

export type NotificationType = 
  | 'follow_request'
  | 'group_invite'
  | 'join_request'
  | 'group_event';
