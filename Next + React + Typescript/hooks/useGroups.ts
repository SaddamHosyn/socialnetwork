// useGroups.ts
import { useState, useCallback } from 'react';
import { Group } from '../types/groups';

interface CreateGroupData {
  name: string;
  description?: string;
}

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createGroup = useCallback(async (groupData: CreateGroupData) => {
    setLoading(true);
    setError(null);

    try {
      // Convert the data to URL-encoded format
      const formData = new URLSearchParams();
      formData.append('title', groupData.name);
      if (groupData.description) {
        formData.append('description', groupData.description);
      }

      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `Failed to create group: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create group';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGroups = useCallback(async (limit = 20, offset = 0) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/groups?limit=${limit}&offset=${offset}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch groups: ${response.status}`);
      }

      const result = await response.json();
      
      // Handle the API response structure
      if (result.success) {
        setGroups(result.data || []);
      } else {
        // If it's an array directly, use it
        setGroups(Array.isArray(result) ? result : []);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch groups';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const requestJoinGroup = useCallback(async (groupId: number) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new URLSearchParams();
      formData.append('group_id', groupId.toString());

      const response = await fetch('/api/groups/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || errorData?.message || `Failed to request join: ${response.status}`;
        
        console.log('Join request failed:', { status: response.status, errorData, errorMessage });
        
        // Handle specific error cases
        if (response.status === 409) {
          if (errorMessage.includes('already requested')) {
            setError('You have already requested to join this group');
            // Update state to reflect pending request
            setGroups(prevGroups => 
              prevGroups.map(group => 
                group.id === groupId 
                  ? { ...group, has_pending_request: true }
                  : group
              )
            );
            return { success: false, message: 'You have already requested to join this group' };
          } else if (errorMessage.includes('already member')) {
            setError('You are already a member of this group');
            // Update state to reflect membership
            setGroups(prevGroups => 
              prevGroups.map(group => 
                group.id === groupId 
                  ? { ...group, is_member: true, has_pending_request: false }
                  : group
              )
            );
            return { success: false, message: 'You are already a member of this group' };
          } else {
            setError('Cannot send join request - conflict detected');
            return { success: false, message: errorMessage || 'Cannot send join request - conflict detected' };
          }
        }
        
        setError(errorMessage);
        return { success: false, message: errorMessage };
      }

      const result = await response.json();
      
      // Update the group's status in the local state after successful join request
      setGroups(prevGroups => 
        prevGroups.map(group => 
          group.id === groupId 
            ? { ...group, has_pending_request: true }
            : group
        )
      );
      
      return result;
    } catch (err) {
      // If it's a network error or JSON parsing error, handle it
      if (err instanceof Error && !err.message.includes('already')) {
        const errorMessage = err.message;
        setError(errorMessage);
        return { success: false, message: errorMessage };
      }
      // For other errors that we've already handled above, just return the error response
      return { success: false, message: err instanceof Error ? err.message : 'Failed to request join' };
    } finally {
      setLoading(false);
    }
  }, []);

  const leaveGroup = useCallback(async (groupId: number) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new URLSearchParams();
      formData.append('group_id', groupId.toString());

      const response = await fetch('/api/groups/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `Failed to leave group: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to leave group';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getGroupInvitations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/groups/invitations', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `Failed to fetch invitations: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result.data || result || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch invitations';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getGroupJoinRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/groups/join-requests', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `Failed to fetch join requests: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result.data || result || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch join requests';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInvitation = useCallback(async (invitationId: number, action: "accept" | "decline") => {
    setLoading(true);
    setError(null);

    try {
      const formData = new URLSearchParams();
      formData.append('invitation_id', invitationId.toString());
      formData.append('action', action);

      const response = await fetch('/api/groups/invitation/handle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `Failed to handle invitation: ${response.status}`;
        throw new Error(errorMessage);
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to handle invitation';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleJoinRequest = useCallback(async (requestId: number, action: "accept" | "decline") => {
    setLoading(true);
    setError(null);

    try {
      const formData = new URLSearchParams();
      formData.append('request_id', requestId.toString());
      formData.append('action', action);

      const response = await fetch('/api/groups/handle-join-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `Failed to handle join request: ${response.status}`;
        throw new Error(errorMessage);
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to handle join request';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const inviteToGroup = useCallback(async (groupId: number, userId: number) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new URLSearchParams();
      formData.append('group_id', groupId.toString());
      formData.append('invitee_id', userId.toString());

      const response = await fetch('/api/groups/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || errorData?.message || `Failed to send invitation: ${response.status}`;
        
        // Handle specific error cases
        if (response.status === 409) {
          if (errorMessage.includes('already invited')) {
            setError('User has already been invited to this group');
            return { success: false, message: 'User has already been invited to this group' };
          } else if (errorMessage.includes('already member')) {
            setError('User is already a member of this group');
            return { success: false, message: 'User is already a member of this group' };
          }
        }
        
        setError(errorMessage);
        return { success: false, message: errorMessage };
      }

      const result = await response.json();
      return { success: true, message: result.message || 'Invitation sent successfully' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send invitation';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Group Chat Functions
  const sendGroupMessage = useCallback(async (groupId: number, content: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/groups/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          group_id: groupId,
          content: content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `Failed to send message: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getGroupMessages = useCallback(async (groupId: number, limit = 50, offset = 0) => {
    setLoading(true);
    setError(null);

    try {
      const url = new URL('/api/groups/chat/messages', window.location.origin);
      url.searchParams.append('group_id', groupId.toString());
      url.searchParams.append('limit', limit.toString());
      url.searchParams.append('offset', offset.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `Failed to fetch messages: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch messages';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getLatestGroupMessage = useCallback(async (groupId: number) => {
    try {
      const url = new URL('/api/groups/chat/latest', window.location.origin);
      url.searchParams.append('group_id', groupId.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // No messages yet
        }
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `Failed to fetch latest message: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch latest message';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return {
    groups,
    loading,
    error,
    createGroup,
    fetchGroups,
    requestJoinGroup,
    leaveGroup,
    inviteToGroup,
    getGroupInvitations,
    getGroupJoinRequests,
    handleInvitation,
    handleJoinRequest,
    // Group chat functions
    sendGroupMessage,
    getGroupMessages,
    getLatestGroupMessage,
  };
};