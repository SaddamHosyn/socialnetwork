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
        const errorMessage = errorData?.message || `Failed to request join: ${response.status}`;
        
        // Handle specific error cases
        if (response.status === 409) {
          if (errorMessage.includes('already requested')) {
            throw new Error('You have already requested to join this group');
          } else if (errorMessage.includes('already member')) {
            throw new Error('You are already a member of this group');
          } else {
            throw new Error('Cannot send join request - conflict detected');
          }
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request join';
      setError(errorMessage);
      throw err;
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

  // Method to get all groups (alias for fetchGroups)
  const getAllGroups = useCallback(async (limit = 20, offset = 0) => {
    try {
      const response = await fetch(`/api/groups?limit=${limit}&offset=${offset}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch groups: ${response.status}`);
      }

      const result = await response.json();
      
      // Handle the API response structure and return the groups array
      if (result.success) {
        return result.data || [];
      } else {
        // If it's an array directly, use it
        return Array.isArray(result) ? result : [];
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch groups';
      setError(errorMessage);
      return [];
    }
  }, []);

  // Method to get user-specific groups
  const getUserGroups = useCallback(async () => {
    try {
      const response = await fetch('/api/groups/user', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user groups: ${response.status}`);
      }

      const result = await response.json();
      
      // Handle the API response structure and return the groups array
      if (result.success) {
        return result.data || [];
      } else {
        // If it's an array directly, use it
        return Array.isArray(result) ? result : [];
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user groups';
      setError(errorMessage);
      return [];
    }
  }, []);

  // Method to get group join requests
  const getGroupJoinRequests = useCallback(async () => {
    try {
      const response = await fetch('/api/groups/requests', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch group join requests: ${response.status}`);
      }

      const result = await response.json();
      
      // Handle the API response structure and return the requests array
      if (result.success) {
        return result.data || [];
      } else {
        // If it's an array directly, use it
        return Array.isArray(result) ? result : [];
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch group join requests';
      setError(errorMessage);
      return [];
    }
  }, []);

  // Method to handle group join requests (accept/decline)
  const handleJoinRequest = useCallback(async (requestId: number, action: 'accept' | 'decline') => {
    setLoading(true);
    setError(null);

    try {
      const formData = new URLSearchParams();
      formData.append('request_id', requestId.toString());
      formData.append('action', action);

      const response = await fetch('/api/groups/request/handle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `Failed to ${action} request: ${response.status}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to ${action} request`;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    groups,
    loading,
    error,
    createGroup,
    fetchGroups,
    getAllGroups,
    getUserGroups,
    getGroupJoinRequests,
    handleJoinRequest,
    requestJoinGroup,
    leaveGroup,
  };
};
