import { useState, useCallback } from "react";
import type { GroupEvent } from "../types/groups";

export const useGroupEvents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getGroupEvents = useCallback(async (groupId: number): Promise<GroupEvent[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/groups/events?group_id=${groupId}`);
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        setError(data.error || "Failed to fetch group events");
        return [];
      }
    } catch (err) {
      setError("An error occurred while fetching group events");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (
    groupId: number,
    title: string,
    description: string,
    eventDate: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new URLSearchParams();
      formData.append("group_id", groupId.toString());
      formData.append("title", title);
      formData.append("description", description);
      formData.append("event_date", eventDate);

      const response = await fetch("/api/groups/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        setError(data.error || "Failed to create event");
        return null;
      }
    } catch (err) {
      setError("An error occurred while creating the event");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const respondToEvent = useCallback(async (
    eventId: number,
    response: "going" | "not_going"
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new URLSearchParams();
      formData.append("event_id", eventId.toString());
      formData.append("response", response);

      const apiResponse = await fetch("/api/groups/events/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const data = await apiResponse.json();
      if (data.success) {
        return true;
      } else {
        setError(data.error || "Failed to respond to event");
        return false;
      }
    } catch (err) {
      setError("An error occurred while responding to the event");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getGroupEvents,
    createEvent,
    respondToEvent,
  };
};