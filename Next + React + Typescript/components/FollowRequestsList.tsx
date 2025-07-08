import React, { useState, useEffect } from 'react';
import { useFollower } from '../hooks/useFollower';
import { useToast } from '../hooks/useToast';
import type { FollowRequest } from '../types/types';

interface FollowRequestsListProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestResponded?: () => void;
}

export const FollowRequestsList: React.FC<FollowRequestsListProps> = ({
  isOpen,
  onClose,
  onRequestResponded
}) => {
  const [requests, setRequests] = useState<FollowRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const { getFollowRequests, respondToFollowRequest } = useFollower();
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadRequests();
    }
  }, [isOpen]);

  const loadRequests = async () => {
    setLoading(true);
    const fetchedRequests = await getFollowRequests();
    setRequests(fetchedRequests);
    setLoading(false);
  };

  const handleRequestResponse = async (requestId: number, action: 'accept' | 'decline') => {
    const result = await respondToFollowRequest(requestId, action);
    if (result) {
      addToast(result.message, 'success');
      setRequests(prev => prev.filter(req => req.id !== requestId));
      onRequestResponded?.();
    } else {
      addToast(`Failed to ${action} request`, 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="follow-requests-container">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Follow Requests</h3>
            <button className="close-btn" onClick={onClose}>&times;</button>
          </div>
          
          <div className="modal-body">
            {loading ? (
              <div className="loading">Loading requests...</div>
            ) : requests.length === 0 ? (
              <div className="no-requests">No pending follow requests</div>
            ) : (
              <div className="requests-list">
                {requests.map(request => (
                  <div key={request.id} className="request-item">
                    <div className="request-info">
                      <div className="requester-name">{request.requester_nickname}</div>
                      <div className="request-date">
                        {new Date(request.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="request-actions">
                      <button
                        className="accept-btn"
                        onClick={() => handleRequestResponse(request.id, 'accept')}
                      >
                        Accept
                      </button>
                      <button
                        className="decline-btn"
                        onClick={() => handleRequestResponse(request.id, 'decline')}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
