// hooks/useGroupEvents.ts
import { useState, useCallback } from 'react';
import type { GroupEvent } from '../types/groups';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const useGroupEvents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = useCallback(async <T>(url: string, method = 'GET', body?: URLSearchParams): Promise<ApiResponse<T>> => {
    const options: RequestInit = {
      method,
      credentials: 'include',
    };
    
    if (body) {
      options.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
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

  // Create a new event
  const createEvent = useCallback(async (
    groupId: number,
    title: string,
    description: string,
    eventDate: string
  ): Promise<{ event_id: number } | null> => {
    setLoading(true);
    setError(null);
    
    const formData = new URLSearchParams();
    formData.append('group_id', groupId.toString());
    formData.append('title', title);
    formData.append('description', description);
    formData.append('event_date', eventDate);
    
    const result = await makeRequest<{ message: string; event_id: number }>('/api/groups/events/create', 'POST', formData);
    
    setLoading(false);
    
    if (result.success && result.data) {
      return { event_id: result.data.event_id };
    } else {
      setError(result.error || 'Failed to create event');
      return null;
    }
  }, [makeRequest]);

  // Get group events
  const getGroupEvents = useCallback(async (groupId: number): Promise<GroupEvent[]> => {
    const result = await makeRequest<GroupEvent[]>(`/api/groups/events?group_id=${groupId}`);
    
    if (result.success && result.data) {
      return result.data;
    }
    
    return [];
  }, [makeRequest]);

  // Respond to event
  const respondToEvent = useCallback(async (eventId: number, response: 'going' | 'not_going'): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    const formData = new URLSearchParams();
    formData.append('event_id', eventId.toString());
    formData.append('response', response);
    
    const result = await makeRequest<{ message: string }>('/api/groups/events/respond', 'POST', formData);
    
    setLoading(false);
    
    if (result.success) {
      return true;
    } else {
      setError(result.error || 'Failed to respond to event');
      return false;
    }
  }, [makeRequest]);

  // Get event details
  const getEventDetails = useCallback(async (eventId: number): Promise<GroupEvent | null> => {
    const result = await makeRequest<GroupEvent>(`/api/groups/events/details?event_id=${eventId}`);
    
    if (result.success && result.data) {
      return result.data;
    }
    
    return null;
  }, [makeRequest]);

  return {
    loading,
    error,
    createEvent,
    getGroupEvents,
    respondToEvent,
    getEventDetails,
  };
};