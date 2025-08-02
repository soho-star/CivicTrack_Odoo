import { supabase } from './supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();

  subscribeToIssues(callback: (payload: any) => void) {
    const channel = supabase
      .channel('issues')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'issues' }, 
        callback
      )
      .subscribe();

    this.channels.set('issues', channel);
    return channel;
  }

  subscribeToComments(issueId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`comments-${issueId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'comments',
          filter: `issue_id=eq.${issueId}`
        }, 
        callback
      )
      .subscribe();

    this.channels.set(`comments-${issueId}`, channel);
    return channel;
  }

  subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`notifications-${userId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        }, 
        callback
      )
      .subscribe();

    this.channels.set(`notifications-${userId}`, channel);
    return channel;
  }

  unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }
  }

  unsubscribeAll() {
    this.channels.forEach((channel, name) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }
}

export const realtimeService = new RealtimeService();