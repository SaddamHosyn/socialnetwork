// useGroups.ts
import { useState, useCallback } from 'react';

interface Group {
  id: string;
  name: string;
  description?: string;
  // Add other group properties as needed
}

interface CreateGroupData {
  name: string;
  description?: string;
  // Add other properties as needed
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
      // Add other fields as needed

      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create group: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      
      // Refresh groups list or add the new group to the state
      // You might want to call fetchGroups() here or add the new group to the state
      
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
      const response = await fetch(`/api/groups?limit=${limit}&offset=${offset}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch groups: ${response.status}`);
      }

      const result = await response.json();
      setGroups(result.groups || result); // Adjust based on your API response structure
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