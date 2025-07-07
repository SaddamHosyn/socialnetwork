import { Post } from './types';


export type Group = {
  id: number;
  title: string;
  description: string;
  creator_id: number;
  creator_nickname: string;
  created_at: string;
  member_count: number;
  is_member: boolean;
  is_creator: boolean;
};

export type GroupMember = {
  id: number;
  nickname: string;
  avatar?: string;
  joined_at: string;
};

export type GroupInvitation = {
  id: number;
  group_id: number;
  group_title: string;
  inviter_id: number;
  inviter_nickname: string;
  created_at: string;
};

export type GroupJoinRequest = {
  id: number;
  group_id: number;
  group_title: string;
  user_id: number;
  user_nickname: string;
  created_at: string;
};

export type GroupEvent = {
  id: number;
  group_id: number;
  title: string;
  description: string;
  event_date: string;
  creator_id: number;
  creator_nickname: string;
  created_at: string;
  user_response?: 'going' | 'not_going';
  going_count: number;
  not_going_count: number;
};

export type GroupPost = Post & {
  group_id: number;
};