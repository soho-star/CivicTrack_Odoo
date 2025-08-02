import { createClient } from '@supabase/supabase-js'
import type { Issue, User, Comment, StatusUpdate, IssueFilters, CreateIssueData } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jyojsiebibwbtfvguqfn.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5b2pzaWViaWJ3YnRmdmd1cWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTg0NzksImV4cCI6MjA2OTY5NDQ3OX0.sEzZz2xa04Uq2WqyxWWsyMgGvlawCHE1O6usHPBHcHk'

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key exists:', !!supabaseAnonKey)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// API Functions for Issues
export const issuesApi = {
  // Get issues within radius
  async getIssuesWithinRadius(
    lat: number,
    lng: number,
    radiusKm: number = 5,
    filters?: IssueFilters,
    page: number = 1,
    limit: number = 20
  ) {
    try {
      let query = supabase
        .from('issues')
        .select(`
          *,
          users:user_id (
            id,
            name,
            email,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters?.category) {
        query = query.eq('category', filters.category)
      }
      
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      const { data, error, count } = await query
        .range((page - 1) * limit, page * limit - 1)

      if (error) throw error

      // Calculate distances (simplified - in production use PostGIS)
      const issuesWithDistance = data?.map(issue => ({
        ...issue,
        distance_km: calculateDistance(lat, lng, issue.location.lat, issue.location.lng)
      })).filter(issue => issue.distance_km <= radiusKm) || []

      return {
        data: issuesWithDistance,
        count: count || 0,
        page,
        limit,
        total_pages: Math.ceil((count || 0) / limit)
      }
    } catch (error) {
      console.error('Error fetching issues:', error)
      throw error
    }
  },

  // Get single issue by ID
  async getIssueById(id: string) {
    try {
      const { data, error } = await supabase
        .from('issues')
        .select(`
          *,
          users:user_id (
            id,
            name,
            email,
            avatar_url
          ),
          comments (
            *,
            users:user_id (
              id,
              name,
              avatar_url
            )
          ),
          status_updates (
            *,
            users:updated_by (
              id,
              name
            )
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching issue:', error)
      throw error
    }
  },

  // Create new issue
  async createIssue(issueData: CreateIssueData) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Upload images first if any
      let imageUrls: string[] = []
      if (issueData.images && issueData.images.length > 0) {
        imageUrls = await uploadIssueImages(issueData.images)
      }

      const { data, error } = await supabase
        .from('issues')
        .insert({
          user_id: user.id,
          title: issueData.title,
          description: issueData.description,
          category: issueData.category,
          location: `POINT(${issueData.location.lng} ${issueData.location.lat})`,
          address: issueData.location.address || '',
          images: imageUrls,
          status: 'reported',
          upvotes: 0,
          downvotes: 0,
          priority_score: 0
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating issue:', error)
      throw error
    }
  },

  // Update issue status
  async updateIssueStatus(issueId: string, newStatus: Issue['status'], notes?: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Update issue status
      const { error: updateError } = await supabase
        .from('issues')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', issueId)

      if (updateError) throw updateError

      // Add status update record
      const { error: statusError } = await supabase
        .from('status_updates')
        .insert({
          issue_id: issueId,
          new_status: newStatus,
          updated_by: user.id,
          notes
        })

      if (statusError) throw statusError

      return true
    } catch (error) {
      console.error('Error updating issue status:', error)
      throw error
    }
  },

  // Vote on issue
  async voteOnIssue(issueId: string, voteType: 'upvote' | 'downvote') {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('issue_votes')
        .select('*')
        .eq('issue_id', issueId)
        .eq('user_id', user.id)
        .single()

      if (existingVote) {
        // Update existing vote
        const { error } = await supabase
          .from('issue_votes')
          .update({ vote_type: voteType })
          .eq('id', existingVote.id)
        
        if (error) throw error
      } else {
        // Create new vote
        const { error } = await supabase
          .from('issue_votes')
          .insert({
            issue_id: issueId,
            user_id: user.id,
            vote_type: voteType
          })
        
        if (error) throw error
      }

      // Update vote counts on issue
      await updateIssueVoteCounts(issueId)
      return true
    } catch (error) {
      console.error('Error voting on issue:', error)
      throw error
    }
  }
}

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Helper function to upload images
async function uploadIssueImages(images: File[]): Promise<string[]> {
  const urls: string[] = []
  
  for (const image of images) {
    const fileExt = image.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `issue-images/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, image)

    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      continue
    }

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    urls.push(data.publicUrl)
  }

  return urls
}

// Helper function to update vote counts
async function updateIssueVoteCounts(issueId: string) {
  const { data: votes } = await supabase
    .from('issue_votes')
    .select('vote_type')
    .eq('issue_id', issueId)

  const upvotes = votes?.filter(v => v.vote_type === 'upvote').length || 0
  const downvotes = votes?.filter(v => v.vote_type === 'downvote').length || 0

  await supabase
    .from('issues')
    .update({ upvotes, downvotes })
    .eq('id', issueId)
}