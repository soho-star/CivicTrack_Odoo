import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../utils/constants';

// Create Supabase client
export const supabase = createClient(
  SUPABASE_CONFIG.URL,
  SUPABASE_CONFIG.ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Type definitions for database tables (will be auto-generated later)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          phone?: string;
          avatar_url?: string;
          role: 'citizen' | 'admin' | 'authority';
          is_verified: boolean;
          location?: any; // PostGIS geometry
          address?: string;
          created_at: string;
          updated_at: string;
          last_login?: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          phone?: string;
          avatar_url?: string;
          role?: 'citizen' | 'admin' | 'authority';
          is_verified?: boolean;
          location?: any;
          address?: string;
          created_at?: string;
          updated_at?: string;
          last_login?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          phone?: string;
          avatar_url?: string;
          role?: 'citizen' | 'admin' | 'authority';
          is_verified?: boolean;
          location?: any;
          address?: string;
          created_at?: string;
          updated_at?: string;
          last_login?: string;
        };
      };
      issues: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          category: 'severe' | 'mild' | 'low';
          status: 'reported' | 'in_progress' | 'resolved' | 'rejected';
          location: any; // PostGIS geometry
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
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          category: 'severe' | 'mild' | 'low';
          status?: 'reported' | 'in_progress' | 'resolved' | 'rejected';
          location: any;
          address: string;
          images?: string[];
          upvotes?: number;
          downvotes?: number;
          priority_score?: number;
          assigned_to?: string;
          estimated_resolution?: string;
          resolved_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          category?: 'severe' | 'mild' | 'low';
          status?: 'reported' | 'in_progress' | 'resolved' | 'rejected';
          location?: any;
          address?: string;
          images?: string[];
          upvotes?: number;
          downvotes?: number;
          priority_score?: number;
          assigned_to?: string;
          estimated_resolution?: string;
          resolved_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          issue_id: string;
          user_id: string;
          content: string;
          is_official: boolean;
          parent_id?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          issue_id: string;
          user_id: string;
          content: string;
          is_official?: boolean;
          parent_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          issue_id?: string;
          user_id?: string;
          content?: string;
          is_official?: boolean;
          parent_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          issue_id?: string;
          type: string;
          title: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          issue_id?: string;
          type: string;
          title: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          issue_id?: string;
          type?: string;
          title?: string;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_issues_within_radius: {
        Args: {
          center_lat: number;
          center_lng: number;
          radius_km?: number;
          issue_status_filter?: 'reported' | 'in_progress' | 'resolved' | 'rejected';
          issue_category_filter?: 'severe' | 'mild' | 'low';
          limit_count?: number;
          offset_count?: number;
        };
        Returns: {
          id: string;
          title: string;
          description: string;
          category: 'severe' | 'mild' | 'low';
          status: 'reported' | 'in_progress' | 'resolved' | 'rejected';
          images: string[];
          distance_km: number;
          upvotes: number;
          downvotes: number;
          created_at: string;
          user_name: string;
        }[];
      };
    };
    Enums: {
      user_role: 'citizen' | 'admin' | 'authority';
      issue_category: 'severe' | 'mild' | 'low';
      issue_status: 'reported' | 'in_progress' | 'resolved' | 'rejected';
    };
  };
};

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.error_description) {
    return error.error_description;
  }
  
  return 'An unexpected error occurred';
};

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper function to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export default supabase;