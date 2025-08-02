import React from 'react';
import { Link } from 'react-router-dom';
import type { Issue } from '../../../types';

interface IssueCardProps {
  issue: Issue;
  onVote?: (issueId: string, voteType: 'upvote' | 'downvote') => void;
  showVoting?: boolean;
  className?: string;
}

export const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  onVote,
  showVoting = true,
  className = ''
}) => {
  const getStatusColor = (status: Issue['status']) => {
    switch (status) {
      case 'reported':
        return 'bg-red-500';
      case 'in_progress':
        return 'bg-yellow-500';
      case 'resolved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: Issue['category']) => {
    switch (category) {
      case 'severe':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'mild':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 24 * 7) {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleVote = (voteType: 'upvote' | 'downvote', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onVote) {
      onVote(issue.id, voteType);
    }
  };

  return (
    <Link to={`/issues/${issue.id}`} className={`block ${className}`}>
      <div className="bg-black/30 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl border border-white/10 hover:border-white/20 transition-all duration-200 hover:scale-[1.02]">
        {/* Image Section */}
        <div className="h-48 bg-gray-700 relative overflow-hidden">
          {issue.images && issue.images.length > 0 ? (
            <img
              src={issue.images[0]}
              alt={issue.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span className={`${getStatusColor(issue.status)} text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg`}>
              {issue.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          
          {/* Date Badge */}
          <div className="absolute top-3 right-3">
            <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {formatDate(issue.created_at)}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Title and Category */}
          <div className="mb-3">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-white font-semibold text-lg line-clamp-2 flex-1">
                {issue.title}
              </h3>
              <span className={`ml-2 px-2 py-1 text-xs rounded-full border ${getCategoryColor(issue.category)} flex-shrink-0`}>
                {issue.category.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
            {issue.description}
          </p>

          {/* Location */}
          <div className="flex items-center text-gray-400 text-sm mb-4">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="flex-1 truncate">{issue.address}</span>
            {issue.distance_km && (
              <span className="ml-2 font-medium text-blue-400">
                {issue.distance_km.toFixed(1)}km
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* User Info */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-2">
                {issue.user?.avatar_url ? (
                  <img
                    src={issue.user.avatar_url}
                    alt={issue.user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm font-medium">
                    {issue.user?.name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <span className="text-gray-400 text-sm">
                {issue.user?.name || 'Anonymous'}
              </span>
            </div>

            {/* Voting */}
            {showVoting && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={(e) => handleVote('upvote', e)}
                  className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span className="text-sm">{issue.upvotes}</span>
                </button>
                
                <button
                  onClick={(e) => handleVote('downvote', e)}
                  className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10H9a2 2 0 00-2 2v6a2 2 0 002 2h2.5" />
                  </svg>
                  <span className="text-sm">{issue.downvotes}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};