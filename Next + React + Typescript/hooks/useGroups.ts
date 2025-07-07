import { useState, useCallback } from "react";
import type { Group, GroupInvitation, GroupJoinRequest } from "../types/groups";

export const useGroups = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllGroups = useCallback(async (): Promise<Group[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/groups");
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        setError(data.error || "Failed to fetch groups");
        return [];
      }
    } catch (err) {
      setError("An error occurred while fetching groups");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserGroups = useCallback(async (): Promise<Group[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/groups/my-groups");
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        setError(data.error || "Failed to fetch user groups");
        return [];
      }
    } catch (err) {
      setError("An error occurred while fetching user groups");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getGroupDetails = useCallback(async (groupId: number): Promise<Group | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/groups/${groupId}`);
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        setError(data.error || "Failed to fetch group details");
        return null;
      }
    } catch (err) {
      setError("An error occurred while fetching group details");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createGroup = useCallback(async (title: string, description: string) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      const response = await fetch("/api/groups", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        setError(data.error || "Failed to create group");
        return null;
      }
    } catch (err) {
      setError("An error occurred while creating the group");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const requestJoinGroup = useCallback(async (groupId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new URLSearchParams();
      formData.append("group_id", groupId.toString());

      const response = await fetch("/api/groups/request-join", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        return true;
      } else {
        setError(data.error || "Failed to request join group");
        return false;
      }
    } catch (err) {
      setError("An error occurred while requesting to join the group");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const leaveGroup = useCallback(async (groupId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new URLSearchParams();
      formData.append("group_id", groupId.toString());

      const response = await fetch("/api/groups/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        return true;
      } else {
        setError(data.error || "Failed to leave group");
        return false;
      }
    } catch (err) {
      setError("An error occurred while leaving the group");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getGroupInvitations = useCallback(async (): Promise<GroupInvitation[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/groups/invitations");
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        setError(data.error || "Failed to fetch invitations");
        return [];
      }
    } catch (err) {
      setError("An error occurred while fetching invitations");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInvitation = useCallback(async (invitationId: number, action: "accept" | "decline"): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new URLSearchParams();
      formData.append("invitation_id", invitationId.toString());
      formData.append("action", action);

      const response = await fetch("/api/groups/invitations/handle", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        return true;
      } else {
        setError(data.error || "Failed to handle invitation");
        return false;
      }
    } catch (err) {
      setError("An error occurred while handling the invitation");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getGroupJoinRequests = useCallback(async (): Promise<GroupJoinRequest[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/groups/join-requests");
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        setError(data.error || "Failed to fetch join requests");
        return [];
      }
    } catch (err) {
      setError("An error occurred while fetching join requests");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const handleJoinRequest = useCallback(async (requestId: number, action: "accept" | "decline"): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new URLSearchParams();
      formData.append("request_id", requestId.toString());
      formData.append("action", action);

      const response = await fetch("/api/groups/join-requests/handle", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        return true;
      } else {
        setError(data.error || "Failed to handle join request");
        return false;
      }
    } catch (err) {
      setError("An error occurred while handling the join request");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getAllGroups,
    getUserGroups,
    getGroupDetails,
    createGroup,
    requestJoinGroup,
    leaveGroup,
    getGroupInvitations,
    handleInvitation,
    getGroupJoinRequests,
    handleJoinRequest,
  };
};