import { useState, useCallback } from 'react';
import type { FollowRequest, Follower, FollowStatus } from '../types/types';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface FollowData {
  message: string;
  status: 'following' | 'pending' | 'not_following';
}

export const useFollower = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = useCallback(async <T>(url: string, method = 'GET', body?: URLSearchParams): Promise<ApiResponse<T>> => {
    const options: RequestInit = {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    };
    
    if (body) {
      options.body = body;
    }
    
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }, []);

  const followUser = useCallback(async (userId: number): Promise<FollowData | null> => {
    setLoading(true);
    setError(null);
    
    const formData = new URLSearchParams();
    formData.append('user_id', userId.toString());
    
    const result = await makeRequest<FollowData>('/api/follow', 'POST', formData);
    
    setLoading(false);
    
    if (result.success && result.data) {
      return result.data;
    } else {
      setError(result.error || 'Follow failed');
      return null;
    }
  }, [makeRequest]);

  const unfollowUser = useCallback(async (userId: number): Promise<FollowData | null> => {
    setLoading(true);
    setError(null);
    
    const formData = new URLSearchParams();
    formData.append('user_id', userId.toString());
    
    const result = await makeRequest<FollowData>('/api/unfollow', 'POST', formData);
    
    setLoading(false);
    
    if (result.success && result.data) {
      return result.data;
    } else {
      setError(result.error || 'Unfollow failed');
      return null;
    }
  }, [makeRequest]);

  const getFollowStatus = useCallback(async (userId: number): Promise<FollowStatus | null> => {
    const result = await makeRequest<FollowStatus>(`/api/follow/status?user_id=${userId}`);
    
    if (result.success && result.data) {
      return result.data;
    }
    
    return null;
  }, [makeRequest]);

  const respondToFollowRequest = useCallback(async (requestId: number, action: 'accept' | 'decline'): Promise<{ message: string } | null> => {
    setLoading(true);
    setError(null);
    
    const formData = new URLSearchParams();
    formData.append('request_id', requestId.toString());
    formData.append('action', action);
    
    const result = await makeRequest<{ message: string }>('/api/follow/request/respond', 'POST', formData);
    
    setLoading(false);
    
    if (result.success && result.data) {
      return result.data;
    } else {
      setError(result.error || 'Action failed');
      return null;
    }
  }, [makeRequest]);

  const getFollowRequests = useCallback(async (): Promise<FollowRequest[]> => {
    const result = await makeRequest<{ follow_requests: FollowRequest[] }>('/api/follow/requests');
    
    if (result.success && result.data?.follow_requests) {
      return result.data.follow_requests;
    }
    
    return [];
  }, [makeRequest]);

  const getFollowers = useCallback(async (userId: number): Promise<Follower[]> => {
    const result = await makeRequest<{ followers: Follower[] }>(`/api/followers?user_id=${userId}`);
    
    if (result.success && result.data?.followers) {
      return result.data.followers;
    }
    
    return [];
  }, [makeRequest]);

  const getFollowing = useCallback(async (userId: number): Promise<Follower[]> => {
    const result = await makeRequest<{ following: Follower[] }>(`/api/following?user_id=${userId}`);
    
    if (result.success && result.data?.following) {
      return result.data.following;
    }
    
    return [];
  }, [makeRequest]);

  const getPublicUsers = useCallback(async (): Promise<{ users: any[] } | null> => {
    const result = await makeRequest<any[]>('/api/users');
    
    if (result.success && result.data) {
      // Wrap the users array in an object to match expected format
      return { users: result.data };
    }
    
    return null;
  }, [makeRequest]);

  return {
    loading,
    error,
    followUser,
    unfollowUser,
    getFollowStatus,
    respondToFollowRequest,
    getFollowRequests,
    getFollowers,
    getFollowing,
    getPublicUsers,
  };
};
