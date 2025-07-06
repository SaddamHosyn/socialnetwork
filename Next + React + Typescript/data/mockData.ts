import type { User, FollowRequest, Follower } from '../types';

// Mock users data for development/testing
export const mockUsers: User[] = [
  {
    id: 2,
    nickname: 'alice_wonder',
    email: 'alice@example.com',
    is_private: false,
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 3,
    nickname: 'bob_builder',
    email: 'bob@example.com',
    is_private: true,
    created_at: '2024-01-20T14:45:00Z'
  },
  {
    id: 4,
    nickname: 'charlie_chaplin',
    email: 'charlie@example.com',
    is_private: false,
    created_at: '2024-02-01T09:15:00Z'
  },
  {
    id: 5,
    nickname: 'diana_prince',
    email: 'diana@example.com',
    is_private: true,
    created_at: '2024-02-10T16:20:00Z'
  },
  {
    id: 6,
    nickname: 'edward_elric',
    email: 'edward@example.com',
    is_private: false,
    created_at: '2024-02-15T11:30:00Z'
  }
];

export const mockCurrentUser: User = {
  id: 1,
  nickname: 'current_user',
  email: 'current@example.com',
  is_private: false,
  created_at: '2024-01-01T08:00:00Z'
};

export const mockFollowRequests: FollowRequest[] = [
  {
    id: 1,
    requester_id: 3,
    requester_nickname: 'bob_builder',
    requested_id: 1,
    status: 'pending',
    created_at: '2024-06-20T10:00:00Z'
  },
  {
    id: 2,
    requester_id: 5,
    requester_nickname: 'diana_prince',
    requested_id: 1,
    status: 'pending',
    created_at: '2024-06-21T15:30:00Z'
  }
];

export const mockFollowers: Follower[] = [
  {
    id: 2,
    nickname: 'alice_wonder',
    followed_at: '2024-06-15T12:00:00Z'
  },
  {
    id: 4,
    nickname: 'charlie_chaplin',
    followed_at: '2024-06-18T09:30:00Z'
  }
];

export const mockFollowing: Follower[] = [
  {
    id: 6,
    nickname: 'edward_elric',
    followed_at: '2024-06-16T14:20:00Z'
  }
];
