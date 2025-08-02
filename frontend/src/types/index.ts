// Core types for CivicTrack application

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'citizen' | 'admin' | 'authority';
  is_verified: boolean;
  location?: {
    lat: number;
    lng: number;
  };
  address?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface Issue {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: 'severe' | 'mild' | 'low';
  status: 'reported' | 'in_progress' | 'resolved' | 'rejected';
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  images?: string[];
  upvotes: number;
  downvotes: number;
  priority_score: number;
  assigned_to?: string;
  estimated_resolution?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  distance_km?: number;
}

export interface Comment {
  id: string;
  issue_id: string;
  user_id: string;
  content: string;
  is_official: boolean;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface StatusUpdate {
  id: string;
  issue_id: string;
  old_status?: Issue['status'];
  new_status: Issue['status'];
  updated_by: string;
  notes?: string;
  created_at: string;
  user?: User;
}

export interface IssueVote {
  id: string;
  issue_id: string;
  user_id: string;
  vote_type: 'upvote' | 'downvote';
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  issue_id?: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface IssueFilters {
  category?: Issue['category'];
  status?: Issue['status'];
  radius_km?: number;
  search?: string;
}

export interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

export interface CreateIssueData {
  title: string;
  description: string;
  category: Issue['category'];
  location: LocationData;
  images?: File[];
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}