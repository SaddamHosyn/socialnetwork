'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface NotificationBannerProps {
  onRequestsClick?: () => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ onRequestsClick }) => {
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await fetch('/api/follow/requests', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setPendingRequestsCount(data.follow_requests?.length || 0);
        }
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
    
    // Poll for updates every 5 seconds for faster updates
    const interval = setInterval(fetchPendingRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    if (onRequestsClick) {
      onRequestsClick();
    } else {
      // Navigate to profile with requests tab
      router.push('/?page=profile&tab=requests');
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  if (loading || pendingRequestsCount === 0 || dismissed) {
    return null;
  }

  return (
    <div className="notification-banner">
      <div className="notification-content">
        <span className="notification-icon">📬</span>
        <span className="notification-text">
          You have {pendingRequestsCount} pending follow request{pendingRequestsCount > 1 ? 's' : ''}
        </span>
        <button 
          className="notification-action-btn"
          onClick={handleClick}
        >
          View Requests
        </button>
        <button 
          className="notification-dismiss-btn"
          onClick={handleDismiss}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default NotificationBanner;
