<<<<<<< HEAD
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
=======
// types/types.ts
>>>>>>> origin/milli

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
<<<<<<< HEAD
  is_private?: boolean;
  created_at?: string;
  follower_count?: number;
  following_count?: number;
=======
  nickname: string;
  about_me?: string;
  is_private?: boolean; // Added this field that UserList component expects
  created_at: string; // Added this field that UserList component expects
>>>>>>> origin/milli
};

export type ProfileData = {
  user: User;
  posts: Post[];
<<<<<<< HEAD
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
=======
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
>>>>>>> origin/milli
