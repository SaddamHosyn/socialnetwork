'use client';

import React, { useEffect, useState } from 'react';
import { useToast } from '../hooks/useToast';

interface FollowRequest {
  id: number;
  requester_id: number;
  requestee_id: number;
  status: string;
  created_at: string;
  requester_nickname: string;
}

interface FollowRequestsListProps {
  onRequestUpdate?: () => void;
}

const FollowRequestsList: React.FC<FollowRequestsListProps> = ({ onRequestUpdate }) => {
  const [requests, setRequests] = useState<FollowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<number | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    fetchFollowRequests();
  }, []);

  const fetchFollowRequests = async () => {
    try {
      const response = await fetch('/api/follow/requests', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setRequests(data.follow_requests || []);
      } else {
        console.error('Failed to fetch follow requests');
      }
    } catch (error) {
      console.error('Error fetching follow requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (requestId: number, action: 'accept' | 'decline') => {
    if (responding) return;
    
    setResponding(requestId);
    
    try {
      const formData = new FormData();
      formData.append('request_id', requestId.toString());
      formData.append('action', action);

      const response = await fetch('/api/follow/requests/respond', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        // Remove the request from the list
        setRequests(prev => prev.filter(req => req.id !== requestId));
        addToast(`Follow request ${action}ed successfully`, 'success');
        onRequestUpdate?.();
      } else {
        const errorData = await response.json();
        addToast(errorData.message || `Failed to ${action} follow request`, 'error');
      }
    } catch (error) {
      console.error(`Error ${action}ing follow request:`, error);
      addToast(`Error ${action}ing follow request`, 'error');
    } finally {
      setResponding(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading follow requests...</div>;
  }

  if (requests.length === 0) {
    return (
      <div className="no-requests">
        <p>No pending follow requests</p>
      </div>
    );
  }

  return (
    <div className="follow-requests-list">
      <h3>Follow Requests</h3>
      {requests.map((request) => (
        <div key={request.id} className="follow-request-item">
          <div className="request-info">
            <span className="requester-name">{request.requester_nickname}</span>
            <span className="request-time">
              {new Date(request.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="request-actions">
            <button
              className="accept-btn"
              onClick={() => handleResponse(request.id, 'accept')}
              disabled={responding === request.id}
            >
              {responding === request.id ? 'Accepting...' : 'Accept'}
            </button>
            <button
              className="decline-btn"
              onClick={() => handleResponse(request.id, 'decline')}
              disabled={responding === request.id}
            >
              {responding === request.id ? 'Declining...' : 'Decline'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FollowRequestsList;
