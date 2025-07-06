import { useState, useCallback } from 'react';
import type { Group, GroupMember, GroupInvitation, GroupJoinRequest, GroupEvent } from '../types/groups';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const useGroups = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = useCallback(async <T>(url: string, method = 'GET', body?: URLSearchParams | FormData): Promise<ApiResponse<T>> => {
    const options: RequestInit = {
      method,
      credentials: 'include',
    };
    
    if (body) {
      if (body instanceof FormData) {
        options.body = body;
      } else {
        options.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        options.body = body;
      }
    }
    
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }, []);

  // Create a new group
  const createGroup = useCallback(async (title: string, description: string): Promise<{ group_id: number } | null> => {
    setLoading(true);
    setError(null);
    
    const formData = new URLSearchParams();
    formData.append('title', title);
    formData.append('description', description);
    
    const result = await makeRequest<{ message: string; group_id: number }>('/api/groups/create', 'POST', formData);
    
    setLoading(false);
    
    if (result.success && result.data) {
      return { group_id: result.data.group_id };
    } else {
      setError(result.error || 'Failed to create group');
      return null;
    }
  }, [makeRequest]);

  // Get all groups for browsing
  const getAllGroups = useCallback(async (limit = 20, offset = 0): Promise<Group[]> => {
    const result = await makeRequest<Group[]>(`/api/groups?limit=${limit}&offset=${offset}`);
    
    if (result.success && result.data) {
      return result.data;
    }
    
    return [];
  }, [makeRequest]);

  // Get user's groups
  const getUserGroups = useCallback(async (): Promise<Group[]> => {
    const result = await makeRequest<Group[]>('/api/groups/user');
    
    if (result.success && result.data) {
      return result.data;
    }
    
    return [];
  }, [makeRequest]);

  // Get group details
  const getGroupDetails = useCallback(async (groupId: number): Promise<Group | null> => {
    const result = await makeRequest<Group>(`/api/groups/details?id=${groupId}`);
    
    if (result.success && result.data) {
      return result.data;
    }
    
    return null;
  }, [makeRequest]);

  // Invite user to group
  const inviteToGroup = useCallback(async (groupId: number, inviteeId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    const formData = new URLSearchParams();
    formData.append('group_id', groupId.toString());
    formData.append('invitee_id', inviteeId.toString());
    
    const result = await makeRequest<{ message: string }>('/api/groups/invite', 'POST', formData);
    
    setLoading(false);
    
    if (result.success) {
      return true;
    } else {
      setError(result.error || 'Failed to send invitation');
      return false;
    }
  }, [makeRequest]);

  // Request to join group
  const requestJoinGroup = useCallback(async (groupId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    const formData = new URLSearchParams();
    formData.append('group_id', groupId.toString());
    
    const result = await makeRequest<{ message: string }>('/api/groups/request', 'POST', formData);
    
    setLoading(false);
    
    if (result.success) {
      return true;
    } else {
      setError(result.error || 'Failed to send join request');
      return false;
    }
  }, [makeRequest]);

  // Handle invitation (accept/decline)
  const handleInvitation = useCallback(async (invitationId: number, action: 'accept' | 'decline'): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    const formData = new URLSearchParams();
    formData.append('invitation_id', invitationId.toString());
    formData.append('action', action);
    
    const result = await makeRequest<{ message: string }>('/api/groups/invitation/handle', 'POST', formData);
    
    setLoading(false);
    
    if (result.success) {
      return true;
    } else {
      setError(result.error || 'Failed to handle invitation');
      return false;
    }
  }, [makeRequest]);

  // Handle join request (accept/decline) - creator only
  const handleJoinRequest = useCallback(async (requestId: number, action: 'accept' | 'decline'): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    const formData = new URLSearchParams();
    formData.append('request_id', requestId.toString());
    formData.append('action', action);
    
    const result = await makeRequest<{ message: string }>('/api/groups/request/handle', 'POST', formData);
    
    setLoading(false);
    
    if (result.success) {
      return true;
    } else {
      setError(result.error || 'Failed to handle join request');
      return false;
    }
  }, [makeRequest]);

  // Leave group
  const leaveGroup = useCallback(async (groupId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    const formData = new URLSearchParams();
    formData.append('group_id', groupId.toString());
    
    const result = await makeRequest<{ message: string }>('/api/groups/leave', 'POST', formData);
    
    setLoading(false);
    
    if (result.success) {
      return true;
    } else {
      setError(result.error || 'Failed to leave group');
      return false;
    }
  }, [makeRequest]);

  // Get user's group invitations
  const getGroupInvitations = useCallback(async (): Promise<GroupInvitation[]> => {
    const result = await makeRequest<GroupInvitation[]>('/api/groups/invitations');
    
    if (result.success && result.data) {
      return result.data;
    }
    
    return [];
  }, [makeRequest]);

  // Get group join requests (for group creators)
  const getGroupJoinRequests = useCallback(async (): Promise<GroupJoinRequest[]> => {
    const result = await makeRequest<GroupJoinRequest[]>('/api/groups/requests');
    
    if (result.success && result.data) {
      return result.data;
    }
    
    return [];
  }, [makeRequest]);

  return {
    loading,
    error,
    createGroup,
    getAllGroups,
    getUserGroups,
    getGroupDetails,
    inviteToGroup,
    requestJoinGroup,
    handleInvitation,
    handleJoinRequest,
    leaveGroup,
    getGroupInvitations,
    getGroupJoinRequests,
  };
};