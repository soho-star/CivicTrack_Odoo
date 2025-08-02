import { supabase } from './supabase';
import { Issue, IssueFilters, PaginatedResponse } from '../types';

export const issuesApi = {
  async getIssuesWithinRadius(filters: IssueFilters, page = 1, limit = 20): Promise<PaginatedResponse<Issue>> {
    const { data, error } = await supabase.rpc('get_issues_within_radius', {
      center_lat: filters.location.lat,
      center_lng: filters.location.lng,
      radius_km: filters.radius_km,
      issue_status_filter: filters.status || null,
      issue_category_filter: filters.category || null,
      limit_count: limit,
      offset_count: (page - 1) * limit
    });

    if (error) throw error;

    return {
      data: data || [],
      pagination: {
        page,
        limit,
        total: data?.length || 0,
        total_pages: Math.ceil((data?.length || 0) / limit),
        has_next: data?.length === limit,
        has_prev: page > 1
      }
    };
  },

  async createIssue(issueData: any) {
    const { data, error } = await supabase
      .from('issues')
      .insert([issueData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getIssueById(id: string) {
    const { data, error } = await supabase
      .from('issues')
      .select(`
        *,
        users!issues_user_id_fkey(id, name, avatar_url),
        comments(
          *,
          users!comments_user_id_fkey(id, name, avatar_url, role)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
};