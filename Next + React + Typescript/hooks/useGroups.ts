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

  return {
    groups,
    loading,
    error,
    createGroup,
    fetchGroups,
  };
};