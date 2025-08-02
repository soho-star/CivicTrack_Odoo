import { Link } from 'react-router-dom';
import { Issue } from '../../../types';
import { Badge, Card } from '../../ui';

interface IssueCardProps {
  issue: Issue;
}

const IssueCard = ({ issue }: IssueCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        {issue.images[0] && (
          <img
            src={issue.images[0]}
            alt={issue.title}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <Badge variant={issue.category}>{issue.category}</Badge>
            <Badge variant={issue.status}>{issue.status}</Badge>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
            {issue.title}
          </h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {issue.description}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{issue.address}</span>
            {issue.distance_km && (
              <span>{issue.distance_km.toFixed(1)}km away</span>
            )}
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>👍 {issue.upvotes}</span>
              <span>👎 {issue.downvotes}</span>
            </div>
            <Link
              to={`/issue/${issue.id}`}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default IssueCard;