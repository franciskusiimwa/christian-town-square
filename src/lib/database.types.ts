export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username: string
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          title: string
          details: string | null
          author_id: string | null
          author_name: string
          is_anonymous: boolean
          topics: string[]
          answer_count: number
          view_count: number
          status: 'active' | 'closed' | 'deleted'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          details?: string | null
          author_id?: string | null
          author_name?: string
          is_anonymous?: boolean
          topics: string[]
          answer_count?: number
          view_count?: number
          status?: 'active' | 'closed' | 'deleted'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          details?: string | null
          author_id?: string | null
          author_name?: string
          is_anonymous?: boolean
          topics?: string[]
          answer_count?: number
          view_count?: number
          status?: 'active' | 'closed' | 'deleted'
          created_at?: string
          updated_at?: string
        }
      }
      answers: {
        Row: {
          id: string
          question_id: string
          author_id: string | null
          author_name: string
          body: string
          votes: number
          is_verified: boolean
          is_pinned: boolean
          has_citations: boolean
          status: 'active' | 'deleted'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question_id: string
          author_id?: string | null
          author_name?: string
          body: string
          votes?: number
          is_verified?: boolean
          is_pinned?: boolean
          has_citations?: boolean
          status?: 'active' | 'deleted'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          author_id?: string | null
          author_name?: string
          body?: string
          votes?: number
          is_verified?: boolean
          is_pinned?: boolean
          has_citations?: boolean
          status?: 'active' | 'deleted'
          created_at?: string
          updated_at?: string
        }
      }
      question_views: {
        Row: {
          id: string
          question_id: string
          viewer_ip: string | null
          viewer_id: string | null
          viewed_at: string
        }
        Insert: {
          id?: string
          question_id: string
          viewer_ip?: string | null
          viewer_id?: string | null
          viewed_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          viewer_ip?: string | null
          viewer_id?: string | null
          viewed_at?: string
        }
      }
      replies: {
        Row: {
          id: string
          answer_id: string
          author_id: string | null
          author_name: string
          body: string
          status: 'active' | 'deleted'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          answer_id: string
          author_id?: string | null
          author_name?: string
          body: string
          status?: 'active' | 'deleted'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          answer_id?: string
          author_id?: string | null
          author_name?: string
          body?: string
          status?: 'active' | 'deleted'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      record_question_view: {
        Args: {
          p_question_id: string
          p_viewer_ip: string
          p_viewer_id?: string | null
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
