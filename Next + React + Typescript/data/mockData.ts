import type { User, FollowRequest, Follower } from "../types/types";

// Mock users data for development/testing
export const mockUsers: User[] = [
  {
    id: 2,
    email: "alice@example.com",
    first_name: "Alice",
    last_name: "Wonder",
    date_of_birth: "1990-05-15",
    gender: "female",
    nickname: "alice_wonder",
    is_private: false,
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: 3,
    email: "bob@example.com",
    first_name: "Bob",
    last_name: "Builder",
    date_of_birth: "1988-10-20",
    gender: "male",
    nickname: "bob_builder",
    is_private: true,
    created_at: "2024-01-20T14:45:00Z",
  },
  {
    id: 4,
    email: "charlie@example.com",
    first_name: "Charlie",
    last_name: "Chaplin",
    date_of_birth: "1985-03-12",
    gender: "male",
    nickname: "charlie_chaplin",
    is_private: false,
    created_at: "2024-02-01T09:15:00Z",
  },
  {
    id: 5,
    email: "diana@example.com",
    first_name: "Diana",
    last_name: "Prince",
    date_of_birth: "1992-07-08",
    gender: "female",
    nickname: "diana_prince",
    is_private: true,
    created_at: "2024-02-10T16:20:00Z",
  },
  {
    id: 6,
    email: "edward@example.com",
    first_name: "Edward",
    last_name: "Elric",
    date_of_birth: "1995-01-03",
    gender: "male",
    nickname: "edward_elric",
    is_private: false,
    created_at: "2024-02-15T11:30:00Z",
  },
];

export const mockCurrentUser: User = {
  id: 1,
  email: "current@example.com",
  first_name: "Current",
  last_name: "User",
  date_of_birth: "1990-01-01",
  gender: "other",
  nickname: "current_user",
  is_private: false,
  created_at: "2024-01-01T08:00:00Z",
};

export const mockFollowRequests: FollowRequest[] = [
  {
    id: 1,
    requester_id: 3,
    requester_name: "Bob Builder",
    requester_nickname: "bob_builder",
    created_at: "2024-06-20T10:00:00Z",
  },
  {
    id: 2,
    requester_id: 5,
    requester_name: "Diana Prince",
    requester_nickname: "diana_prince",
    created_at: "2024-06-21T15:30:00Z",
  },
];

export const mockFollowers: Follower[] = [
  {
    id: 2,
    first_name: "Alice",
    last_name: "Wonder",
    nickname: "alice_wonder",
    email: "alice@example.com",
    is_private: false,
    created_at: "2024-06-15T12:00:00Z",
  },
  {
    id: 4,
    first_name: "Charlie",
    last_name: "Chaplin",
    nickname: "charlie_chaplin",
    email: "charlie@example.com",
    is_private: false,
    created_at: "2024-06-18T09:30:00Z",
  },
];

export const mockFollowing: Follower[] = [
  {
    id: 6,
    first_name: "Edward",
    last_name: "Elric",
    nickname: "edward_elric",
    email: "edward@example.com",
    is_private: false,
    created_at: "2024-06-16T14:20:00Z",
  },
];
