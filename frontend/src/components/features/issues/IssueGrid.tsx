import React from 'react';
import { IssueCard } from './IssueCard';
import type { Issue } from '../../../types';

interface IssueGridProps {
  issues: Issue[];
  loading?: boolean;
  onVote?: (issueId: string, voteType: 'upvote' | 'downvote') => void;
  showVoting?: boolean;
  emptyMessage?: string;
  className?: string;
}

export const IssueGrid: React.FC<IssueGridProps> = ({
  issues,
  loading = false,
  onVote,
  showVoting = true,
  emptyMessage = "No issues found in this area.",
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
              {/* Image skeleton */}
              <div className="h-48 bg-gray-700"></div>
              
              {/* Content skeleton */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-5 bg-gray-700 rounded w-16"></div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-700 rounded-full mr-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-20"></div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-4 bg-gray-700 rounded w-8"></div>
                    <div className="h-4 bg-gray-700 rounded w-8"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="max-w-md mx-auto">
          <svg
            className="w-24 h-24 text-gray-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-xl font-medium text-gray-400 mb-2">No Issues Found</h3>
          <p className="text-gray-500 mb-6">{emptyMessage}</p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>Try adjusting your filters or search in a different area.</p>
            <p>Be the first to report an issue in this location!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {issues.map((issue) => (
        <IssueCard
          key={issue.id}
          issue={issue}
          onVote={onVote}
          showVoting={showVoting}
        />
      ))}
    </div>
  );
};