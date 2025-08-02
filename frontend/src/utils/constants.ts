// Application constants

export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'CivicTrack',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
} as const;

export const SUPABASE_CONFIG = {
  URL: import.meta.env.VITE_SUPABASE_URL || '',
  ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
} as const;

export const MAP_CONFIG = {
  DEFAULT_LAT: Number(import.meta.env.VITE_DEFAULT_LAT) || 40.7128,
  DEFAULT_LNG: Number(import.meta.env.VITE_DEFAULT_LNG) || -74.0060,
  DEFAULT_ZOOM: Number(import.meta.env.VITE_DEFAULT_ZOOM) || 13,
  MAX_RADIUS_KM: Number(import.meta.env.VITE_MAX_RADIUS_KM) || 10,
  TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
} as const;

export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE_MB: Number(import.meta.env.VITE_MAX_FILE_SIZE_MB) || 5,
  MAX_IMAGES_PER_ISSUE: Number(import.meta.env.VITE_MAX_IMAGES_PER_ISSUE) || 5,
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  STORAGE_BUCKET: 'issue-images',
} as const;

export const FEATURE_FLAGS = {
  ENABLE_NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
  ENABLE_GEOLOCATION: import.meta.env.VITE_ENABLE_GEOLOCATION === 'true',
  ENABLE_PWA: import.meta.env.VITE_ENABLE_PWA === 'true',
} as const;

export const ISSUE_CATEGORIES = {
  severe: {
    label: 'Severe',
    description: 'Emergency/safety issues requiring immediate attention',
    color: 'danger',
    priority: 3,
  },
  mild: {
    label: 'Mild',
    description: 'Non-urgent but important community concerns',
    color: 'warning',
    priority: 2,
  },
  low: {
    label: 'Low',
    description: 'Minor issues for future consideration',
    color: 'secondary',
    priority: 1,
  },
} as const;

export const ISSUE_STATUSES = {
  reported: {
    label: 'Reported',
    description: 'Issue has been reported and is awaiting review',
    color: 'blue',
  },
  in_progress: {
    label: 'In Progress',
    description: 'Issue is being actively worked on',
    color: 'yellow',
  },
  resolved: {
    label: 'Resolved',
    description: 'Issue has been successfully resolved',
    color: 'green',
  },
  rejected: {
    label: 'Rejected',
    description: 'Issue was reviewed and rejected',
    color: 'red',
  },
} as const;

export const RADIUS_OPTIONS = [
  { value: 1, label: '1 km' },
  { value: 3, label: '3 km' },
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
] as const;

export const SORT_OPTIONS = [
  { value: 'distance', label: 'Distance' },
  { value: 'created_at', label: 'Newest First' },
  { value: 'priority', label: 'Priority' },
  { value: 'upvotes', label: 'Most Voted' },
] as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const NOTIFICATION_TYPES = {
  STATUS_UPDATE: 'status_update',
  NEW_COMMENT: 'new_comment',
  ISSUE_RESOLVED: 'issue_resolved',
  ISSUE_ASSIGNED: 'issue_assigned',
  VOTE_RECEIVED: 'vote_received',
} as const;

export const LOCAL_STORAGE_KEYS = {
  USER_LOCATION: 'civictrack_user_location',
  FILTERS: 'civictrack_filters',
  THEME: 'civictrack_theme',
  ONBOARDING_COMPLETED: 'civictrack_onboarding',
} as const;

export const API_ENDPOINTS = {
  ISSUES: '/issues',
  USERS: '/users',
  COMMENTS: '/comments',
  NOTIFICATIONS: '/notifications',
  UPLOAD: '/upload',
  GEOCODE: '/geocode',
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UPLOAD_ERROR: 'Failed to upload file. Please try again.',
  LOCATION_ERROR: 'Unable to get your location. Please enable location services.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
} as const;

export const SUCCESS_MESSAGES = {
  ISSUE_CREATED: 'Issue reported successfully!',
  ISSUE_UPDATED: 'Issue updated successfully!',
  COMMENT_ADDED: 'Comment added successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  VOTE_RECORDED: 'Your vote has been recorded!',
  BOOKMARK_ADDED: 'Issue bookmarked successfully!',
  BOOKMARK_REMOVED: 'Bookmark removed successfully!',
} as const;

export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD_MIN_LENGTH: 8,
  TITLE_MIN_LENGTH: 10,
  TITLE_MAX_LENGTH: 255,
  DESCRIPTION_MIN_LENGTH: 20,
  DESCRIPTION_MAX_LENGTH: 2000,
  COMMENT_MIN_LENGTH: 5,
  COMMENT_MAX_LENGTH: 1000,
} as const;

export const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 300000, // 5 minutes
} as const;

export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  FILTER: 500,
  RESIZE: 100,
} as const;