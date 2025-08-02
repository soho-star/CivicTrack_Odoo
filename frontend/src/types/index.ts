// Common types used throughout the application

export type UserRole = 'citizen' | 'admin' | 'authority';

export type IssueCategory = 'severe' | 'mild' | 'low';

export type IssueStatus = 'reported' | 'in_progress' | 'resolved' | 'rejected';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
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
  category: IssueCategory;
  status: IssueStatus;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  images: string[];
  upvotes: number;
  downvotes: number;
  priority_score: number;
  assigned_to?: string;
  estimated_resolution?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
  user?: Pick<User, 'id' | 'name' | 'avatar_url'>;
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
  user?: Pick<User, 'id' | 'name' | 'avatar_url' | 'role'>;
  replies?: Comment[];
}

export interface StatusUpdate {
  id: string;
  issue_id: string;
  old_status?: IssueStatus;
  new_status: IssueStatus;
  updated_by: string;
  notes?: string;
  created_at: string;
  user?: Pick<User, 'id' | 'name' | 'role'>;
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
  issue?: Pick<Issue, 'id' | 'title'>;
}

export interface IssueVote {
  id: string;
  issue_id: string;
  user_id: string;
  vote_type: 'upvote' | 'downvote';
  created_at: string;
}

export interface IssueFilters {
  category?: IssueCategory;
  status?: IssueStatus;
  radius_km: number;
  location: {
    lat: number;
    lng: number;
  };
  search?: string;
  sort_by?: 'distance' | 'created_at' | 'priority' | 'upvotes';
  sort_order?: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface ApiResponse<T = any> {
  data: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface IssueFormData {
  title: string;
  description: string;
  category: IssueCategory;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  images: File[];
}

export interface CommentFormData {
  content: string;
  parent_id?: string;
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface ModalState {
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
  onClose?: () => void;
}

// Geolocation types
export interface GeolocationCoords {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface GeolocationError {
  code: number;
  message: string;
}

// Map types
export interface MapViewport {
  center: [number, number];
  zoom: number;
}

export interface MarkerData extends Issue {
  position: [number, number];
}

// File upload types
export interface UploadedFile {
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  url?: string;
  error?: string;
}