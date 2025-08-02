import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true
  })

  useEffect(() => {
    let mounted = true

    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
        }
        if (mounted) {
          setAuthState({
            user: session?.user ?? null,
            session,
            loading: false
          })
        }
      } catch (error) {
        console.error('Error in getSession:', error)
        if (mounted) {
          setAuthState({
            user: null,
            session: null,
            loading: false
          })
        }
      }
    }

    getSession()

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      if (mounted) {
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false
        })
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })
      console.log('SignUp result:', { data, error })
      return { data, error }
    } catch (error) {
      console.error('SignUp error:', error)
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      console.log('SignIn result:', { data, error })
      return { data, error }
    } catch (error) {
      console.error('SignIn error:', error)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      console.log('SignOut result:', { error })
      return { error }
    } catch (error) {
      console.error('SignOut error:', error)
      return { error }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email)
      return { data, error }
    } catch (error) {
      console.error('ResetPassword error:', error)
      return { data: null, error }
    }
  }

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    resetPassword
  }
}