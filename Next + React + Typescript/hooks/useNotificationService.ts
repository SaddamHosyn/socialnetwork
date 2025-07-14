import { useCallback } from 'react';
import { useToast } from './useToast';

export const useNotificationService = () => {
  const { addToast } = useToast();

  // Send notification when a follow request is sent to a private profile
  const sendFollowRequestNotification = useCallback(async (targetUserId: number) => {
    try {
      const response = await fetch('/api/notifications/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: 'follow_request',
          recipient_id: targetUserId,
          requires_action: true
        })
      });

      if (response.ok) {
        addToast('Follow request sent successfully', 'success');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error sending follow request notification:', error);
      return false;
    }
  }, [addToast]);

  // Send notification when a group invitation is sent
  const sendGroupInvitationNotification = useCallback(async (
    invitedUserId: number,
    groupId: number,
    groupName: string
  ) => {
    try {
      const response = await fetch('/api/notifications/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: 'group_invitation',
          recipient_id: invitedUserId,
          group_id: groupId,
          group_name: groupName,
          requires_action: true
        })
      });

      if (response.ok) {
        addToast('Group invitation sent successfully', 'success');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error sending group invitation notification:', error);
      return false;
    }
  }, [addToast]);

  // Send notification when someone requests to join a group
  const sendGroupJoinRequestNotification = useCallback(async (
    groupCreatorId: number,
    groupId: number,
    groupName: string
  ) => {
    try {
      const response = await fetch('/api/notifications/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: 'group_join_request',
          recipient_id: groupCreatorId,
          group_id: groupId,
          group_name: groupName,
          requires_action: true
        })
      });

      if (response.ok) {
        addToast('Join request sent successfully', 'success');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error sending group join request notification:', error);
      return false;
    }
  }, [addToast]);

  // Send notification when a group event is created
  const sendGroupEventNotification = useCallback(async (
    groupId: number,
    groupName: string,
    eventId: number,
    eventTitle: string
  ) => {
    try {
      const response = await fetch('/api/notifications/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: 'group_event',
          group_id: groupId,
          group_name: groupName,
          event_id: eventId,
          event_title: eventTitle,
          requires_action: false
        })
      });

      if (response.ok) {
        addToast('Event notification sent to group members', 'success');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error sending group event notification:', error);
      return false;
    }
  }, [addToast]);

  return {
    sendFollowRequestNotification,
    sendGroupInvitationNotification,
    sendGroupJoinRequestNotification,
    sendGroupEventNotification,
  };
};
