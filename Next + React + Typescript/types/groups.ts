export interface Group {
  id: number;
  title: string;
  description: string;
  creator_id: number;
  creator_nickname: string;
  member_count: number;
  is_member: boolean;
  is_creator: boolean;
  created_at: string;
}

export interface GroupInvitation {
  id: number;
  group_id: number;
  group_title: string;
  inviter_id: number;
  inviter_nickname: string;
  created_at: string;
}

export interface GroupJoinRequest {
  id: number;
  group_id: number;
  group_title: string;
  user_id: number;
  user_nickname: string;
  created_at: string;
}

export interface GroupEvent {
  id: number;
  group_id: number;
  title: string;
  description: string;
  event_date: string;
  creator_id: number;
  creator_nickname: string;
  going_count: number;
  not_going_count: number;
  user_response: "going" | "not_going" | null;
  created_at: string;
}

export interface GroupPost {
  id: number;
  group_id: number;
  content: string;
  author_id: number;
  nickname: string;
  created_at: string;
  comments_count: number;
  votes: number;
}