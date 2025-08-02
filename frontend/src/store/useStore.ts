import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Issue, IssueFilters, User } from '../types';

interface AppState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;

  // Issues state  
  issues: Issue[];
  setIssues: (issues: Issue[]) => void;
  addIssue: (issue: Issue) => void;
  updateIssue: (id: string, updates: Partial<Issue>) => void;

  // Filters state
  filters: IssueFilters;
  setFilters: (filters: Partial<IssueFilters>) => void;

  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Notifications
  notifications: any[];
  addNotification: (notification: any) => void;
  removeNotification: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),

      // Issues state
      issues: [],
      setIssues: (issues) => set({ issues }),
      addIssue: (issue) => set((state) => ({ 
        issues: [issue, ...state.issues] 
      })),
      updateIssue: (id, updates) => set((state) => ({
        issues: state.issues.map(issue => 
          issue.id === id ? { ...issue, ...updates } : issue
        )
      })),

      // Filters state
      filters: {
        location: { lat: 40.7128, lng: -74.0060 },
        radius_km: 5,
        sort_by: 'distance',
        sort_order: 'asc'
      },
      setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
      })),

      // UI state
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Notifications
      notifications: [],
      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, { 
          ...notification, 
          id: Date.now().toString() 
        }]
      })),
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      }))
    }),
    {
      name: 'civictrack-storage',
      partialize: (state) => ({ 
        filters: state.filters,
        user: state.user 
      })
    }
  )
);